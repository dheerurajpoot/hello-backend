import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";

export const creatPost = async (req, res) => {
	try {
		const { description, image, id } = req.body;
		if (!description || !id) {
			return res.status(401).json({
				message: "fields are required!",
				success: false,
			});
		}
		const user = await User.findById(id).select("-password");
		await Post.create({
			description,
			image,
			userID: id,
			userDetails: user,
		});
		return res.status(201).json({
			message: "Post Created Successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

// delete post
export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		await Post.findByIdAndDelete(id);
		return res.status(200).json({
			message: "Post Deleted Successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

// post like
export const likeDislike = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (post.like.includes(loggedInUserId)) {
			await Post.findByIdAndUpdate(postId, {
				$pull: { like: loggedInUserId },
			});
			return res.status(200).json({
				message: "Post Disliked",
				success: true,
			});
		} else {
			await Post.findByIdAndUpdate(postId, {
				$push: { like: loggedInUserId },
			});
			return res.status(200).json({
				message: "Post Liked",
				success: true,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
//get all posts
export const getAllPosts = async (req, res) => {
	try {
		const id = req.params.id;
		const loggedInUser = await User.findById(id);
		const loggedInUserPosts = await Post.find({ userID: id });
		const followingUserPosts = await Promise.all(
			loggedInUser.following.map((otherUser) => {
				return Post.find({ userID: otherUser });
			})
		);
		return res.status(200).json({
			posts: loggedInUserPosts.concat(...followingUserPosts),
		});
	} catch (error) {
		console.log(error);
	}
};

// get total posts

export const getPosts = async (req, res) => {
	try {
		const posts = await Post.find();
		return res.status(200).json({
			posts,
		});
	} catch (error) {
		console.log(error);
	}
};
