import HttpError from "../helpers/HttpError.js";

export const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (length === 0) {
    return next(HttpError(400, "Body must have at laest one key"));
  }
  next();
};
