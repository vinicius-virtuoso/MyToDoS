import { Router } from "express";
import {
  validateBody,
  userNotFoundMiddleware,
  todoExistsMiddleware,
  todoNotFoundMiddleware,
  paginationTodosMiddleware,
  todoTitleExistisMiddleware,
} from "../middlewares";
import { todoController } from "../controllers/todo.controller";
import { todoSchema } from "../schemas/todo.schema";
import { validateToken } from "../guards";

export const todoRouter = Router();

todoRouter.post(
  "/todos",
  validateBody(todoSchema.createTodoSchema),
  validateToken,
  userNotFoundMiddleware,
  todoExistsMiddleware,
  todoController.create
);

todoRouter.get(
  "/todos",
  validateToken,
  userNotFoundMiddleware,
  paginationTodosMiddleware,
  todoController.findAll
);

todoRouter.get(
  "/todos/:todo_id",
  validateToken,
  userNotFoundMiddleware,
  todoNotFoundMiddleware,
  todoController.findOne
);

todoRouter.patch(
  "/todos/:todo_id",
  validateBody(todoSchema.updateTodoSchema),
  validateToken,
  userNotFoundMiddleware,
  todoNotFoundMiddleware,
  todoTitleExistisMiddleware,
  todoController.update
);

todoRouter.patch(
  "/todos/:todo_id/complete",
  validateToken,
  userNotFoundMiddleware,
  todoNotFoundMiddleware,
  todoController.complete
);

todoRouter.delete(
  "/todos/:todo_id",
  validateToken,
  userNotFoundMiddleware,
  todoNotFoundMiddleware,
  todoController.delete
);
