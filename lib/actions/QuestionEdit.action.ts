"use server";
import { auth } from "@/auth";
import Question from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";
import { EditQuestionSchema } from "../schemas/QuestionEditSchema";
import mongoose from "mongoose";

export async function QuestionEdit(params: {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
}): Promise<{
  success: boolean;
  message?: string;
  data?: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    author: mongoose.Types.ObjectId;
  };
}> {
  // 1. validate data with zod
  const validated = EditQuestionSchema.safeParse(params);
  if (!validated.success) {
    return errorAction(validated.error);
  }

  const { title, content, tags, questionId } = validated.data;
  let session;
  try {
    // 2. db connect
    await dbConnect();

    // 3. start session
    session = await mongoose.startSession();
    session.startTransaction();

    // 4. Auth validation
    const auth_session = await auth();
    if (!auth_session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // 5. Find question
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Failed to create a question");
    }

    // 6. Update Question
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save();
    }

    // 11. Commit transaction
    await session.commitTransaction();

    // 12. Return serialized question data
    const serializedQuestion = {
      ...JSON.parse(JSON.stringify(question)),
      id: question._id.toString(),
    };

    return {
      success: true,
      data: serializedQuestion,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("QuestionsCreate error:", error);
    return errorAction(error);
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
