import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    resetToken: {
        type: String
    },
    resetTokenExpire: {
        type: Date
    }
}, {
    timestamps: true
});


export const User = mongoose.model("User", UserSchema);
