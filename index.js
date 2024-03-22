import express from 'express';
import cookieParser from 'cookie-parser'
import dbConnect from './config/dbconnect.js';
import 'dotenv/config';
import userRoute from './routes/userRoutes.js';
import postRoute from './routes/postRoutes.js';
import cors from 'cors'

dbConnect()
const app = express();

//middilewares
app.use(express.urlencoded({
  extended:true
}));
app.use(express.json());
app.use(cookieParser());

const corsOption ={
  // origin:"http://localhost:5173",
  origin:"https://hello-frontend-livid.vercel.app",
  credentials:true
}
app.use(cors(corsOption));

app.get('/', function (req, res) {
  res.send('Server is running.....')
});

//api or url
app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)

app.listen(process.env.PORT, ()=>{
  console.log(`Server is listening on port ${process.env.PORT}`);
})
