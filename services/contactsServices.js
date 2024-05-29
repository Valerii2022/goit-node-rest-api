import Contact from "../models/Contact.js";

export const getContacts = async (search = {}) => {
  const { filter = {}, fields = "", settings = "" } = search;
  return Contact.find(filter, fields, settings).populate("owner", "name email");
};

export const countContacts = (filter) => Contact.countDocuments(filter);

export const getContact = (filter) => Contact.findOne(filter);

export const addContact = async (data) => Contact.create(data);

export const removeContact = async (filter) => Contact.findOneAndDelete(filter);

export const updateContactById = async (filter) =>
  Contact.findOneAndUpdate(filter);
