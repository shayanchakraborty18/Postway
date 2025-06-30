import express from "express";
import FriendshipController from "./frnd.controller.js";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";

const frndship_routes = express.Router();
const frndship_controller = new FriendshipController();

frndship_routes.post("/toggle-friendship/:friendID", jwtAuthenticate, (req, res, next) => {
	frndship_controller.toggleFriendShip(req, res, next);
});

frndship_routes.get("/get-pending-requests", jwtAuthenticate, (req, res, next) => {
	frndship_controller.getPendingReq(req, res, next);
});

frndship_routes.post("/response-to-request/:friendID", jwtAuthenticate, (req, res, next) => {
	frndship_controller.responseToReq(req, res, next);
});

frndship_routes.get("/get-friends/:userID", jwtAuthenticate, (req, res, next) => {
	frndship_controller.getFriends(req, res, next);
});
export default frndship_routes;