import { z } from "zod";

export const CreateVoteSchema = z.object({
  questionId: z.string().optional(),
  answerId: z.string().optional(),
  voteType: z.enum(["upvote", "downvote"]),
});

export const UpdateVoteSchema = CreateVoteSchema.partial();
