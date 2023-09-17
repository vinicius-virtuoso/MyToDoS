import { todo } from "node:test";
import { iUpdateTodo } from "../../interfaces";
import { TodoRepository } from "../../repositories/todo.repository";
import { todoSchema } from "../../schemas/todo.schema";

export const updateTodoService = async (
  todo_id: number,
  data: iUpdateTodo,
  todoRepository: TodoRepository
) => {
  const { user, ...todo } = await todoRepository.update(todo_id, data);

  return todoSchema.returnTodoSchema.parse(todo);
};
