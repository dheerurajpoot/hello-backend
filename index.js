import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbconnect.js";
import "dotenv/config";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
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

// cors
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.get("/", function (req, res) {
	res.send("Server is running.....");
});

//api urls
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
