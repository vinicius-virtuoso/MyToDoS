import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validateBody =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.parse(req.body);

    req.body = validation;
    return next();
  };
