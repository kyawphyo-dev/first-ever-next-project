import DataRenderer from "@/components/DataRenderer";
import ThreadCard from "@/components/ThreadCard";
import GetTagQuestions from "@/lib/actions/GetTagQuestions.action";

async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const { id } = await params;
  const { page, pageSize, search } = await searchParams;

  const { success, data, message } = await GetTagQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    tagId: id,
  });

  const { questions = [], tag } = data || {};

  return (
    <>
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-3xl font-bold">{tag?.name}</h1>
        </div>
      </div>
      <DataRenderer
        success={success}
        data={questions}
        errorMessage={message}
        render={(questions) =>
          questions.map((question, i) => <ThreadCard key={i} {...question} />)
        }
      />
    </>
  );
}

export default page;
