import * as authServices from "../services/authServices.js";
import fs from "fs/promises";
import gravatar from "gravatar";
// import path from "path";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import cloudinary from "../helpers/cloudinary.js";

// const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  try {
    let avatar;
    if (req.file) {
      const { url } = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatar = url;
    } else {
      avatar = gravatar.url(email, {
        protocol: "https",
        s: "100",
      });
    }
    // const { path: oldPath, filename } = req.file;
    // const newPath = path.join(avatarsPath, filename);
    // await fs.rename(oldPath, newPath);
    // const avatar = path.join("avatars", filename);
    const newUser = await authServices.saveUser({ ...req.body, avatar });

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    throw HttpError(400, error.message);
  } finally {
    await fs.unlink(req.file.path);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const comparePassword = compareHash(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });

  res.json({ token, name: user.name, email: user.email });
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.json({
    message: "Signout success",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
};
