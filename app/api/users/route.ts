import User from "@/database/user.model";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/lib/response";
import { CreateUserSchema } from "@/lib/schemas/UserSchema";

import { NextResponse } from "next/server";

// get all users
export async function GET() {
  try {
    // connect to db
    await dbConnect();
    // get all users
    const users = await User.find();
    // return users
    return successResponse(users, 200);
  } catch (e) {
    return errorResponse(e, 500);
  }
}

// create user
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Validate the data
    const validatedData = CreateUserSchema.parse(data);

    const { name, username, email } = validatedData;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("Email already exists!");
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("Username already exists!");
    }

    //create User
    const user = new User(validatedData);
    await user.save();

    return successResponse(user, 201);
  } catch (e) {
    return errorResponse(e, 400);
  }
}

export async function PUT() {
  try {
    return NextResponse.json(
      {
        message: "PUT Request",
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: e instanceof Error ? e.message : "Something went wrong!",
      },
      { status: 500 },
    );
  }
}
