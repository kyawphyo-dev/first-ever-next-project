import dbConnect from "@/lib/dbConnect";
import { fetchHandler } from "@/lib/fetchHaldler";
import { errorResponse, successResponse } from "@/lib/response";

export async function GET() {
  try {
    dbConnect();
    const response = await fetchHandler("/api/tags");
    return successResponse(response, 200);
  } catch (error) {
    return errorResponse(error, 500);
  }
}
