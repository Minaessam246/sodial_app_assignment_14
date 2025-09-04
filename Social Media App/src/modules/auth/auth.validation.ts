import { z } from "zod";

export const signup = {
  body: z
    .strictObject({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string(),
      role: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Password and confirm password do not match",
          path: ["confirmPassword"],
        });
      }
    }),
};

export const login = {
  body: z.strictObject({
    email: z.string().email(),
    password: z.string(),
  }),
};
