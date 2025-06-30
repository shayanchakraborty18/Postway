import LikeRepository from "./like.repository.js";
import PostRepository from "../post/post.repository.js";
import {CommentRepository} from "../comment/comment.repository.js";

export default class LikeController {
	constructor() {
		this.likeRepository = new LikeRepository();
		this.postRepository = new PostRepository();
		this.commentRepository = new CommentRepository();
	}

	async toggleLike(req, res, next) {
		try {
			const id = req.params.id;
			const post = await this.postRepository.getPost(id);
			const comment = await this.commentRepository.getCommentByID(id);
			if (post) {
				await this.likeRepository.likeForPost(req.userID, id);
				res.status(201).json({success: true, message: "Post is liked"});
			} else if (comment) {
				await this.likeRepository.likeForComment(req.userID, id);
				res.status(201).json({success: true, message: "Comment is liked"});
			} else {
				res.status(400).send("You cant like this post or comment");
			}
		} catch (err) {
			next(err);
		}
	}

	async getLike(req, res, next) {
		try {
			const id = req.params.id;
			const post = await this.postRepository.getPost(id);
			const comment = await this.commentRepository.getCommentByID(id);
			if (post) {
				const postLikes = await this.likeRepository.getLikeForPost(id);
				res.status(201).json({success: true, likes: postLikes})
			} else if (comment) {
				const commentLikes = await this.likeRepository.getLikeForComment(id);
				res.status(201).json({success: true, likes: commentLikes})
			} else {
				res.status(404).send("no liked post or comment found");
			}
		} catch (error) {
			next(error);
		}
	}
}