import mongoose from "mongoose";
import {userSchema} from "../user/user.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";
import mailService from "../../services/mail.service.js";

let otp = "";
let isOtpMatched = false;

const UserModel = mongoose.model("User", userSchema);

export class OtpRepository {
	async verifyOtp(sentOtp) {
		if (sentOtp === otp) {
			isOtpMatched = true;
		}
		return isOtpMatched;
	}

	async resetPassword(userID, hashedPassword) {
		try {
			let user = await UserModel.findById({
				_id: userID,
			});
			if (user) {
				user.password = hashedPassword;
				user.save(); //update and save
			} else {
				throw new ApplicationError("No such user found", 500);
			}
		} catch (error) {
			console.log(error);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async sendOtp(userID) {
		try {
			let user = await UserModel.findOne({
				_id: userID,
			});
			await mailService.sendMail(
				"info@abc.com",
				user.email,
				"Welcome to Postway Social Media",
				`Otp: ${this.getRandomOtp()}`
			);
		} catch (error) {
			console.log(error);
			throw new ApplicationError("Something went wrong with otp database", 500);
		}
	}

	getRandomOtp() {
		let digits = "01234567890123456789";

		for (let i = 0; i < 6; i++) {
			otp += digits[Math.floor(Math.random() * 10)];
		}
		return otp;
	}
}
