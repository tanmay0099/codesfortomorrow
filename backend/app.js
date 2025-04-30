import express from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/user.routes.js";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.use("/user", UserRoute);

        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log("Server Started");
        })
    }).catch(err => {
        console.log(err);
    });
