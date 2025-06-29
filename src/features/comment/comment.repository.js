import mongoose from "mongoose";
import {commentSchema} from "./comment.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";

const CommentModel = new mongoose.model("Comment", commentSchema)

export class CommentRepository {

	async addComment(post_comment) {
		try {
			const newComment = new CommentModel({
				comment: post_comment.comment,
				userID: post_comment.userID,
				postID: post_comment.postID
			});
			return await newComment.save();
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async getCommentsByPostID(postID) {
		try {
			return await CommentModel.find({postID: postID})
				.lean().populate("userID", "_id name email");
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async getCommentByID(commentID) {
		try {
			return await CommentModel.findOne({_id: commentID})
				.lean()
				.populate("postID", "_id caption imageUrl")
				.populate("userID", "_id name email")
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async updateComment(userID, commentID, comment) {
		try {
			const filter = {_id: commentID, userID: userID};
			const update = {comment: comment};
			const options = {new: true};
			return await CommentModel.findOneAndUpdate(filter, update, options);
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async deleteComment(userID, commentID) {
		try {
			const filter = {_id: commentID, userID: userID};
			return await CommentModel.findOneAndDelete(filter);
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}
}