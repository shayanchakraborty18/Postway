import {Schema} from 'mongoose';

export const blacklistedTokenSchema = new Schema({
	token: {type: String, required: true, unique: true},
	expiresAt: {type: Date, required: true}
});


blacklistedTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});