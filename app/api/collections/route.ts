import { auth } from "@/auth";
import Collection from "@/database/collection.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CollectionSchema } from "@/lib/schemas/CollectionSchema";

// Toggle collection (Save/Unsave)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const body = await req.json();
    const { questionId } = CollectionSchema.parse(body);

    const existingCollection = await Collection.findOne({
      user: userId,
      question: questionId,
    });

    if (existingCollection) {
      // Unsave
      await Collection.findByIdAndDelete(existingCollection._id);
      return successResponse(
        { saved: false, message: "Removed from collection" },
        200,
      );
    } else {
      // Save
      const collection = await Collection.create({
        user: userId,
        question: questionId,
      });
      return successResponse(
        { saved: true, collection, message: "Added to collection" },
        201,
      );
    }
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Get user collections
export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId") || session?.user?.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const collections = await Collection.find({ user: userId }).populate({
      path: "question",
      populate: { path: "tags" },
    });

    return successResponse(collections, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
