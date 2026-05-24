"use server";
import { auth } from "@/auth";
import Question from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";
import { CreateQuestionSchema } from "../schemas/QuestionSchema";
import mongoose from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/TagQuestion.model";
import { api } from "../api";

export async function QuestionsCreate(params: {
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
  const validated = CreateQuestionSchema.safeParse(params);
  if (!validated.success) {
    return errorAction(validated.error);
  }

  const { title, content, tags } = validated.data;
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
    const userEmail = auth_session.user.email || "";
    const response = await api.users.getByEmail(userEmail);

    if (!response || !response.data) {
      throw new Error("User not found");
    }

    const dbUser = response.data;
    // 5. Create question
    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: dbUser._id,
        },
      ],
      { session },
    );

    if (!question) {
      throw new Error("Failed to create a question");
    }

    // 6. Create tagIds array and tagQuestionDocuments array
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    // 7. Create or update Tags
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, //Search tag name case-insensitive and exact match
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } }, // if found: Increment questions count
        { upsert: true, new: true, session }, // if not found: Create new tag
      );

      if (!existingTag) {
        throw new Error(`Failed to create or find tag: ${tag}`);
      }

      // 8. Add tagId to tagIds array and add tagQuestionDocument tagId and questionId to tagQuestionDocuments array
      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tagId: existingTag._id,
        questionId: question._id,
      });
    }

    // 9. Create or update TagQuestion documents
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // 10. Add tagIds to question tags array
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session },
    );

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
