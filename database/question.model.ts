import { Schema, Document, models, model } from "mongoose";

interface ITag {
  _id: string;
  name: string;
}

export interface IAnswer {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
}

export interface IAuthor {
  name: string;
  image?: string;
}

export interface IQuestion {
  _id: string;
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  upvotes: number;
  downvotes: number;
  views: number;
  answers?: Schema.Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionPopulated extends Omit<IQuestion, "tags"> {
  tags: ITag[];
}
export interface IAnswerPopulated extends Omit<IQuestion, "answers"> {
  answer: IAnswer[];
}

export interface IAuthorPopulated extends Omit<IQuestion, "author"> {
  author: IAuthor[];
}

export interface IPopulatedAll extends Omit<
  IQuestion,
  "tags" | "author" | "answers"
> {
  tags: ITag[];

  author: Pick<IAuthor, "name" | "image">;

  answers: Pick<IAnswer, "author" | "content" | "upvotes" | "downvotes">[];
}

export interface IQuestionDoc extends Omit<IQuestion, "_id">, Document {}

const QuestionSchema = new Schema<IQuestionDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    downvotes: {
      type: Number,
      default: 0,
    },

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
  models.Question || model<IQuestionDoc>("Question", QuestionSchema);

export default Question;
