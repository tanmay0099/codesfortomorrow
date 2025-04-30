import express from "express";
const route = express.Router();

import { SignUp, SignIn, GetUsers, ForgetPassword, ResetPassword } from "../controller/user.controller.js";

route.post("/sign-up", SignUp);
route.post("/sign-in", SignIn);
route.get("/get-users", GetUsers);
route.post("/forget-password", ForgetPassword);
route.post("/reset-password", ResetPassword)

export default route;