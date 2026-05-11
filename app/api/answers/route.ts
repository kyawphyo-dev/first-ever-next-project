import { auth } from "@/auth";
import Answer from "@/database/answer.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CreateAnswerSchema } from "@/lib/schemas/AnswerSchema";

// Get answers (could be filtered by questionId via query params)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    const query = questionId ? { question: questionId } : {};
    const answers = await Answer.find(query)
      .populate("author", "name image")
      .sort({ createdAt: -1 });

    return successResponse(answers, 200);
  } catch (e) {
    return errorResponse(e, 500);
  }
}

// Create answer
export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const validatedData = CreateAnswerSchema.parse(body);

    const answer = await Answer.create({
      ...validatedData,
      author: session.user.id,
    });

    return successResponse(answer, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
