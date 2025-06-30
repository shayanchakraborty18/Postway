import mongoose from "mongoose";
import {userSchema} from "./user.schema.js";
import {blacklistedTokenSchema} from "./blacklistedToken.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";
import jwt from "jsonwebtoken";


//creation of model from userSchema
const UserModel = mongoose.model("User", userSchema);

// creation of BlacklistedTokenModel
const BlacklistedTokenModel = new mongoose.model('BlacklistedToken', blacklistedTokenSchema);

//creating user repository for database operation for user model
export default class UserRepository {

	//check user exist
	async

	//handle signup
	async signup(user) {
		try {
			const newUser = new UserModel(user);
			return await newUser.save();
		} catch (err) {
			console.log(err);
			if (err instanceof mongoose.Error.ValidationError) {
				throw new ApplicationError(
					"incorrect credential provide valid data",
					400
				);
			} else {
				throw new ApplicationError("Something went wrong with database", 500);
			}
		}
	}

	async findByEmail(email) {
		try {
			return await UserModel.findOne({email});
		} catch (err) {
			throw new ApplicationError("Something went wrong with database", 500);
		}
	}

	async populateToken(user, token) {
		const checkForToken = user.token || [];
		const filter = {_id: user._id};
		const update = {token: [...checkForToken, token]}
		await UserModel.findOneAndUpdate(filter, update);
	}

	async findUserByUserID(userID) {
		try {
			return await UserModel.findById(userID);
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Something went wrong with database", 500);
		}
	}

	async getAllUsers() {
		try {
			return await UserModel.find().select("-token -_id -__v -password");
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Something went wrong with database", 500);
		}
	}

	async updateUser(userID, name, gender, avatar) {
		try {
			const user = await UserModel.findById(userID);
			if (name) {
				user.name = name;
			}

			if (gender) {
				user.gender = gender;
			}

			if (avatar) {
				user.avatar = avatar;
			}

			return await user.save()
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Something went wrong with database", 500);
		}
	}

	async addToBlackList(token) {
		try {
			const decoded = jwt.decode(token);
			const expiresAt = new Date(decoded.exp * 1000);
			const blackListedToken = new BlacklistedTokenModel({token, expiresAt})
			return await blackListedToken.save();
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Something went wrong with database", 500);
		}
	}

	async addNewToken(user, tokens) {
		await UserModel.findOneAndUpdate({_id: user._id}, {token: tokens});
	}

	async deleteAllTokens(userID) {
		const token = [];
		await UserModel.findOneAndUpdate({_id: userID}, {token: token});
	}
}
