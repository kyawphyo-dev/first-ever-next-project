"use server";
import Question, { IQuestion } from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";

import { GetQuestionSchema } from "../schemas/GetQuestionSchema";

export async function GetQuestion(params: { questionId: string }): Promise<{
  success: boolean;
  message?: string;
  data?: IQuestion;
}> {
  // 1. validate data with zod
  const validated = GetQuestionSchema.safeParse(params);
  if (!validated.success) {
    return errorAction(validated.error);
  }
  const { questionId } = validated.data;

  try {
    // 2. db connect
    await dbConnect();

    // 3. find question
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Question not found");
    }

    // 4. Return serialized question data
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

    console.error("GetQuestion error:", error);
    return errorAction(error);
  }
}
