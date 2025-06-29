import {Schema} from "mongoose";

export const commentSchema = new Schema({
	comment: {
		type: String,
		required: true
	},
	userID: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	postID: {
		type: Schema.Types.ObjectId,
		ref: "Post",
		required: true
	}
});

