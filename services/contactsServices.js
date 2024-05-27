import Contact from "../models/Contact.js";

export const getContacts = async (search) => {
  const { filter = {}, fields } = search;
  return Contact.find(filter, fields);
};

export const getContactById = async (id) => {
  const result = Contact.findById(id);
  return result;
};

export const removeContact = async (id) => Contact.findByIdAndDelete(id);

export const addContact = async (data) => Contact.create(data);

export const updateContactById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data);
