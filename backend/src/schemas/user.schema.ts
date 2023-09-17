import { z } from "zod";
import { todoSchema } from "./todo.schema";

const createUserSchema = z.object({
  name: z.string().max(170).nonempty(),
  email: z.string().email().max(170).nonempty(),
  password: z.string().max(50).min(4).nonempty(),
});

const updateUserSchema = z.object({
  name: z.string().email().max(170).optional(),
  email: z.string().email().max(170).optional(),
  password: z.string().max(50).min(4).optional(),
});

const returnUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  todos: z.array(todoSchema.returnTodoSchema).optional(),
});

const returnUsersListSchema = z.array(returnUserSchema);

export const userSchema = {
  createUserSchema,
  returnUserSchema,
  updateUserSchema,
  returnUsersListSchema,
};
