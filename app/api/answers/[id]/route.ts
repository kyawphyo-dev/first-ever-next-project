import Answer from "@/database/answer.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { UpdateAnswerSchema } from "@/lib/schemas/AnswerSchema";
import { Types } from "mongoose";

// Get answer by id
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

    const answer = await Answer.findById(id).populate("author", "name image");

    if (!answer) {
      throw new Error("Answer not found");
    }

    return successResponse(answer, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update answer
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

    const validatedData = UpdateAnswerSchema.parse(body);
    const answer = await Answer.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    return successResponse(answer, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete answer
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

    const answer = await Answer.findByIdAndDelete(id);

    if (!answer) {
      throw new Error("Answer not found");
    }

    return successResponse({ message: "Answer deleted successfully" }, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
