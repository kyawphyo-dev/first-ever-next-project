"use server";

import Question, { IQuestionDoc } from "@/database/question.model";
import dbConnect from "../dbConnect";
import PaginateSearchParamSchema from "../schemas/PaginateSearchParams";
import mongoose from "mongoose";
import { errorAction } from "../response";

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
  const filterQuery: mongoose.FilterQuery<IQuestionDoc> = {};

  //implement later on
  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (search) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(search, "i") } },
      { content: { $regex: new RegExp(search, "i") } },
    ];
  }

  let sortCriteria: Record<string, 1 | -1> = {
    createdAt: -1,
  };

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
