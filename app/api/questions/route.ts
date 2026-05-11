import { auth } from "@/auth";
import Question from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CreateQuestionSchema } from "@/lib/schemas/QuestionSchema";

// Get all questions
export async function GET() {
  try {
    await dbConnect();
    const questions = await Question.find()
      .populate("tags")
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    return successResponse(questions, 200);
  } catch (e) {
    return errorResponse(e, 500);
  }
}

// Create question
export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const validatedData = CreateQuestionSchema.parse(body);

    const question = await Question.create({
      ...validatedData,
      author: session.user.id,
    });
    
    return successResponse(question, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
