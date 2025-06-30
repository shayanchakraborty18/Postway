import express from "express";
import {OtpController} from "./otp.controller.js";
import {jwtAuthenticate} from "../../middlewares/jwt.middleware.js";

const otp_router = express.Router();
const otp_controller = new OtpController();

otp_router.post("/send", jwtAuthenticate, (req, res, next) => {
	otp_controller.sendOtp(req, res, next);
});
otp_router.get("/verify/:otp", jwtAuthenticate, (req, res, next) => {
	otp_controller.verifyOtp(req, res, next);
});
otp_router.post("/reset-password", jwtAuthenticate, (req, res, next) => {
	otp_controller.resetPassword(req, res, next);
});

export default otp_router;
