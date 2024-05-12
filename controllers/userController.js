import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
