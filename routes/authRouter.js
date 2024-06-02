import express from "express";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateBody } from "../decorators/validateBody.js";
import {
  authSigninSchema,
  authSignupSchema,
  authEmailSchema,
} from "../schemas/authSchemas.js";
import authControllers from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import resizeImage from "../middlewares/resizeImage.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  upload.single("avatar"),
  resizeImage,
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.get("/verify/:verificationCode", authControllers.verify);
authRouter.get(
  "/verify",
  isEmptyBody,
  validateBody(authEmailSchema),
  authControllers.resendVerify
);

authRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/signout", authenticate, authControllers.signout);

authRouter.patch(
  "/users/avatars",
  upload.single("avatar"),
  resizeImage,
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
