import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;
		if (!name || !username || !email || !password) {
			return res.status(401).json({
				message: "All fields are required !",
				success: false,
			});
		}
		const user = await User.findOne({ email });
		if (user) {
			return res.status(401).json({
				message: "User Already Exists",
				success: false,
			});
		}
		// password hashing
		const hashedPassword = await bcryptjs.hash(password, 12);

		await User.create({
			name,
			username,
			email,
			password: hashedPassword,
		});
		return res.status(201).json({
			message: "Account Created Successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

// user login

export const logIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(401).json({
				message: "All fields are required !",
				success: false,
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "Email or Password is Incorrect",
				success: false,
			});
		}
		const passwordMached = await bcryptjs.compare(password, user.password);
		if (!passwordMached) {
			return res.status(401).json({
				message: "Email or Password is Incorrect",
				success: false,
			});
		}

		//tokens

		const tokenData = {
			userID: user._id,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
			expiresIn: "3d",
		});
		return res
			.status(201)
			.cookie("token", token, { expiresIn: "3d", httpOnly: true })
			.json({
				message: `Welcome back: ${user.name}`,
				user,
				success: true,
			});
	} catch (error) {
		console.log(error);
	}
};

// logout
export const logOut = (req, res) => {
	return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
		message: "You have logged out successfully",
		success: true,
	});
};
// get profile data
export const getProfile = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findOne({ _id: id }).select("-password");
		return res.status(200).json({
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
// get all users
export const getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find().select("-password");
		return res.status(200).json({
			allUsers,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

//suggest friends
export const suggestedFriends = async (req, res) => {
	try {
		const { id } = req.params;
		const otherUsers = await User.find({ _id: { $ne: id } }).select(
			"-password"
		);

		if (otherUsers.length === 0) {
			return res.status(404).json({
				message: "No suggested friends found",
			});
		}

		return res.status(200).json({
			otherUsers,
		});
	} catch (error) {
		console.error("Error in fetching suggested friends:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

//follow
export const follow = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const userId = req.params.id;
		const loggedInUser = await User.findById(loggedInUserId);
		const user = await User.findById(userId);
		if (!user.followers.includes(loggedInUserId)) {
			await user.updateOne({ $push: { followers: loggedInUserId } });
			await loggedInUser.updateOne({ $push: { following: userId } });
		} else {
			return res.status(401).json({
				message: `user already followed to ${user.name}`,
			});
		}
		return res.status(200).json({
			message: `${loggedInUser.name} just followed to ${user.name}`,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

//unfollow
export const unFollow = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const userId = req.params.id;
		const loggedInUser = await User.findById(loggedInUserId);
		const user = await User.findById(userId);
		if (loggedInUser.following.includes(userId)) {
			await user.updateOne({ $pull: { followers: loggedInUserId } });
			await loggedInUser.updateOne({ $pull: { following: userId } });
		} else {
			return res.status(401).json({
				message: `you have not followed to ${user.name}`,
			});
		}
		return res.status(200).json({
			message: `${loggedInUser.name} unfollowed to ${user.name}`,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

// gemerate reset password token and send reset link

export const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(401).json({
				message: "Email is required!",
				success: false,
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "User with this email does not exist!",
				success: false,
			});
		}

		// Generate a reset token
		const resetToken = crypto.randomBytes(20).toString("hex");

		// Set token and expiration in the user's record
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

		await user.save();

		// Send email with the reset token
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL, // Your email
				pass: process.env.EMAIL_PASSWORD, // Your email password
			},
		});

		const mailOptions = {
			to: user.email,
			from: process.env.EMAIL,
			subject: "Password Reset Link",
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://localhost:5173/reset-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
		};

		transporter.sendMail(mailOptions, (error, response) => {
			if (error) {
				console.error("There was an error: ", error);
			} else {
				res.status(200).json({
					message: "Password reset email sent",
					success: true,
				});
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// reset password

export const resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		if (!token || !password) {
			return res.status(401).json({
				message: "All fields are required!",
				success: false,
			});
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(401).json({
				message: "Password reset token is invalid or has expired.",
				success: false,
			});
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(password, 12);

		// Set the new password and clear the reset token fields
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		return res.status(200).json({
			message: "Password has been reset successfully.",
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
