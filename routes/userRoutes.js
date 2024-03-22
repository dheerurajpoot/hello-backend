import express from "express";
import { follow, getProfile, logIn, logOut, register, suggestedFriends, unFollow } from "../controllers/userController.js";
import userAuth from "../middilewares/userAuth.js";

const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(logIn);
router.route('/logout').get(logOut);
router.route('/profile/:id').get(userAuth, getProfile);
router.route('/suggested/:id').get(userAuth, suggestedFriends);
router.route('/follow/:id').post(userAuth , follow);
router.route('/unfollow/:id').post(userAuth , unFollow);

export default router;