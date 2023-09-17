import { TodoRepository } from "../../repositories/todo.repository";
import { todoSchema } from "../../schemas/todo.schema";

export const completeTodoService = async (
  todo_id: number,
  todoRepository: TodoRepository
) => {
  const { user, ...todo } = await todoRepository.completeTodo(todo_id);

  return todoSchema.returnTodoSchema.parse(todo);
};
