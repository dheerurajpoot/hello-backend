import mongoose from "mongoose";

let chatSchema = new mongoose.Schema(
	{
		members: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			receiver: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	},
	{ timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
