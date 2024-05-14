import { Chat } from "../models/chatSchema.js";

// create user chat
export const createChat = async (req, res) => {
	const newChat = new Chat({
		members: [req.body.senderId, req.body.receiverId],
	});
	try {
		const result = await newChat.save();
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json(error);
	}
};

//  find user chat
export const userChats = async (req, res) => {
	try {
		const userChat = await Chat.find({
			members: { $all: [req.params.userId] },
			"members.0": req.params.userId,
		});
		res.status(200).json(userChat);
	} catch (error) {
		res.status(500).json(error);
	}
};

// find current user chat
export const findChat = async (req, res) => {
	try {
		const chat = await Chat.findOne({
			members: { $all: [req.params.firstId, req.params.secondId] },
		});
		res.status(200).json(chat);
	} catch (error) {
		res.status(500).json(error);
	}
};
