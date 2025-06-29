import {CommentRepository} from "./comment.repository.js";
import CommentModel from "./comment.model.js";

export default class CommentController {
	constructor() {
		this.commentRepository = new CommentRepository();
	}

	async addComment(req, res, next) {
		try {
			const userID = req.userID;
			const postID = req.params.postID;
			const comment = new CommentModel(req.body.comment, userID, postID);

			const newComment = await this.commentRepository.addComment(comment);
			return res.status(201).json({success: true, message: "Comment Added Successfully", comment: newComment});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async fetchCommentsByPostID(req, res, next) {
		try {
			const postID = req.params.postID;
			const comments = await this.commentRepository.getCommentsByPostID(postID);
			return res.status(201).json({success: true, message: "Comments Fetched Successfully", comment: comments});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async fetchCommentByID(req, res, next) {
		try {
			const commentID = req.params.commentID;
			const comment = await this.commentRepository.getCommentByID(commentID);
			return res.status(201).json({success: true, message: "Comment Fetched Successfully", comment: comment});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async updateComment(req, res, next) {
		try {
			const commentID = req.params.commentID;
			const userID = req.userID;
			const comment = req.body.comment;
			const updatedComment = await this.commentRepository.updateComment(userID, commentID, comment);
			console.log(updatedComment);
			return res.status(201).json({success: true, message: "Comment Updated Successfully", comment: updatedComment});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async deleteComment(req, res, next) {
		try {
			const commentID = req.params.commentID;
			const userID = req.userID;
			const deletedComment = await this.commentRepository.deleteComment(userID, commentID);
			return res.status(201).json({success: true, message: "Comment Deleted Successfully", comment: deletedComment});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}


}