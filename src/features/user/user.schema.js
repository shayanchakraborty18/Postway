import { Schema } from "mongoose";

export const userSchema = new Schema({
	name: {
		type: String,
		maxlength: [25, "Name must not be greater than 25 character"],
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		match: [/.+\@.+\../, "Please enter valid email"]
	},
	password: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true,
		enum: ["male", "female"]
	},
	token: [
		{
			type: Object
		}
	],
	avatar: String
});
