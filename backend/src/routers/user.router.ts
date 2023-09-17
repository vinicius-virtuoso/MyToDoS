import { Router } from "express";
import {
  userExistisMiddleware,
  validateBody,
  userNotFoundMiddleware,
  duplicatedEmailMiddleware,
} from "../middlewares";
import { userController } from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { validateToken } from "../guards";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateBody(userSchema.createUserSchema),
  userExistisMiddleware,
  userController.create
);

userRouter.get(
  "/profile",
  validateToken,
  userNotFoundMiddleware,
  userController.findOne
);

userRouter.patch(
  "/profile",
  validateToken,
  userNotFoundMiddleware,
  duplicatedEmailMiddleware,
  userController.update
);

userRouter.delete(
  "/profile",
  validateToken,
  userNotFoundMiddleware,
  userController.delete
);
