import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";

import { findUser, deleteAllUsers } from "../services/authServices.js";

const { DB_TEST_HOST } = process.env;

describe("test /api/auth/signup", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(3001);
  });

  afterAll(async () => {
    await deleteAllUsers();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test singup with correct data", async () => {
    const signupData = {
      name: "Alex",
      email: "alex@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signup")
      .send(signupData);

    expect(statusCode).toBe(201);
    expect(body.name).toBe(signupData.name);
    expect(body.email).toBe(signupData.email);

    const user = await findUser({ email: signupData.email });
    expect(user).not.toBeNull();
    expect(user.name).toBe(signupData.name);
    expect(user.email).toBe(signupData.email);
  });

  test("test signin with correct data", async () => {
    const signinData = {
      email: "alex@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signin")
      .send(signinData);

    expect(statusCode).toBe(200);
    expect(Object.keys(body).length).toBe(3);
    expect(body.token).toBeTruthy();
    expect(body.name).toBeTruthy();
    expect(body.email).toBeTruthy();
    expect(typeof body.token).toBe("string");
    expect(typeof body.name).toBe("string");
    expect(typeof body.email).toBe("string");
  });
});
