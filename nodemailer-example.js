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

const email = {
  from: UKR_NET_FROM,
  to: "miheco7554@acuxi.com",
  subject: "Test email",
  html: "<strong>Test email</strong>",
};

const transport = nodemailer.createTransport(nademailerConfig);

transport
  .sendMail(email)
  .then(() => console.log("Email send success"))
  .catch((error) => console.log(error.message));
