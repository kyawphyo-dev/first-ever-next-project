"use server";
import Question, { IQuestion } from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";
import "@/database/tag.model";
import { GetQuestionSchema } from "../schemas/GetQuestionSchema";
export interface ITag {
  _id: string;
  name: string;
}

export interface IQuestionPopulated extends Omit<IQuestion, "tags"> {
  tags: ITag[];
}

export async function GetQuestion(params: { questionId: string }): Promise<{
  success: boolean;
  message?: string;
  data?: IQuestionPopulated;
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
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)) as IQuestionPopulated,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    console.error("GetQuestion error:", error);
    return errorAction(error);
  }
}
