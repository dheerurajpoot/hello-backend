import mongoose from "mongoose";

let chatSchema = new mongoose.Schema(
	{
		members: {
			type: Array,
		},
	},
	{ timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
