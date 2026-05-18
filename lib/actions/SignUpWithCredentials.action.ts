"use server";

import dbConnect from "../dbConnect";
import mongoose from "mongoose";
import { errorAction } from "../response";
import User from "@/database/user.model";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { SignupSchema } from "../schemas/SignupSchema";

export async function SignUpWithCredentials(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  // 1. Validate data with Zod first
  const validation = SignupSchema.safeParse(params);
  if (!validation.success) {
    return errorAction(validation.error);
  }

  const { name, username, email, password } = validation.data;

  // 2. Connect to db
  await dbConnect();

  // 3. Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4. Check for existing user/username
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // 5. Create new user
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
          providerAccountId: email,
        },
      ],
      { session },
    );

    // 6. Commit transaction
    await session.commitTransaction();

    // 7. Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return {
      success: true as const,
      user: JSON.parse(JSON.stringify(newUser)),
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return errorAction(error);
  } finally {
    session.endSession();
  }
}
