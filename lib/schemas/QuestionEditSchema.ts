import { z } from "zod";

export const EditQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(130, { message: "Title must not exceed 130 characters" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long" }),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "Maximum 5 tags are allowed" }),
  questionId: z.string(),
});
