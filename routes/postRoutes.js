import express from "express";
import {
	creatPost,
	deletePost,
	getAllPosts,
	getPosts,
	likeDislike,
} from "../controllers/postControler.js";
import userAuth from "../middilewares/userAuth.js";

const router = express.Router();
router.route("/create").post(userAuth, creatPost);
router.route("/delete/:id").delete(userAuth, deletePost);
router.route("/like/:id").put(userAuth, likeDislike);
router.route("/allposts/:id").get(userAuth, getAllPosts);
router.route("/posts/").get(getPosts);

export default router;
