import { z } from "zod";

const authSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const returnLoginSchema = z.object({
  accessToken: z.string(),
});

export const loginSchema = {
  authSchema,
  returnLoginSchema,
};
