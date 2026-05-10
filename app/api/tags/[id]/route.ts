import Tag from "@/database/tag.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { UpdateTagSchema } from "@/lib/schemas/TagSchema";

import { Types } from "mongoose";

//Fetch Tag by id
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
    const tag = await Tag.findById(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return successResponse(tag, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete Tag by id
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
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    return successResponse(tag, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update Tag by id
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

    const validatedData = UpdateTagSchema.parse(body);
    const tag = await Tag.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    return successResponse(tag, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
