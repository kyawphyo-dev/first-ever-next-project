"use server";
import Question, { IPopulatedAll, IQuestion } from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";
import "@/database/tag.model";
import { GetQuestionSchema } from "../schemas/GetQuestionSchema";

export async function GetQuestionDetails(params: {
  questionId: string;
}): Promise<{
  success: boolean;
  message?: string;
  data?: IPopulatedAll;
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
    const question = await Question.findById(questionId)
      .populate("tags", " name")
      .populate("author", "name image")
      .lean();
    if (!question) {
      throw new Error("Question not found");
    }

    // 4. Return serialized question data
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)) as IPopulatedAll,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    console.error("GetQuestion error:", error);
    return errorAction(error);
  }
}
