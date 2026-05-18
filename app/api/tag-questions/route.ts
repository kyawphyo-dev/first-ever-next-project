import TagQuestion from "@/database/TagQuestion.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { TagQuestionSchema } from "@/lib/schemas/TagQuestionSchema";
import { NextRequest } from "next/server";

// Get tag-question relationships
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tagId = searchParams.get("tagId");
    const questionId = searchParams.get("questionId");

    const query: { tagId?: string; questionId?: string } = {};
    if (tagId) query.tagId = tagId;
    if (questionId) query.questionId = questionId;

    const relationships = await TagQuestion.find(query)
      .populate("tagId")
      .populate("questionId");

    return successResponse(relationships, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Create tag-question relationship
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = TagQuestionSchema.parse(body);

    const { tagId, questionId } = validatedData;

    // Check if relationship already exists
    const existing = await TagQuestion.findOne({ tagId, questionId });
    if (existing) {
      throw new Error("Relationship already exists");
    }

    const relationship = await TagQuestion.create({ tagId, questionId });

    return successResponse(relationship, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
