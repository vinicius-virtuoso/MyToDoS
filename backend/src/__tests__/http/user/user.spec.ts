import supertest from "supertest";
import { app } from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities/user.entity";
import { userMocks } from "../../mocks/userMocks";
import { hashSync } from "bcryptjs";
import { tokenMock } from "../../mocks/tokenMock";

describe("Test Integration [User]", () => {
  let connection: typeof AppDataSource;

  const baseUrlCreate: string = "/api/register";
  const baseUrlUser: string = "/api/profile";
  const userRepo = AppDataSource.getRepository(User);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => console.error(err));

    await userRepo.save({
      ...userMocks.userValidMock,
      password: hashSync(userMocks.userValidMock.password, 12),
    });

    await userRepo.save({
      ...userMocks.userMock02,
      password: hashSync(userMocks.userValidMock.password, 12),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("POST/ Create User", () => {
    test("Error: Shouldn't create new user if been exists", async () => {
      const response = await supertest(app)
        .post(baseUrlCreate)
        .send(userMocks.userValidMock);

      expect(response.body).toEqual({ message: "User already exists." });
    });

    test("Error: Shouldn't create new user if fields required.", async () => {
      const response = await supertest(app)
        .post(baseUrlCreate)
        .send(userMocks.userInvalid)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.objectContaining({
            name: ["Required"],
            email: ["Required"],
            password: ["Required"],
          }),
        })
      );
    });
    test("Success: Should be create new user correctly", async () => {
      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "12345",
      };

      const response = await supertest(app)
        .post(baseUrlCreate)
        .send(userData)
        .expect(201);

      expect(response.body).toEqual({ Success: "User created successfully" });
    });
  });

  describe("GET/ Profile User", () => {
    test("Error: Shouldn't to be able see details self profile if not authenticated", async () => {
      const response = await supertest(app).get(baseUrlUser).expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });
    test("Error: Shouldn't to be able see details self profile if invalid token", async () => {
      const response = await supertest(app)
        .get(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });
    test("Error: Shouldn't to be able see details self profile if token invalid signature", async () => {
      const response = await supertest(app)
        .get(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });
    test("Error: Shouldn't to able to see details self profile if user not exists", async () => {
      const response = await supertest(app)
        .get(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            999,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "User not found." });
    });
    test("Success: Should to be able to see self profile", async () => {
      const response = await supertest(app)
        .get(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          todos: expect.any(Array),
        })
      );
    });
  });

  describe("PATCH/ Update Profile User", () => {
    test("Error: Should not to be update profile if email already exists", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .send({ email: "test02@example.com" })
        .expect(409);

      expect(response.body).toEqual({ message: "Email is already in use." });
    });

    test("Error: Should not to be able update profile if not authenticated", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .send(userMocks.updateUpdatedMock)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Should not to be able update profile if token invalid signature", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .send(userMocks.updateUpdatedMock)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Should not to be able update user if invalid token", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Should not to able to update self profile if user not exists", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            999,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .send(userMocks.updateUpdatedMock)
        .expect(404);

      expect(response.body).toStrictEqual({ message: "User not found." });
    });

    test("Success: Should to be able to update profile successfully", async () => {
      const response = await supertest(app)
        .patch(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .send(userMocks.updateUpdatedMock)
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: 1,
          name: "user updated",
          email: "userUpdated@example.com",
          todos: expect.any(Array),
        })
      );
    });
  });

  describe("DELETE/ Delete User", () => {
    test("Error: Shouldn't to be able delete user if not authenticated", async () => {
      const response = await supertest(app).delete(baseUrlUser).expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able delete user if invalid token", async () => {
      const response = await supertest(app)
        .delete(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able delete user if token invalid signature", async () => {
      const response = await supertest(app)
        .delete(baseUrlUser)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to able to delete self profile if user not exists", async () => {
      const response = await supertest(app)
        .delete(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            999,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "User not found." });
    });

    test("Success: Should to be able to delete user successfully", async () => {
      const response = await supertest(app)
        .delete(baseUrlUser)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        );

      expect(response.statusCode).toEqual(204);
    });
  });
});
