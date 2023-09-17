import { TodoRepository } from "../../repositories/todo.repository";
import { todoSchema } from "../../schemas/todo.schema";
import { iPaginationParams } from "../../interfaces";

export const listTodoService = async (
  user_id: number,
  filter: string,
  { nextPage, prevPage, page, perPage }: iPaginationParams,
  todoRepository: TodoRepository
) => {
  const [todos, count] = await todoRepository.findAll(
    user_id,
    filter,
    page,
    perPage
  );

  return todoSchema.returnListTodoSchema.parse({
    prevPage: page - 1 < 1 ? null : prevPage,
    nextPage: count - page <= perPage ? null : nextPage,
    count,
    data: todos,
  });
};
