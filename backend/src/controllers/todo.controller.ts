import { Request, Response } from "express";
import { createTodoService } from "../services/todo/create_todo.service";
import { todoRepository } from "../repositories/todo.repository";
import { detailsTodoService } from "../services/todo/details_todo.service";
import { updateTodoService } from "../services/todo/update_todo.service";
import { deleteTodoService } from "../services/todo/delete_todo.service";
import { listTodoService } from "../services/todo/list_todo.service";
import { completeTodoService } from "../services/todo/complete_todo.service";
import { iPagination } from "../interfaces";

export class TodoController {
  async create(req: Request, res: Response) {
    const todo = await createTodoService(
      req.body,
      +req.auth.id,
      todoRepository
    );
    return res.status(201).json(todo);
  }

  async findOne(req: Request, res: Response) {
    const todo = await detailsTodoService(
      +req.params.todo_id,
      +req.auth.id,
      todoRepository
    );

    return res.status(200).json(todo);
  }

  async findAll(req: Request, res: Response) {
    const filter = req.query.filter as string;
    const todosPagination: iPagination = await listTodoService(
      +req.auth.id,
      filter,
      res.locals.pagination,
      todoRepository
    );

    return res.status(200).json(todosPagination);
  }

  async update(req: Request, res: Response) {
    const todo = await updateTodoService(
      +req.params.todo_id,
      req.body,
      todoRepository
    );
    return res.status(200).json(todo);
  }

  async complete(req: Request, res: Response) {
    const todo = await completeTodoService(+req.params.todo_id, todoRepository);
    return res.status(200).json(todo);
  }

  async delete(req: Request, res: Response) {
    await deleteTodoService(+req.params.todo_id, todoRepository);

    return res.status(204).json();
  }
}

export const todoController = new TodoController();
