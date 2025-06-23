import './env.js';
import express from "express";


const server = express();





server.listen(3000, () => {
	console.log(`Server running at port 3000`)
});

