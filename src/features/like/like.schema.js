import {Schema} from "mongoose";

export const likeSchema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	likeable: {
		type: Schema.Types.ObjectId,
		refPath: "on_model"
	},
	on_model: {
		type: String,
		enum: ["Post", "Comment"]
	}
})