import bcrypt from "bcrypt";

export const compareHash = (password, hashPassord) =>
  bcrypt.compare(password, hashPassord);
