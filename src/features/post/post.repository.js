import {ApplicationError} from "../../error-handler/applicationError.js";
import {PostModel} from "./post.model.js";
import mongoose from "mongoose";
import {postSchema} from "./post.schema.js";

const PModel = mongoose.model("Post", postSchema);

class PostRepository {

	async addPost(userID, caption, imageUrl) {
		try {
			const post = new PostModel(userID, caption, imageUrl);

			const newPost = new PModel({
				userID: post.userID,
				caption: post.caption,
				imageUrl: post.imageUrl
			});

			return await newPost.save();

		} catch (err) {
			throw new ApplicationError("Error in database operation", 400);
		}
	}

	async getAll() {
		try {
			return await PModel.find().lean().populate("userID", "_id name email");
			// console.log("All post ", posts)
		} catch (err) {
			throw new ApplicationError("Error in database operation", 400);
		}
	}

	async getPost(postID) {
		try {
			return await PModel.findById(postID).lean().populate("userID", "_id name email");
		} catch (err) {
			throw new ApplicationError("Error in database operation", 400);
		}
	}

	async getPostsByUserID(userID) {
		try {
			return await PModel.find({userID: userID}).lean();
		} catch (err) {
			throw new ApplicationError("Error in database operation", 400);
		}
	}

	async updatePostByID(postID, caption, imageUrl) {
		try {
			return await PModel.findByIdAndUpdate(postID, {caption: caption, imageUrl: imageUrl});
		} catch (err) {
			throw new ApplicationError("Error in database operation", 400);
		}
	}

	async deletePost(postID) {
		try {
			await PModel.findOneAndDelete({_id: postID});
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database operation", 400);
		}
	}
}

export default PostRepository;