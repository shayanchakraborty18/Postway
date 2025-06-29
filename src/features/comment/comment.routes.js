import express from "express";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";
import CommentController from "./comment.controller.js";

const comment_routes = express.Router();
const comment_controller = new CommentController();

comment_routes.post("/:postID", jwtAuthenticate, (req, res, next) => {
	comment_controller.addComment(req, res, next);
});

comment_routes.get("/:postID", jwtAuthenticate, (req, res, next) => {
	comment_controller.fetchCommentsByPostID(req, res, next);
});

comment_routes.get("/comment/:commentID", jwtAuthenticate, (req, res, next) => {
	comment_controller.fetchCommentByID(req, res, next);
});

comment_routes.put("/:commentID", jwtAuthenticate, (req, res, next) => {
	comment_controller.updateComment(req, res, next);
});

comment_routes.delete("/:commentID", jwtAuthenticate, (req, res, next) => {
	comment_controller.deleteComment(req, res, next);
});

export default comment_routes;