"use server";

import dbConnect from "../dbConnect";
import PaginateSearchParamSchema from "../schemas/PaginateSearchParams";
import { SortOrder } from "mongoose";
import { errorAction } from "../response";
import Tag, { ITagDoc } from "@/database/tag.model";

export async function GetTags(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}): Promise<{
  data?: {
    tags: ITagDoc[];
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
    return { success: true, data: { tags: [], isNext: false } };
  }

  if (search) {
    const regex = new RegExp(search, "i");

    filterQuery.$or = [{ name: { $regex: regex } }];
  }

  let sortCriteria: Record<string, SortOrder>;

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery)
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags,
        isNext,
      },
    };
  } catch (e) {
    return errorAction(e);
  }
}
