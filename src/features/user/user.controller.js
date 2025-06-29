import UserRepository from "./user.repository.js";
import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export default class UserController {
	constructor() {
		this.userRepository = new UserRepository();
	}

	async signUp(req, res, next) {
		try {
			// console.log(req.body);
			const {name, email, password, gender} = req.body;
			const hashedPassword = await bcrypt.hash(password, 10); // for hashing the password
			//send to model
			const user = new UserModel(
				name,
				email,
				hashedPassword,
				gender,
				req.file?.filename
			);
			// console.log("new user ", user);
			const newUser = await this.userRepository.signup(user);
			res.status(201).send(newUser); // success and client response
		} catch (err) {
			next(err);
		}
	}

	async signIn(req, res, next) {
		try {
			const {email, password} = req.body;
			// check for user exist
			const user = await this.userRepository.findByEmail(email);
			if (!user) {
				res.status(400).json({message: "Incorrect Credentials"});
			} else {
				// compare password with hashed password
				const result = await bcrypt.compare(password, user.password);
				if (result) {
					const token = jwt.sign({
						userID: user._id,
						email: user.email
					}, process.env.JWT_SECRET, {expiresIn: '5h'})

					//populate the token to database for the user
					await this.userRepository.populateToken(user, token);
					res.status(200).json({message: "Signin Successful", token: token})
				} else {
					res.status(400).json({message: "Password mismatch"});
				}
			}

		} catch (err) {
			next(err);
		}
	}

	async logOut(req, res) {
		const token = req.headers["authorization"];
		if (!token) {
			return res.status(400).json({success: false, message: "No Token found"});
		} else {
			const user = await this.userRepository.findUserByUserID(req.userID);
			// console.log(user);
			if (user) {
				const userTokens = user.token;
				for (let i = 0; i < userTokens.length; i++) {
					if (userTokens[i] === token) await this.userRepository.addToBlackList(userTokens[i]);
				}

				// add all the remaining tokens which are not matched with current token to the token list of user array
				const remainingTokens = userTokens.filter(t => t !== token);
				// console.log('remaining token ', remainingTokens);
				await this.userRepository.addNewToken(user, remainingTokens);
			}

			return res.status(201).json({success: true, message: "Logged out Successfully"})
		}
	}

	async logOutAllDevices(req, res) {
		const user = await this.userRepository.findUserByUserID(req.userID);
		if (!user) {
			return res.status(400).json({success: false, message: "Failed to logged out from all devices"});
		} else {
			const userTokens = user.token;
			for (let i = 0; i < userTokens.length; i++) {
				await this.userRepository.addToBlackList(userTokens[i]);
			}
			await this.userRepository.deleteAllTokens(req.userID);
			return res.status(201).json({success: true, message: "Logged out from all devices successfully"});
		}
	}

	async getUserDetails(req, res) {
		const userID = req.params.userID;
		const user = await this.userRepository.findUserByUserID(userID);
		if (!user) {
			return res.status(400).json({success: false, message: "Failed to fetch user"});
		}

		return res.status(201).json({success: true, message: "User data fetch Successfully", data: user});
	}

	async getAllUserDetails(req, res, next) {
		try {
			const allUsers = await this.userRepository.getAllUsers();
			return res.status(201).json({success: true, message: "All Users", data: allUsers})
		} catch (err) {
			next(err)
		}
	}

	async updateUserDetails(req, res, next) {
		try {
			const userID = req.userID;
			const name = req.body.name;
			const gender = req.body.gender;
			const avatar = req.file ? req.file.filename : "Image not updated";

			await this.userRepository.updateUser(userID, name, gender, avatar);
			return res.status(201).json({success: true, message: "Profile Updated Successfully"})
		} catch (err) {
			next(err);
		}
	}
}