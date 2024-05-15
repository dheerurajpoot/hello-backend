import { Chat } from "../models/chatSchema.js";

// create user chat
export const createChat = async (req, res) => {
	const newChat = new Chat({
		members: { sender: req.body.senderId, receiver: req.body.receiverId },
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
			$or: [
				{ "members.sender": req.params.userId },
				{ "members.receiver": req.params.userId },
			],
		})
			.populate("members.receiver")
			.exec();
		res.status(200).json(userChat);
	} catch (error) {
		res.status(500).json(error);
	}
};

// find current user chat
export const findChat = async (req, res) => {
	try {
		const chat = await Chat.findOne({
			"members.sender": req.params.firstId,
			"members.receiver": req.params.secondId,
		});
		res.status(200).json(chat);
	} catch (error) {
		res.status(500).json(error);
	}
};
