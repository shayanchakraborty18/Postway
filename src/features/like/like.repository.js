import mongoose from "mongoose";
import {likeSchema} from "./like.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";

const LikeModel = mongoose.model("Like", likeSchema)

export default class LikeRepository {

	async likeForPost(userID, postID) {
		try {
			const checkLikes = await LikeModel.find({userID: userID, likeable: postID});
			if (checkLikes.length > 0) {
				await LikeModel.findOneAndDelete({userID: userID, likeable: postID});
			} else {
				// console.log("postID ", postID)
				const newLike = new LikeModel({
					userID: userID,
					likeable: postID,
					on_model: "Post"
				});
				return await newLike.save();
			}
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database operation", 500)
		}

	}

	async likeForComment(userID, commentID) {
		try {
			const checkLikes = await LikeModel.find({userID: userID, likeable: commentID});
			if (checkLikes.length > 0) {
				await LikeModel.findOneAndDelete({userID: userID, likeable: commentID});
			} else {
				const newLike = new LikeModel({
					userID: userID,
					likeable: commentID,
					on_model: "Comment"
				});
				return await newLike.save();
			}
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database operation", 500)
		}
	}

	async getLikeForPost(postID) {
		try {
			return await LikeModel.find({likeable: postID, on_model: "Post"})
				.lean().populate("userID", "_id name email");
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database operation", 500)
		}
	}

	async getLikeForComment(commentID) {
		try {
			return await LikeModel.find({likeable: commentID, on_model: "Comment"})
				.lean().populate("userID", "_id name email");
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database operation", 500)
		}
	}

}