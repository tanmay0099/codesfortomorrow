import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "token missing" });
        }

        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.payload);

        if (!user) {
            return res.status(401).json({ error: "user not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "unauthorize access" });
    }
}