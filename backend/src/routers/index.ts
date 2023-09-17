import { authRouter } from "./auth.router";
import { todoRouter } from "./todo.router";
import { userRouter } from "./user.router";

export const routers = [userRouter, authRouter, todoRouter];
