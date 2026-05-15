"use server";

import dbConnect from "../dbConnect";
import mongoose from "mongoose";
import { errorResponse, successResponse } from "../response";
import User from "@/database/user.model";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function SignUpWithCredentials(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  // connect to db
  await dbConnect();

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // validate data
    const { name, username, email, password } = params;
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // create new user
    const [newUser] = await User.create(
      [
        {
          email,
          name,
          username: slugify(username || "", {
            lower: true,
            remove: /[*+~.()'"!:@]/g,
            strict: true,
            trim: true,
          }),
          password: await bcrypt.hash(password, 10),
          provider: "credential",
          providerAccountId: null,
        },
      ],
      { session },
    );

    // commit transaction
    await session.commitTransaction();
    await signIn("credential", {
      email,
      password,
      redirect: false,
    });
    return successResponse({ user: newUser }, 201);
  } catch (error) {
    await session.abortTransaction();
    return errorResponse(error, 500);
  } finally {
    session.endSession();
  }
}
