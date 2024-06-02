import * as authServices from "../services/authServices.js";
import fs from "fs/promises";
// import path from "path";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import cloudinary from "../helpers/cloudinary.js";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

// const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    throw HttpError(409, "Email already in use");
  }
  const verificationCode = nanoid(4);
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
    const newUser = await authServices.saveUser({
      ...req.body,
      verificationCode,
      avatar,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verificationCode}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

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

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await authServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "Email not found or email already verified");
  }
  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationCode: "" }
  );
  res.json({
    message: "Email verified",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({
    message: "Verify email resend",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const updateAvatar = async (req, res) => {
  const { _id, email } = req.user;
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
    await authServices.updateUser({ _id }, { avatar });

    res.json({ avatar });
  } catch (error) {
    throw HttpError(400, "error.message");
  } finally {
    await fs.unlink(req.file.path);
  }
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
