import { z } from "zod";

const createTodoSchema = z.object({
  title: z.string().max(180),
  description: z.string(),
  complete: z.boolean().optional().default(false),
  dateCompleted: z
    .date()
    .or(z.string().max(180))
    .or(z.null())
    .optional()
    .default(null),
});

const returnTodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  created_at: z.date().or(z.string()),
  complete: z.boolean(),
  dateCompleted: z.string().or(z.null()).or(z.date()),
});

const returnListTodoSchema = z.object({
  prevPage: z.string().or(z.null()),
  nextPage: z.string().or(z.null()),
  count: z.number(),
  data: z.array(returnTodoSchema),
});

const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  complete: z.boolean().optional(),
  dateCompleted: z.string().or(z.null()).optional(),
});

export const todoSchema = {
  createTodoSchema,
  updateTodoSchema,
  returnTodoSchema,
  returnListTodoSchema,
};
