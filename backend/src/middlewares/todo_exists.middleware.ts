import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { todoRepository } from "../repositories/todo.repository";

export const todoExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id: number = req.auth.id;
  const { title } = req.body;

  const findTodo = await todoRepository.findOneByTitle(title, user_id);

  if (findTodo) {
    throw new AppError("This todo already exists.", 409);
  }
  return next();
};
