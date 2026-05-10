import { z } from "zod";

export const CreateTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description is required"),
});

export const UpdateTagSchema = CreateTagSchema.partial();
