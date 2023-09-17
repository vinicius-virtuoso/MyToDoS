import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { todoRepository } from "../repositories/todo.repository";
import { iUpdateTodo } from "../interfaces";

export const todoTitleExistisMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const todo_id = +req.params.todo_id;
  const user_id = +req.auth.id;
  const { title } = req.body as iUpdateTodo;

  if (title) {
    const findTodo = await todoRepository.findOneByTitle(title, user_id);

    if (findTodo && findTodo.id !== todo_id) {
      throw new AppError("This todo already exists.", 409);
    }
  }

  return next();
};
