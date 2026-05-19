"use server";

import { signIn } from "@/auth";
import { SignInSchema } from "../schemas/SignInSchema";
import { errorAction } from "../response";
import { AuthError } from "next-auth";

export async function SignInWithCredentials(params: {
  email: string;
  password: string;
}) {
  // 1. Validate data with Zod
  const validation = SignInSchema.safeParse(params);
  if (!validation.success) {
    return errorAction(validation.error);
  }

  const { email, password } = validation.data;

  try {
    // 2. Attempt sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: true as const };
  } catch (error) {
    // 3. Handle Auth.js redirect logic
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // 4. Handle specific Auth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false as const,
            message: "Invalid email or password",
            details: null,
          };
        default:
          return {
            success: false as const,
            message: "Something went wrong during sign in",
            details: null,
          };
      }
    }

    return errorAction(error);
  }
}
