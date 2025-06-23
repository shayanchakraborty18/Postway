import './env.js';
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";
import connectToMongoDB  from "./config/mongodbConfig.js";
import { ApplicationError } from "./error-handler/applicationError.js";
import apiDocs from './swagger.json' with { type: "json" }

// logger middleware
import loggerMiddleware from "./middlewares/logger.middleware.js";

// create server
const server = express();
const port = process.env.PORT || 3000;

server.use(cors()); // apply cors

server.use(express.json()); // to accept json

// swagger open api for testing
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware); // use logger middleware

server.get("/", (req, res) => {
	res.redirect("/api-docs");
});

//Error handler middleware
server.use((err, req, res, next) => {
	console.log(err);

	// handle mongoose error
	if(err instanceof mongoose.Error.ValidationError) {
		return res.status(400).send(err.message);
	}

	// handle application error
	if(err instanceof ApplicationError) {
		return res.status(err.code).send(err.message);
	} else {
		// server error
		res.status(500).send("Something went wrong. Please try again");
	}
});

// handle 404 error
server.use((req, res) => {
	res.status(404).send("API not found . Please check the documentation");
})













server.listen(port, async () => {
	console.log(`Server running at port ${port}`);

	//connect to mongo db
	await connectToMongoDB();
});

