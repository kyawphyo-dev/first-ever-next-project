import { z } from "zod";

export const TagQuestionSchema = z.object({
  tagId: z.string().min(1, "Tag ID is required"),
  questionId: z.string().min(1, "Question ID is required"),
});
