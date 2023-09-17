import { compare } from "bcryptjs";
import { AppError } from "../../errors";
import { sign } from "jsonwebtoken";
import { iLogin } from "../../interfaces";
import { loginSchema } from "../../schemas/login.schema";
import { UserRepository } from "../../repositories/user.repository";

export const loginService = async (
  payload: iLogin,
  userRepository: UserRepository
) => {
  const { email, password } = payload;
  const findUser = await userRepository.findOneByEmail(email);

  if (!findUser) {
    throw new AppError("Sorry, user not exist.", 404);
  }

  const comparePassword = await compare(password, findUser.password);

  if (!comparePassword) {
    throw new AppError("Invalid credentials.", 401);
  }

  const accessToken: string = sign(
    { email: findUser.email, name: findUser.name },
    String(process.env.SECRET_KEY),
    {
      expiresIn: process.env.EXPIRES_IN,
      subject: String(findUser.id),
    }
  );

  const token = loginSchema.returnLoginSchema.parse({ accessToken });

  return token;
};
