import mongoose from "mongoose";

// Declare the Schema of the Mongo model
let messageSchema = new mongoose.Schema(
	{
		chatId: {
			type: String,
		},
		senderId: {
			type: String,
		},
		message: {
			type: String,
		},
	},
	{ timestamps: true }
);

//Export the model
export const Message = mongoose.model("Message", messageSchema);
