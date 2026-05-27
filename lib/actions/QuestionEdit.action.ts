"use server";

import { auth } from "@/auth";
import Question from "@/database/question.model";
import dbConnect from "@/lib/dbConnect";
import { errorAction } from "../response";
import { EditQuestionSchema } from "../schemas/QuestionEditSchema";
import mongoose from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/TagQuestion.model";
import { IQuestionPopulated } from "./GetQuestion.action";

export async function QuestionEdit(params: {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
}): Promise<{
  success: boolean;
  message?: string;
  data?: IQuestionPopulated;
}> {
  // 1. validate data with zod
  const validated = EditQuestionSchema.safeParse(params);

  if (!validated.success) {
    return errorAction(validated.error.message);
  }

  const { title, content, tags, questionId } = validated.data;

  let session;

  try {
    // 2. db connect
    await dbConnect();

    // 3. start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // 4. auth validation
    const authSession = await auth();

    if (!authSession?.user?.id) {
      throw new Error("Unauthorized");
    }

    // 5. find question
    const question = await Question.findById(questionId)
      .populate("tags")
      .session(session);

    if (!question) {
      throw new Error("Question not found");
    }

    // OPTIONAL:
    // owner check
    // if (question.author.toString() !== authSession.user.id) {
    //   throw new Error("Forbidden");
    // }

    // 6. update title/content
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
    }

    // 7. normalize tags
    const normalizedIncomingTags = tags.map((tag) => tag.toLowerCase().trim());

    const existingTagNames = question.tags.map((tag: ITagDoc) =>
      tag.name.toLowerCase(),
    );

    // 8. tags to add
    const tagsToAdd = normalizedIncomingTags.filter(
      (tag) => !existingTagNames.includes(tag),
    );

    // 9. tags to remove
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !normalizedIncomingTags.includes(tag.name.toLowerCase()),
    );

    // ==================================================
    // REMOVE TAGS
    // ==================================================
    if (tagsToRemove.length) {
      // remove ids
      const tagsIdToRemove = tagsToRemove.map((tag: ITagDoc) =>
        tag._id.toString(),
      );

      // decrement question count
      await Tag.updateMany(
        {
          _id: {
            $in: tagsIdToRemove,
          },
        },
        {
          $inc: {
            questions: -1,
          },
        },
        { session },
      );

      // remove from question.tags
      question.tags = question.tags.filter(
        (tag: ITagDoc) => !tagsIdToRemove.includes(tag._id.toString()),
      );

      // remove relation docs
      await TagQuestion.deleteMany(
        {
          questionId: question._id,
          tagId: {
            $in: tagsIdToRemove,
          },
        },
        { session },
      );
    }

    // ==================================================
    // ADD TAGS
    // ==================================================
    if (tagsToAdd.length) {
      const newTagQuestions = [];

      for (const tag of tagsToAdd) {
        // find/create tag
        const TagForAdd = await Tag.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );

        // check relation exists
        const existingTagQuestion = await TagQuestion.findOne({
          tagId: TagForAdd._id,
          questionId: question._id,
        }).session(session);

        // only create if not exists
        if (!existingTagQuestion) {
          // create relation
          newTagQuestions.push({
            tagId: TagForAdd._id,
            questionId: question._id,
          });

          // add to question.tags
          question.tags.push(TagForAdd._id);
        }
      }

      // insert relation docs
      if (newTagQuestions.length) {
        await TagQuestion.insertMany(newTagQuestions, {
          session,
        });
      }
    }

    // ==================================================
    // SAVE QUESTION
    // ==================================================
    await question.save({ session });

    // ==================================================
    // COMMIT
    // ==================================================
    await session.commitTransaction();

    // ==================================================
    // SERIALIZE
    // ==================================================
    const serializedQuestion = {
      ...JSON.parse(JSON.stringify(question)),
      id: question._id.toString(),
    };

    return {
      success: true,
      data: serializedQuestion,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("QuestionEdit error:", error);

    return errorAction(error);
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
