import { AppError } from "../../errors";
import { iCreateTodo } from "../../interfaces";
import { TodoRepository } from "../../repositories/todo.repository";
import { todoSchema } from "../../schemas/todo.schema";

export const createTodoService = async (
  payload: iCreateTodo,
  user_id: number,
  todoRepository: TodoRepository
) => {
  try {
    const todo = await todoRepository.create(payload, user_id);

    return todoSchema.returnTodoSchema.parse(todo);
  } catch (err) {
    throw new AppError("Unexpected error creating todo", 500);
  }
};
