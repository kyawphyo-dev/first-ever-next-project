import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),

  username: z.string().min(3, "Username must be at least 3 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const UpdateUserSchema = CreateUserSchema.partial();
