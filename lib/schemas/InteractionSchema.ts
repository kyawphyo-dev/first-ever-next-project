import { z } from "zod";

export const InteractionSchema = z.object({
  action: z.string().min(1, "Action is required"),
  questionId: z.string().optional(),
  answerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
