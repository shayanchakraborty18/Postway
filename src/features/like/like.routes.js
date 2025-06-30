import express from "express";
import LikeController from "./like.controller.js";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";

const like_routes = express.Router();

const like_controller = new LikeController();

like_routes.post("/toggle/:id", jwtAuthenticate, (req, res, next) => {
	like_controller.toggleLike(req, res, next);
});
like_routes.get("/:id", jwtAuthenticate, (req, res, next) => {
	like_controller.getLike(req, res, next);
});

export default like_routes;