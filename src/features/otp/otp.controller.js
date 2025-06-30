import {OtpRepository} from "./opt.repository.js";

import bcrypt from "bcrypt";

let isOtpMatch = false;

export class OtpController {
	constructor() {
		this.otpRepository = new OtpRepository();
	}

	async sendOtp(req, res, next) {
		try {
			const userID = req.userID;
			console.log("user:-", userID);
			await this.otpRepository.sendOtp(userID);
			res.status(201).send("OTP is sent");
		} catch (error) {
			next(error);
		}
	}

	async verifyOtp(req, res, next) {
		try {
			const otp = req.params.otp;
			isOtpMatch = await this.otpRepository.verifyOtp(otp);
			if (isOtpMatch) {
				res.status(201).send("otp is varified");
			} else {
				res.status(404).send("otp is not matched");
			}
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req, res, next) {
		const {newPassword} = req.body;
		const hashPassword = await bcrypt.hash(newPassword, 13);
		const userID = req.userID;
		try {
			if (isOtpMatch) {
				await this.otpRepository.resetPassword(userID, hashPassword);
				isOtpMatch = false;
				res.status(201).send("Password is updated");
			} else {
				res.status(404).send("sent a new otp please");
			}
		} catch (error) {
			next(error);
		}
	}
}
