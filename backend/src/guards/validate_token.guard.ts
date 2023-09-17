import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  const token = authToken?.split(" ")[1];

  if (!token) {
    throw new AppError("Missing bearer token.", 401);
  }

  jwt.verify(token, String(process.env.SECRET_KEY), (err, decoded: any) => {
    if (err) {
      throw new AppError(err.message, 401);
    }
    req.auth = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
    };
    return next();
  });
};
