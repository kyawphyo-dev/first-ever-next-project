import { Schema, Document, models, model } from "mongoose";

export interface Itag {
  name: string;
  questions: number;
  description?: string;
}

export interface ITagDoc extends Itag, Document {}

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questions: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const Tag = models?.Tag || model<ITagDoc>("Tag", TagSchema);

export default Tag;
