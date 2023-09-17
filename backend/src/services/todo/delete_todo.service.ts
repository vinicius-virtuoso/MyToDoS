import { TodoRepository } from "../../repositories/todo.repository";

export const deleteTodoService = async (
  tod_id: number,
  todoRepository: TodoRepository
) => {
  await todoRepository.remove(tod_id);
  return;
};
