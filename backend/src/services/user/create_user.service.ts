import { UserRepository } from "./../../repositories/user.repository";
import { iCreateUser } from "../../interfaces";
import { AppError } from "../../errors";

export const createUserService = async (
  payload: iCreateUser,
  userRepository: UserRepository
) => {
  try {
    await userRepository.create(payload);
    return { Success: "User created successfully" };
  } catch (err) {
    throw new AppError("Unexpected error creating user", 500);
  }
};
