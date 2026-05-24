import { z } from "zod";

export const GetQuestionSchema = z.object({
  questionId: z.string(),
});
