import { auth } from "@/auth";
import DataRenderer from "@/components/DataRenderer";
import TagCard from "@/components/TagCard";
import { ITagDoc } from "@/database/tag.model";
import { GetTags } from "@/lib/actions/GetTags.action";

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const session = await auth();
  const { page, pageSize, search, filter } = await searchParams;

  const { success, data, message } = await GetTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    filter: filter || "",
  });

  const { tags = [] } = data || {};
  console.log(tags, success);

  return (
    <>
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-3xl font-bold">All Tags</h1>
        </div>
      </div>
      <DataRenderer<ITagDoc>
        success={success}
        data={tags}
        errorMessage={message}
        render={(tags) => {
          return (
            <div className="flex flex-wrap justify-between gap-2">
              {tags.map((tag) => (
                <TagCard key={tag._id.toString()} tag={tag} />
              ))}
            </div>
          );
        }}
      />
    </>
  );
}

export default page;
