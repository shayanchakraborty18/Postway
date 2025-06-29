import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {blacklistedTokenSchema} from "../features/user/blacklistedToken.schema.js";

const BlacklistedTokenModel = new mongoose.model('BlacklistedToken', blacklistedTokenSchema);

export async function jwtAuthenticate(req, res, next) {
	const jwtToken = req.headers["authorization"];

	//check for token exist
	if (!jwtToken) {
		console.log("Error: token not found");
		return res.status(401).json({success: false, message: "Token not found"});
	}

	//check for blacklisted token
	const isBlacklisted = await BlacklistedTokenModel.findOne({token: jwtToken});
	if (isBlacklisted) return res.status(401).json({success: false, message: "Unauthorised: Please Login in"});

	// token found
	try {
		const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
		req.userID = payload.userID;
	} catch (err) {
		console.log(err);
		return res.status(401).json({success: false, message: "Unauthorised User"});
	}

	next();
}
