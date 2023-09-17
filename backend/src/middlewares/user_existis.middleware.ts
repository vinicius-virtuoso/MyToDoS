import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { userRepository } from "../repositories/user.repository";

export const userExistisMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const findUser = await userRepository.findOneByEmail(email);

  if (findUser) {
    throw new AppError("User already exists.", 409);
  }

  return next();
};
