import { z } from "zod";

export const CreateAnswerSchema = z.object({
  content: z.string().min(10, {
    message: "Answer content must be at least 10 characters long",
  }),
  questionId: z.string().optional(), // Optional in case it's provided via URL params
});

export const UpdateAnswerSchema = CreateAnswerSchema.partial();
