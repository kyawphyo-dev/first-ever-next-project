import User from "@/database/user.model";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return successResponse(user, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
