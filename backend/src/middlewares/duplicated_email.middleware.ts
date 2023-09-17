import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { userRepository } from "../repositories/user.repository";

export const duplicatedEmailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.auth.id;
  const email: string = req.body.email;
  const findUser = await userRepository.findOneByEmail(email);

  if (findUser && +findUser?.id !== +user_id) {
    throw new AppError("Email is already in use.", 409);
  }
  return next();
};
