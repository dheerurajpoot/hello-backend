import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema(
	{
		description: {
			type: String,
		},
		images: [
			{
				public_id: String,
				url: String,
			},
		],
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
