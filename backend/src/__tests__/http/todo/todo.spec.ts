import supertest from "supertest";
import { hashSync } from "bcryptjs";
import { app } from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Todo } from "../../../entities/todo.entity";
import { User } from "../../../entities/user.entity";
import { todoMocks } from "../../mocks/todoMock";
import { tokenMock } from "../../mocks/tokenMock";
import { userMocks } from "../../mocks/userMocks";
import { DataSource } from "typeorm";
import { iCreateTodo } from "../../../interfaces";

describe("Test Integration [Todo]", () => {
  let connection: DataSource;

  const baseUrl = "/api/todos";
  const baseUrlTodo = `${baseUrl}/1`;
  const baseUrlTodoNotFound = `${baseUrl}/999992`;
  const baseUrlTodoComplete = `${baseUrl}/1/complete`;
  const baseUrlTodoCompleteNotFound = `${baseUrl}/999992/complete`;

  beforeAll(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const todoRepo = AppDataSource.getRepository(Todo);
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => console.error(err));

    await userRepo.save({
      ...userMocks.userMock01,
      password: hashSync(userMocks.userMock01.password, 12),
    });

    await userRepo.save({
      ...userMocks.userMock02,
      password: hashSync(userMocks.userMock02.password, 12),
    });

    await todoRepo.save({
      ...todoMocks.todoMock01,
      user: { id: 1 },
    });

    await todoRepo.save({
      ...todoMocks.todoMock02,
      user: { id: 1 },
    });

    await todoRepo.save({
      ...todoMocks.todoMock02,
      user: { id: 2 },
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("POST/ Create Todo", () => {
    test("Error: Shouldn't create todo if user not authenticated", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoMock01)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to able create todo if invalid token", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoMock01)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to able create todo if token invalid signature", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoMock01)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able create todo if user not exists", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoMock01)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(99, "Jon Doe", "notExists@not.com")}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "User not found." });
    });

    test("Error: Shouldn't to be able create todo if already todo with title created for this user", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoMock02)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            2,
            userMocks.userMock02.name,
            userMocks.userMock02.email
          )}`
        )
        .expect(409);

      expect(response.body).toEqual({ message: "This todo already exists." });
    });

    test("Error: Shouldn't to be able create todo if invalid body", async () => {
      const response = await supertest(app)
        .post(baseUrl)
        .send(todoMocks.todoInvalidMock)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userMock01.name,
            userMocks.userMock01.email
          )}`
        )
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.objectContaining({
            title: ["Required"],
            description: ["Required"],
          }),
        })
      );
    });

    test("Success: Should to be able to create todo with successfully", async () => {
      const todoData = {
        title: "Todo created Success",
        description: "Success fake natty",
      } as iCreateTodo;

      const response = await supertest(app)
        .post(baseUrl)
        .send(todoData)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userMock01.name,
            userMocks.userMock01.email
          )}`
        )
        .expect(201);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: expect.any(Number),
          ...todoData,
          created_at: expect.any(String),
        })
      );
    });
  });

  describe("GET/ Details Todo", () => {
    test("Error: Shouldn't to be able to see details todo if not authenticated", async () => {
      const response = await supertest(app).get(baseUrlTodo).expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able to see details todo if invalid token", async () => {
      const response = await supertest(app)
        .get(baseUrlTodo)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able to see details todo if invalid signature", async () => {
      const response = await supertest(app)
        .get(baseUrlTodo)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able to see details todo if user not found", async () => {
      const response = await supertest(app)
        .get(baseUrlTodo)
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

    test("Error: Shouldn't be able to see details todo if todo not found", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoNotFound)
        .send(todoMocks.todoUpdateMock)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "Todo not found." });
    });

    test("Success: Should to be able to see details with success", async () => {
      const response = await supertest(app)
        .get(baseUrlTodo)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          complete: expect.any(Boolean),
          created_at: expect.any(String),
          dateCompleted: null,
        })
      );
    });
  });

  describe("GET/ List Todos", () => {
    test("Error: Shouldn't to be able to listing of todos if not authenticated", async () => {
      const response = await supertest(app).get(baseUrl).expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able to listing of todos if invalid token", async () => {
      const response = await supertest(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able to to listing of todos if invalid signature", async () => {
      const response = await supertest(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able to to listing of todos if user not found", async () => {
      const response = await supertest(app)
        .get(baseUrl)
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

    test("Success: Should to be able to to listing of todos with success", async () => {
      const response = await supertest(app)
        .get(baseUrl)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          prevPage: null,
          nextPage: null,
          count: 3,
          data: expect.any(Array),
        })
      );
    });
  });

  describe("PATCH/ Update Todo", () => {
    test("Error: Shouldn't to be able to update todo if not authenticated", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send(todoMocks.todoUpdateMock)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able to update todo if invalid token", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send(todoMocks.todoUpdateMock)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able to update todo if invalid signature", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send(todoMocks.todoUpdateMock)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able to update todo if user not found", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send(todoMocks.todoUpdateMock)
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

    test("Error: Shouldn't to be able to update todo if todo not found", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoNotFound)
        .send(todoMocks.todoUpdateMock)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "Todo not found." });
    });

    test("Error: Shouldn't to be able to update todo if already exists", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send({ title: todoMocks.todoMock02.title })
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(409);

      expect(response.body).toStrictEqual({
        message: "This todo already exists.",
      });
    });

    test("Success: Should to be able to update todo successfully", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodo)
        .send(todoMocks.todoUpdateMock)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: 1,
          title: todoMocks.todoUpdateMock.title,
          description: todoMocks.todoUpdateMock.description,
          created_at: expect.any(String),
          complete: false,
          dateCompleted: null,
        })
      );
    });
  });

  describe("PATCH/ Complete Todo", () => {
    test("Error: Shouldn't to be able to complete todo if not authenticated", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able to complete todo if invalid token", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able to complete todo if invalid signature", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able to complete todo if user not found", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
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

    test("Error: Shouldn't to be able to complete todo if todo not found", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoCompleteNotFound)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "Todo not found." });
    });

    test("Success: Should to be able to complete todo successfully", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: 1,
          ...todoMocks.todoUpdateMock,
          complete: true,
          dateCompleted: expect.any(String),
        })
      );
    });

    test("Success: Should to be able to REMOVE complete todo successfully", async () => {
      const response = await supertest(app)
        .patch(baseUrlTodoComplete)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(200);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: 1,
          title: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          complete: false,
          dateCompleted: null,
        })
      );
    });
  });

  describe("DELETE/ Delete a Todo", () => {
    test("Error: Shouldn't to be able to delete todo if not authenticated", async () => {
      const response = await supertest(app).delete(baseUrlTodo).expect(401);

      expect(response.body).toStrictEqual({ message: "Missing bearer token." });
    });

    test("Error: Shouldn't to be able to delete todo if invalid token", async () => {
      const response = await supertest(app)
        .delete(baseUrlTodo)
        .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "jwt malformed" });
    });

    test("Error: Shouldn't to be able to delete todo if token invalid signature", async () => {
      const response = await supertest(app)
        .delete(baseUrlTodo)
        .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
        .expect(401);

      expect(response.body).toStrictEqual({ message: "invalid signature" });
    });

    test("Error: Shouldn't to be able to delete todo if user not found", async () => {
      const response = await supertest(app)
        .delete(baseUrlTodo)
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

    test("Error: Shouldn't to be able to delete todo if todo not found", async () => {
      const response = await supertest(app)
        .delete(baseUrlTodoNotFound)
        .set(
          "Authorization",
          `Bearer ${tokenMock.genToken(
            1,
            userMocks.userValidMock.name,
            userMocks.userValidMock.email
          )}`
        )
        .expect(404);

      expect(response.body).toStrictEqual({ message: "Todo not found." });
    });

    test("Success: Should to be able to delete todo successfully", async () => {
      const response = await supertest(app)
        .delete(baseUrlTodo)
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
