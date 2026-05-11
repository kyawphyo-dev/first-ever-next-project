import Question from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { UpdateQuestionSchema } from "@/lib/schemas/QuestionSchema";
import { Types } from "mongoose";

// Get question by id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const question = await Question.findById(id)
      .populate("tags")
      .populate("author", "name image");

    if (!question) {
      throw new Error("Question not found");
    }

    return successResponse(question, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update question
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const validatedData = UpdateQuestionSchema.parse(body);
    const question = await Question.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    return successResponse(question, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete question
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      throw new Error("Question not found");
    }

    return successResponse({ message: "Question deleted successfully" }, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
