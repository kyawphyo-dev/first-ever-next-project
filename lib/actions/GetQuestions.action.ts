"use server";

import Question, { IQuestionDoc } from "@/database/question.model";
import dbConnect from "../dbConnect";
import PaginateSearchParamSchema from "../schemas/PaginateSearchParams";
import mongoose, { SortOrder } from "mongoose";
import { errorAction } from "../response";
import Tag from "@/database/tag.model";

export async function GetQuestions(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}): Promise<{
  data?: {
    questions: IQuestionDoc[];
    isNext?: boolean;
  };
  success: boolean;
  message?: string;
  details?: object | null;
}> {
  // 1. db connect
  await dbConnect();

  // 2. validate data
  const validated = PaginateSearchParamSchema.safeParse(params);
  if (!validated.success) {
    return errorAction(validated.error);
  }

  const { page = 1, pageSize = 10, search, filter } = validated.data;

  const skip = Number((page - 1) * pageSize); // skip documents
  const limit = Number(pageSize);
  const filterQuery: Record<string, unknown> = {};

  //implement later on
  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (search) {
    const regex = new RegExp(search, "i");

    const matchedTags = await Tag.find({
      name: { $regex: regex },
    }).select("_id");

    const tagIds = matchedTags.map((tag) => tag._id);

    filterQuery.$or = [
      { title: { $regex: regex } },
      { content: { $regex: regex } },
      { tags: { $in: tagIds } },
    ];
  }

  let sortCriteria: Record<string, SortOrder>;

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .populate("answers", "author content upvotes downvotes")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions,
        isNext,
      },
    };
  } catch (e) {
    return errorAction(e);
  }
}
