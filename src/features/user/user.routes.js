import express from "express";
import UserController from "./user.controller.js";
import {uploadA} from "../../middlewares/file-upload.middleware.js";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";


// initialise user router
const user_router = express.Router();
const user_controller = new UserController();

//all user routes are defined here
user_router.post("/signup", uploadA.single('avatar'), (req, res, next) => {
	user_controller.signUp(req, res, next)
});
user_router.post("/signin", (req, res, next) => {
	user_controller.signIn(req, res, next)
});

user_router.post("/logout", jwtAuthenticate, (req, res) => {
	user_controller.logOut(req, res);
});

user_router.post("/logout-all-devices", jwtAuthenticate, (req, res) => {
	user_controller.logOutAllDevices(req, res);
});

user_router.get("/get-user-details/:userID", jwtAuthenticate, (req, res) => {
	user_controller.getUserDetails(req, res);
});

user_router.get("/get-all-details", jwtAuthenticate, (req, res, next) => {
	user_controller.getAllUserDetails(req, res, next);
});

user_router.put("/update-details", jwtAuthenticate, uploadA.single('avatar'), (req, res, next) => {
	user_controller.updateUserDetails(req, res, next);
});
user_router.post("/test", jwtAuthenticate, (req, res) => {
	res.send('test')
});
export default user_router;