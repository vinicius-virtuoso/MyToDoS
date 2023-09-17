import { z } from "zod";
import { userSchema } from "../schemas/user.schema";
import { DeepPartial } from "typeorm";
import { User } from "../entities/user.entity";

export type iCreateUser = z.infer<typeof userSchema.createUserSchema>;
export type iUpdateUser = DeepPartial<User>;
export type iListUser = z.infer<typeof userSchema.returnUsersListSchema>;
export type iUser = z.infer<typeof userSchema.returnUserSchema>;
