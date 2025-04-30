import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../middleware/mailer.js";
dotenv.config();

export const SignUp = async (req, res, next) => {
    try {
        let { firstName, lastName, email, password } = req.body;

        let existUser = await User.findOne({ email });
        if (existUser) {
            console.error("user already exist");
            return res.status(409).json({ error: "user already exist" });
        }

        let saltKey = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, saltKey);

        let result = new User({
            email, firstName, lastName, password
        });

        await result.save();

        return res.status(201).json({ msg: "Sign Up success", user: result })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const SignIn = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "Please Enter SingUp Email" });
        }
        const status = bcrypt.compareSync(password, user.password);
        if (status) {
            return res.status(200).json({ message: "Sign In Successfully", user, token: generateToken(user._id) });
        } else {
            return res.status(401).json({ message: "Invalid password " });
        }
    } catch (err) {
        console.log("Invalid email Id", err);
        return res.status(500).json({ message: "Invalid email Id", err });
    }
}

export const GetUsers = async (req, res, next) => {
    try {
        const user = await User.find();

        if (!user)
            return res.status(400).json({ message: "user not found" });

        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "Inernal server err", err });
    }
}

export const ResetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        });

        const saltKey = bcrypt.genSaltSync(10);
        const EncryptPass = bcrypt.hashSync(password, saltKey);

        user.password = EncryptPass;
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();

        return res.status(200).json({ message: "password reset success" });
    } catch (err) {
        return res.status(500).json({ error: "internal server error", err });
    }
}

export const ForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ error: "user not found" });

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 300000;

        await user.save();

        const resetlink = `http://localhost:3000/reset-passwrd?token=${token}`;

        const htmlcontent = `<html><head><title>reset</title></head><body><a href=${resetlink} style="color:black" target="_blank">Reset Password</a></body></html>`;

        console.log(user);
        let response = await sendEmail({
            to: email,
            subject: "password reset",
            html: htmlcontent,
        })

        return res.status(200).json({ message: "Invalid email Id" });
    } catch (err) {
        return res.status(500).json({ err })
    }
}

const generateToken = (userId) => {
    const secretKey = process.env.SECRET_KEY;
    let token = jwt.sign({ payload: userId }, secretKey);
    return token;
}