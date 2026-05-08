import User from "@/database/user.model";
import { errorResponse, successResponse } from "@/lib/response";
import { UpdateUserSchema } from "@/lib/schemas/UserSchema";

import { Types } from "mongoose";

//Fetch user by id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return successResponse(user, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Delete user by id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User not found");
    }
    return successResponse(user, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

// Update user by id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const validatedData = UpdateUserSchema.parse(body);
    const user = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return successResponse(user, 200);
  } catch (e) {
    return errorResponse(e, 400);
  }
}
