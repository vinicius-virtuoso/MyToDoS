import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { todoRepository } from "../repositories/todo.repository";

export const todoNotFoundMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = +req.auth.id;
  const todo_id = +req.params.todo_id;

  const findTodo = await todoRepository.findOneBy(todo_id, user_id);

  if (!findTodo) {
    throw new AppError("Todo not found.", 404);
  }

  return next();
};
