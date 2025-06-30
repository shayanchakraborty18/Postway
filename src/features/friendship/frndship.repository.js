import mongoose from "mongoose";
import {friendRequestSchema} from "./frnd.schema.js";
import {userFriendSchema} from "./frndship.userFriend.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";

const FriendRequestModel = mongoose.model("FriendRequest", friendRequestSchema);
const UserFriendModel = mongoose.model("UserFriend", userFriendSchema);

export default class FriendshipRepository {

	async toggleFrndReq(friendID, userID) {
		try {
			const existedFriendId = await FriendRequestModel.findOne({friendID: friendID});
			console.log("check for existed friend id", existedFriendId);
			const isHavingFrndReq = await FriendRequestModel.findOne({
				friendID: friendID,
				friendReqID: userID
			});
			if (isHavingFrndReq) {
				isHavingFrndReq.friendReqID.pull(userID);
				return await isHavingFrndReq.save();
			} else if (existedFriendId) {
				existedFriendId.friendReqID.push(userID);
				return await existedFriendId.save();
			} else {
				const newPendingRequest = new FriendRequestModel({
					friendID: friendID,
					friendReqID: userID
				});
				return await newPendingRequest.save();
			}
		} catch (err) {
			console.log(err);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async getPendingReq(userID) {
		try {
			const existedFriendId = await FriendRequestModel.findOne({
				friendID: userID,
			});
			if (existedFriendId) {
				return existedFriendId;
			}
		} catch (error) {
			console.log(error);
			throw new ApplicationError("Error in database", 500);
		}
	}

	async responseToReq(userID, friendID) {
		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const haveFrndReq = await FriendRequestModel.findOne({
				friendID: userID,
				friendReqID: friendID,
			});
			console.log("pending request present", haveFrndReq);
			const user = await UserFriendModel.findOne({
				userID: userID,
			});
			console.log("already have user", user);
			if (haveFrndReq) {
				await FriendRequestModel.updateOne(
					{friendID: userID},
					{$pull: {friendReqID: friendID}},
					{session}
				);
				if (!user) {
					await UserFriendModel.create(
						{
							userID: userID,
							friendID: friendID,
						},
						{session}
					);
				} else {
					await UserFriendModel.updateOne(
						{userID: userID},
						{$push: {friendID: friendID}},
						{session}
					);
				}
				await session.commitTransaction();
				await session.endSession();
			}
		} catch (error) {
			console.log(error);
			await session.abortTransaction();
			await session.endSession();
			throw new ApplicationError("Error in database", 500);
		}
	}

	async getFriends(userID) {
		const user = await UserFriendModel.findOne({userID: userID}).populate("friendID", "_id name email");
		if (!user) {
			return null;
		}
		return user.friendID;
	}
}