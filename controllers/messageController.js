import { Message } from "../models/messageSchema.js";

export const createMessage = async (req, res) => {
	const { chatId, senderId, message } = req.body;
	const msg = new Message({
		chatId,
		senderId,
		message,
	});
	try {
		const result = await msg.save();
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getMessage = async (req, res) => {
	const { chatId } = req.params;
	try {
		const result = await Message.find({ chatId });
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json(error);
	}
};
