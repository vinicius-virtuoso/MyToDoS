import { z } from "zod";
import { todoSchema } from "../schemas/todo.schema";

export interface iPagination {
  prevPage: string | null;
  nextPage: string | null;
  count: number;
  data: z.infer<typeof todoSchema.returnTodoSchema>[];
}

export interface iPaginationParams {
  page: number;
  perPage: number;
  prevPage: string;
  nextPage: string;
}
