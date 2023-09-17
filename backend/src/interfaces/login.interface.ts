import { z } from "zod";
import { loginSchema } from "../schemas/login.schema";

export type iLogin = z.infer<typeof loginSchema.authSchema>;
