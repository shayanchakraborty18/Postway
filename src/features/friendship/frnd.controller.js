import FriendshipRepository from "./frndship.repository.js";

export default class FriendshipController {
	constructor() {
		this.frndshipRepository = new FriendshipRepository();
	}

	async toggleFriendShip(req, res, next) {
		try {
			const friendID = req.params.friendID;
			const userID = req.userID;
			const pendingReq = await this.frndshipRepository.toggleFrndReq(friendID, userID);
			res.status(201).send(pendingReq);
		} catch (error) {
			next(error);
		}
	}

	async getPendingReq(req, res, next) {
		try {
			const userID = req.userID;
			const pendingReq = await this.frndshipRepository.getPendingReq(userID);
			if (pendingReq) {
				res.status(201).send(pendingReq);
			} else {
				res.status(404).send("There is no pending request!!");
			}
		} catch (error) {
			next(error);
		}
	}

	async responseToReq(req, res, next) {
		try {
			const userID = req.userID;
			const friendID = req.params.friendID;
			await this.frndshipRepository.responseToReq(userID, friendID);
			res.status(201).send("updated successfully!!");
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	async getFriends(req, res, next) {
		try {
			const userID = req.params.userID;
			const friends = await this.frndshipRepository.getFriends(userID);
			if (friends) {
				res.status(201).send(friends);
			} else {
				res.status(404).send("No friends of this user");
			}
		} catch (error) {
			next(error);
		}
	}
}