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

const corsOpts = {
	origin: "*",

	methods: ["GET", "POST"],

	allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.get("/", function (req, res) {
	res.send("Server is running.....");
});

//api urls
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

app.listen(process.env.PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
