import PostRepository from "./post.repository.js";

class PostController {
	constructor() {
		this.postRepository = new PostRepository();
	}

	async createPost(req, res, next) {
		const userID = req.userID;
		const caption = req.body.caption;
		const imageUrl = req.file?.filename;

		try {
			const newPost = await this.postRepository.addPost(userID, caption, imageUrl);
			return res.status(201).json({success: true, message: "Post added Successfully", post: newPost});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async getAllPosts(req, res, next) {
		try {
			const allPosts = await this.postRepository.getAll();
			return res.status(201).json({success: true, message: "Post Fetched Successfully", posts: allPosts});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async getSinglePost(req, res, next) {
		try {
			const postID = req.params.postId;
			const post = await this.postRepository.getPost(postID);
			return res.status(201).json({success: true, message: "Single Post Successfully", post: post});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async getPostByUser(req, res, next) {
		try {
			const userID = req.params.userId;
			const posts = await this.postRepository.getPostsByUserID(userID);
			return res.status(201).json({success: true, message: "Post Fetched Successfully", posts: posts});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async updatePost(req, res, next) {
		try {
			const postID = req.params.postId;
			const {caption} = req.body;
			const imageUrl = req.file?.filename;
			const post = await this.postRepository.updatePostByID(postID, caption, imageUrl);
			return res.status(201).json({success: true, message: "Post Updated Successfully", post: post});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async deletePost(req, res, next) {
		try {
			const postID = req.params.postId;
			await this.postRepository.deletePost(postID);
			return res.status(201).json({success: true, message: "Post Deleted Successfully"});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

}


export default PostController