import { auth } from "@/auth";
import Collection from "@/database/collection.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CollectionSchema } from "@/lib/schemas/CollectionSchema";
import { Types } from "mongoose";

// Get specific collection entry by id
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

    const collection = await Collection.findById(id).populate({
      path: "question",
      populate: { path: "tags" },
    });

    if (!collection) {
      throw new Error("Collection entry not found");
    }

    return successResponse(collection, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update specific collection entry
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const { questionId } = CollectionSchema.parse(body);

    // Ensure the user owns this collection entry before updating
    const collection = await Collection.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { question: questionId },
      { new: true },
    );

    if (!collection) {
      throw new Error("Collection entry not found or unauthorized");
    }

    return successResponse(collection, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete specific collection entry
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    // Ensure the user owns this collection entry before deleting
    const collection = await Collection.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!collection) {
      throw new Error("Collection entry not found or unauthorized");
    }

    return successResponse({ message: "Collection entry deleted" }, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
