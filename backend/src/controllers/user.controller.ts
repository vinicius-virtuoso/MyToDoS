import { Request, Response } from "express";
import { iCreateUser, iUpdateUser } from "../interfaces";
import { createUserService } from "../services/user/create_user.service";
import { detailsUserService } from "../services/user/details_user.service";
import { userRepository } from "../repositories/user.repository";
import { updateUserService } from "../services/user/update_user.service";
import { deleteUserService } from "../services/user/delete_user.service";

export class UserController {
  async create(req: Request, res: Response) {
    const user = await createUserService(
      req.body as iCreateUser,
      userRepository
    );

    return res.status(201).json(user);
  }

  async findOne(req: Request, res: Response) {
    const user = await detailsUserService(+req.auth.id, userRepository);

    return res.status(200).json(user);
  }

  async update(req: Request, res: Response) {
    const user = await updateUserService(
      +req.auth.id,
      req.body as iUpdateUser,
      userRepository
    );

    return res.status(200).json(user);
  }

  async delete(req: Request, res: Response) {
    await deleteUserService(+req.auth.id, userRepository);

    return res.status(204).json();
  }
}

export const userController = new UserController();
