import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),

  username: z.string().min(3, "Username must be at least 3 characters"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  provider: z.string().optional(),
  providerAccountId: z.string().optional(),
  image: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  reputation: z.number().optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
