import { Schema, model } from "mongoose";
import { emailRegexp } from "../constants/user.js";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User must have name"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: { type: String, required: true },
    token: {
      type: String,
    },
    verify: { type: Boolean, default: false },
    verificationCode: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
