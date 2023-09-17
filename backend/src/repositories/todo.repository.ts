import { AppDataSource } from "../data-source";
import { Todo } from "../entities/todo.entity";
import { iCreateTodo, iUpdateTodo } from "../interfaces";

class TodoRepository {
  todoRepo = AppDataSource.getRepository(Todo);

  async create(data: iCreateTodo, user_id: number) {
    const todoCreate = this.todoRepo.create({
      ...data,
      complete: data.complete ?? false,
      user: {
        id: user_id,
      },
    });
    return await this.todoRepo.save(todoCreate);
  }

  async findOneBy(id: number, user_id: number) {
    return await this.todoRepo.findOne({
      where: { id, user: { id: user_id } },
      select: {
        id: true,
        title: true,
        description: true,
        complete: true,
        created_at: true,
        dateCompleted: true,
        user: {
          id: true,
        },
      },
      relations: { user: true },
    });
  }

  async findOneByTitle(title: string, user_id: number) {
    const todo = await this.todoRepo.findOneBy({
      title,
      user: { id: user_id },
    });

    return todo;
  }

  async findAll(
    user_id: number,
    filter: string,
    page: number,
    perPage: number
  ) {
    if (filter === "not-completed") {
      return await this.todoRepo.findAndCount({
        where: { user: { id: user_id }, complete: false },
        take: perPage,
        skip: page,
        order: { created_at: "DESC" },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          complete: true,
          dateCompleted: true,
        },
      });
    } else if (filter === "complete") {
      return await this.todoRepo.findAndCount({
        where: { user: { id: user_id }, complete: true },
        take: perPage,
        skip: page,
        order: { created_at: "DESC" },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          complete: true,
          dateCompleted: true,
        },
      });
    } else {
      return await this.todoRepo.findAndCount({
        where: { user: { id: user_id } },
        take: perPage,
        skip: page,
        order: { created_at: "DESC" },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          complete: true,
          dateCompleted: true,
        },
      });
    }
  }

  async update(todo_id: number, data: iUpdateTodo) {
    const todo = await this.todoRepo.findOne({ where: { id: todo_id } });

    return await this.todoRepo.save({
      ...todo,
      ...data,
      dateCompleted: data.complete ? new Date().toISOString() : null,
    });
  }

  async completeTodo(todo_id: number) {
    const todo = await this.todoRepo.findOne({ where: { id: todo_id } });

    return await this.todoRepo.save({
      ...todo,
      complete: !todo?.complete,
      dateCompleted: !todo?.complete === true ? new Date().toISOString() : null,
    });
  }

  async remove(todo_id: number) {
    return await this.todoRepo.delete({ id: todo_id });
  }
}

const todoRepository = new TodoRepository();
export { todoRepository, TodoRepository };
