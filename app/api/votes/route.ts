import { auth } from "@/auth";
import Vote from "@/database/vote.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CreateVoteSchema } from "@/lib/schemas/VoteSchema";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const body = await req.json();
    const { questionId, answerId, voteType } = CreateVoteSchema.parse(body);

    const targetId = questionId || answerId;
    const targetModel = questionId ? Question : Answer;
    const voteField = questionId ? "questionId" : "answerId";

    // Find existing vote
    const existingVote = await Vote.findOne({
      user: userId,
      [voteField]: targetId,
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if clicking same type
        await Vote.findByIdAndDelete(existingVote._id);
        return successResponse({ message: "Vote removed" }, 200);
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        return successResponse({ message: "Vote updated" }, 200);
      }
    } else {
      // Create new vote
      await Vote.create({
        user: userId,
        [voteField]: targetId,
        voteType,
      });
      return successResponse({ message: "Vote recorded" }, 201);
    }
  } catch (e) {
    return errorResponse(e, 400);
  }
}
