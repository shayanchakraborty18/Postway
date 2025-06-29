import {Schema} from "mongoose";

const postSchema = new Schema({
	caption: String,
	imageUrl: String,
	userID: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

export {postSchema};