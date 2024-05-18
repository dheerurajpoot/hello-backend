import express from "express";
import {
	follow,
	getAllUsers,
	getProfile,
	getUserWithFollowersAndFollowing,
	logIn,
	logOut,
	register,
	requestPasswordReset,
	resetPassword,
	suggestedFriends,
	unFollow,
	updateUserProfile,
} from "../controllers/userController.js";
import userAuth from "../middilewares/userAuth.js";

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(logOut);
router.route("/allusers").get(getAllUsers);
router.route("/profile/:id").get(userAuth, getProfile);
router.route("/update-profile/:id").put(userAuth, updateUserProfile);
router.route("/suggested/:id").get(userAuth, suggestedFriends);
router.route("/follow/:id").post(userAuth, follow);
router.route("/unfollow/:id").post(userAuth, unFollow);
router.route("/friends/:id").get(userAuth, getUserWithFollowersAndFollowing);
router.route("/request-password-reset").post(requestPasswordReset);
router.route("/reset-password").post(resetPassword);

export default router;
