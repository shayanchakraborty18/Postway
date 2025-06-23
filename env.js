import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
	console.error("Unable to import environmental variable");
	throw result.error;
}

