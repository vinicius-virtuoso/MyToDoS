import { getRounds, hashSync } from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { iCreateUser, iUpdateUser } from "../interfaces";

class UserRepository {
  userRepo = AppDataSource.getRepository(User);

  async create(data: iCreateUser) {
    await this.userRepo.save({
      ...data,
      password: hashSync(data.password, 12),
    });
    return;
  }

  async update(user_id: number, data: iUpdateUser) {
    const userFind = await this.userRepo.findOneBy({ id: user_id });
    if (data.password) {
      const passwordHash = getRounds(data.password);
      if (!passwordHash) {
        data.password = hashSync(data.password, 12);
      }
    }
    await this.userRepo.save({
      ...userFind,
      ...data,
    });
    const user = await this.userRepo.find({
      where: { id: user_id },
      select: {
        id: true,
        name: true,
        email: true,
        todos: true,
      },
      relations: {
        todos: true,
      },
    });

    return user[0];
  }

  async findOneByEmail(email: string) {
    const userFind = await this.userRepo.findOneBy({ email });
    return userFind;
  }

  async findOneById(id: number) {
    const userFind = await this.userRepo.find({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        todos: true,
      },
      relations: {
        todos: true,
      },
    });

    return userFind[0];
  }

  async destroy(user_id: number) {
    return await this.userRepo.delete({ id: user_id });
  }
}

const userRepository = new UserRepository();

export { userRepository, UserRepository };
