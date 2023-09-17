import { iUpdateUser } from "../../interfaces";
import { UserRepository } from "../../repositories/user.repository";
import { userSchema } from "../../schemas/user.schema";

export const updateUserService = async (
  user_id: number,
  data: iUpdateUser,
  userRepository: UserRepository
) => {
  const user = await userRepository.update(user_id, data);

  return userSchema.returnUserSchema.parse(user);
};
