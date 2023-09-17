import { UserRepository } from "../../repositories/user.repository";
import { userSchema } from "../../schemas/user.schema";

export const detailsUserService = async (
  user_id: number,
  userRepository: UserRepository
) => {
  const user = await userRepository.findOneById(user_id);

  return userSchema.returnUserSchema.parse(user);
};
