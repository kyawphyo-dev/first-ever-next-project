import Tag from "@/database/tag.model";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    const tag = await Tag.findOne({ name });
    if (!tag) {
      throw new Error("Tag not found");
    }
    return successResponse(tag, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
