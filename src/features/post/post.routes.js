import express from "express";
import postController from "./post.controller.js";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";
import {uploadB} from "../../middlewares/file-upload.middleware.js";

const post_routes = express.Router();

const post_controller = new postController();

post_routes.post("/", jwtAuthenticate, uploadB.single("imageUrl"), (req, res, next) => {
	post_controller.createPost(req, res, next);
});

post_routes.get("/all", jwtAuthenticate, (req, res, next) => {
	post_controller.getAllPosts(req, res, next);
});

post_routes.get("/:postId", jwtAuthenticate, (req, res, next) => {
	post_controller.getSinglePost(req, res, next);
});

post_routes.get("/user/:userId", jwtAuthenticate, (req, res, next) => {
	post_controller.getPostByUser(req, res, next);
});

post_routes.put("/:postId", jwtAuthenticate, uploadB.single("imageUrl"), (req, res, next) => {
	post_controller.updatePost(req, res, next);
});
post_routes.delete("/:postId", jwtAuthenticate, (req, res, next) => {
	post_controller.deletePost(req, res, next);
});

export default post_routes;