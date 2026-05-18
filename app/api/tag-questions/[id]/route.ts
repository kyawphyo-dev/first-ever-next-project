import TagQuestion from "@/database/TagQuestion.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { TagQuestionSchema } from "@/lib/schemas/TagQuestionSchema";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

// Get specific tag-question relationship by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const relationship = await TagQuestion.findById(id)
      .populate("tagId")
      .populate("questionId");

    if (!relationship) {
      throw new Error("Relationship not found");
    }

    return successResponse(relationship, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update specific tag-question relationship
// Note: Usually rare for junction models; usually you delete and recreate.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const validatedData = TagQuestionSchema.parse(body);
    const relationship = await TagQuestion.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
      },
    );

    if (!relationship) {
      throw new Error("Relationship not found");
    }

    return successResponse(relationship, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete specific tag-question relationship
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const relationship = await TagQuestion.findByIdAndDelete(id);

    if (!relationship) {
      throw new Error("Relationship not found");
    }

    return successResponse(
      { message: "Relationship deleted successfully" },
      200,
    );
  } catch (e) {
    return errorResponse(e, 400);
  }
}
