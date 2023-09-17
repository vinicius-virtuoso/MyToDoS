import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { userRepository } from "../repositories/user.repository";

export const userNotFoundMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = +req.auth.id;
  const findUser = await userRepository.findOneById(user_id);

  if (!findUser) {
    throw new AppError("User not found.", 404);
  }

  return next();
};
