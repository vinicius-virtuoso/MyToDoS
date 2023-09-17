import { z } from "zod";
import { todoSchema } from "../schemas/todo.schema";
import { DeepPartial } from "typeorm";
import { Todo } from "../entities/todo.entity";

export type iCreateTodo = z.infer<typeof todoSchema.createTodoSchema>;
export type iUpdateTodo = DeepPartial<Todo>;
export type iTodo = z.infer<typeof todoSchema.returnTodoSchema>;
export type iTodoList = z.infer<typeof todoSchema.returnListTodoSchema>;
