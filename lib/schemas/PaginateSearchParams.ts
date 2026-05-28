import { z } from "zod";

const PaginateSearchParamSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  search: z.string().optional().default(""),
  filter: z.string().optional().default(""),
});

export default PaginateSearchParamSchema;
