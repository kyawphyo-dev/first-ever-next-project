import { auth } from "@/auth";
import Interaction from "@/database/interaction.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { InteractionSchema } from "@/lib/schemas/InteractionSchema";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    // Interactions can sometimes be anonymous (e.g. view count), 
    // but usually we want to track the user if logged in.
    const userId = session?.user?.id;

    const body = await req.json();
    const { action, questionId, answerId, tags } = InteractionSchema.parse(body);

    const interaction = await Interaction.create({
      user: userId,
      action,
      question: questionId,
      answer: answerId,
      tags,
    });

    return successResponse(interaction, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Get user interactions
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      throw new Error("User ID is required");
    }

    const interactions = await Interaction.find({ user: userId })
      .populate("question")
      .populate("answer")
      .sort({ createdAt: -1 });

    return successResponse(interactions, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
