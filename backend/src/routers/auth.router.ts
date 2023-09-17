import { Router } from "express";
import { validateBody } from "../middlewares";
import { loginSchema } from "../schemas/login.schema";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post(
  "/auth",
  validateBody(loginSchema.authSchema),
  authController.execute
);
