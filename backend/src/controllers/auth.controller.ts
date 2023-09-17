import { Request, Response } from "express";
import { loginService } from "../services/auth/login.service";
import { userRepository } from "../repositories/user.repository";

export class AuthController {
  async execute(req: Request, res: Response) {
    const token = await loginService(req.body, userRepository);
    return res.status(200).json(token);
  }
}

export const authController = new AuthController();
