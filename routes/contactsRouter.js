import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateBody } from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

// upload.array("poster, 8 - max.files length")
// upload.fields([{name: "poster", maxCount: 1}, {name: "sub-poster", maxCount: 8}])
contactsRouter.post(
  "/",
  upload.single("poster"),
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

export default contactsRouter;
