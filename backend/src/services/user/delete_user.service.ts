import { UserRepository } from "../../repositories/user.repository";

export const deleteUserService = async (
  user_id: number,
  userRepository: UserRepository
) => {
  await userRepository.destroy(user_id);
};
