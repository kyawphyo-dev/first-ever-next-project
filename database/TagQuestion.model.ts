import { Schema, Document, models, model, Types } from "mongoose";

export interface ITagQuestion {
  tagId: Types.ObjectId | string;
  questionId: Types.ObjectId | string;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema(
  {
    tagId: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true },
);

TagQuestionSchema.index({ tagId: 1, questionId: 1 }, { unique: true });

const TagQuestion =
  models?.TagQuestion ||
  model<ITagQuestionDoc>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
