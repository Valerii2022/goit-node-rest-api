import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_FROM, UKR_NET_KEY } = process.env;

const nademailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_KEY,
  },
};

const transport = nodemailer.createTransport(nademailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};

export default sendEmail;
