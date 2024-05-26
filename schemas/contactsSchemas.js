import Joi from "joi";
import { roleList, birthYearRegexp } from "../constants/contacts.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string()
    .valid(...roleList)
    .required(),
  birthYear: Joi.string().pattern(birthYearRegexp).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  role: Joi.string().valid(...roleList),
  birthYear: Joi.string().pattern(birthYearRegexp),
  favorite: Joi.boolean(),
});
