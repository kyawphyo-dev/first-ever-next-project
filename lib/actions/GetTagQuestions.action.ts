"use server";

import Tag, { ITagDoc } from "@/database/tag.model";
import dbConnect from "../dbConnect";
import Question, { IQuestionDoc } from "@/database/question.model";
import { errorAction } from "../response";
import GetTagQuestionsSchema from "../schemas/GetTagQuestionsSchema";

const GetTagQuestions = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  tagId: string;
}): Promise<{
  success: boolean;
  data?: {
    tag: ITagDoc;
    questions: IQuestionDoc[];
    isNext: boolean;
  };
  message?: string;
  details?: object | null;
}> => {
  await dbConnect();
  const validatedData = GetTagQuestionsSchema.safeParse(params);
  if (!validatedData.success) {
    return errorAction(validatedData.error);
  }
  const { tagId, page = 1, pageSize = 10, search } = validatedData.data;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    // const filterQuery: FilterQuery<typeof Question> = {
    //   tags: { $in: [tagId] },
    // };

    const filterQuery: Record<string, unknown> = {
      tags: { $in: [tagId] },
    };

    if (search) {
      filterQuery.title = { $regex: search, $options: "i" };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate("author", "name image")
      .populate("tags", "name")
      .lean()
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (e) {
    return errorAction(e);
  }
};

export default GetTagQuestions;
