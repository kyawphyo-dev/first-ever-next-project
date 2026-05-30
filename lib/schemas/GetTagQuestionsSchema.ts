import { z } from "zod";

const GetTagQuestionsSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  search: z.string().optional().default(""),
  tagId: z.string().nonempty(),
});

export default GetTagQuestionsSchema;
