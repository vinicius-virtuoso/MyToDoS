import { TodoRepository } from "../../repositories/todo.repository";
import { todoSchema } from "../../schemas/todo.schema";

export const detailsTodoService = async (
  todo_id: number,
  user_id: number,
  todoRepository: TodoRepository
) => {
  const todo = await todoRepository.findOneBy(todo_id, user_id);

  return todoSchema.returnTodoSchema.parse(todo);
};
