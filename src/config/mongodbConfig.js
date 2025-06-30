import mongoose from "mongoose";

const DB_URL = process.env.DB_URL || `mongodb://0.0.0.0:27017`;

const FULL_URL = DB_URL + '/Postway';

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(FULL_URL);
		console.log("Database Connection Successful");
	} catch (err) {
		throw new Error(`Error in Database Connection ${err}`);
	}
}
export default connectToMongoDB;