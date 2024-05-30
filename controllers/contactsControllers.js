import fs from "fs/promises";
import path from "path";
import {
  addContact,
  getContact,
  getContacts,
  removeContact,
  updateContactById,
  countContacts,
} from "../services/contactsServices.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import cloudinary from "../helpers/cloudinary.js";

// const postersPath = path.resolve("public", "posters");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const result = await getContacts({ filter, fields, settings });
  const total = await countContacts(filter);
  res.json({
    total,
    result,
  });
};

const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await getContact({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: _id } = req.params;
  const result = await removeContact({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  try {
    // save to cloudinary
    const { url: poster } = await cloudinary.uploader.upload(req.file.path, {
      folder: "posters",
    });
    // save to public folder
    // ---------------------------
    // const { path: oldPath, filename } = req.file;
    // const newPath = path.join(postersPath, filename);
    // await fs.rename(oldPath, newPath);
    // const poster = path.join("posters", filename);
    const result = await addContact({ ...req.body, poster, owner });
    res.status(201).json(result);
  } catch (error) {
    throw HttpError(400, error.message);
  } finally {
    await fs.unlink(req.file.path);
  }
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await updateContactById({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
