import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbconnect.js";
import "dotenv/config";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import cors from "cors";

dbConnect();
const app = express();

//middilewares
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});
app.get("/", function (req, res) {
	res.send("Server is running.....");
});

//api urls
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

app.listen(process.env.PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
