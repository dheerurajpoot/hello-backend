import mongoose from "mongoose";

// Declare the Schema of the Mongo model
let postSchema = new mongoose.Schema(
	{
		description: {
			type: String,
		},
		image: {
			type: String,
		},
		like: {
			type: Array,
			default: [],
		},
		comment: {
			type: Array,
			default: [],
		},
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		userDetails: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

//Export the model
export const Post = mongoose.model("Post", postSchema);
