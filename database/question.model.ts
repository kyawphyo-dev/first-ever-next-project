import { Schema, Document, models, model } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  upvotes: number;
  downvotes: number;
  views: number;
  answers?: Schema.Types.ObjectId[];
}

export interface IQuestionDoc extends IQuestion, Document {}

const QuestionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [
      {
        type: Number,
        default: 0,
      },
    ],
    downvotes: [
      {
        type: Number,
        default: 0,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  { timestamps: true },
);

const Question =
  models?.Question || model<IQuestionDoc>("Question", QuestionSchema);

export default Question;
