import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long." })
    .max(20, { message: "Your password can't be more than 20 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        "Include at least one uppercase letter and one number in your password.",
    }),
});

export const signUpSchema = loginSchema
  .extend({
    name: z.string().min(2, {
      message: "Please enter your full name.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const scanSchema = z.object({
  file: z.array(z.instanceof(File)).min(1, { message: "File is required." }),
});
