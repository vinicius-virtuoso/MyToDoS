import { userMocks } from "./../../mocks/userMocks";
import supertest from "supertest";
import { app } from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities/user.entity";
import { hashSync } from "bcryptjs";

describe("Test Integration [Route]: Test Login API", () => {
  let connection: typeof AppDataSource;

  const baseUrl: string = "/api/auth";
  const userRepo = AppDataSource.getRepository(User);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => console.error(err));

    await userRepo.save({
      ...userMocks.userValidMock,
      password: hashSync(userMocks.userValidMock.password, 12),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Error: Shouldn't be able to login with invalid credentials", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send({ email: userMocks.userValidMock.email, password: "invalid" })
      .expect(401);

    expect(response.body).toEqual({ message: "Invalid credentials." });
  });

  test("Error: Shouldn't be able to login if user not existis", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send({ email: "userNotExist@not.com", password: "12345" })
      .expect(404);

    expect(response.body).toEqual({ message: "Sorry, user not exist." });
  });

  test("Success: Should to be able to login", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send({
        email: userMocks.userValidMock.email,
        password: userMocks.userValidMock.password,
      })
      .expect(200);

    expect(response.body).toEqual({ accessToken: expect.any(String) });
  });
});
