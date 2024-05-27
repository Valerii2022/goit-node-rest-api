import express from "express";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateBody } from "../decorators/validateBody.js";
import { authSigninSchema, authSignupSchema } from "../schemas/authSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

export default authRouter;
