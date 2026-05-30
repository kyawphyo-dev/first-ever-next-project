import { auth } from "@/auth";
import ButtonLink from "@/components/ButtonLink";
import DataRenderer from "@/components/DataRenderer";
import Filter from "@/components/Filter";
import ThreadCard from "@/components/ThreadCard";
import { IPopulatedAll } from "@/database/question.model";
import { GetQuestions } from "@/lib/actions/GetQuestions.action";
import ROUTES from "@/routes";
import { notFound } from "next/navigation";

// const MOCK_THREADS = [
//   {
//     id: "1",
//     title: "How to handle authentication in Next.js 16?",
//     tags: ["nextjs", "auth", "react"],
//     author: {
//       name: "John Doe",
//     },
//     createdAt: "2 hours ago",
//     stats: {
//       likes: 12,
//       answers: 5,
//       views: 156,
//     },
//   },
//   {
//     id: "2",
//     title: "Understanding Server Actions in App Router",
//     tags: ["react", "nextjs", "server-actions"],
//     author: {
//       name: "Jane Smith",
//     },
//     createdAt: "5 hours ago",
//     stats: {
//       likes: 45,
//       answers: 12,
//       views: 1200,
//     },
//   },
//   {
//     id: "3",
//     title: "Tailwind CSS v4: What's new and how to migrate?",
//     tags: ["tailwind", "css", "frontend"],
//     author: {
//       name: "Alex Dev",
//     },
//     createdAt: "1 day ago",
//     stats: {
//       likes: 89,
//       answers: 24,
//       views: 3400,
//     },
//   },
// ];

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    filter?: string;
    sort?: string;
    isNext: boolean;
    question: IPopulatedAll[];
  }>;
}) {
  // Check if the user is authenticated in the session
  const session = await auth();

  const { page, pageSize, search, filter } = await searchParams;
  const { data, success, message } = await GetQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search,
    filter,
  });
  // if (!success || !data) {
  //   return notFound();
  // }

  const questions: IPopulatedAll[] = data?.questions || [];
  // isNext is reserved for future pagination implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isNext = data?.isNext || false;
  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">All Threads</h3>
        <div className="w-1/3">
          <ButtonLink href={ROUTES.QUESTIONS}>Create Thread</ButtonLink>
        </div>
      </div>
      <Filter />

      <DataRenderer
        success={success}
        data={questions}
        errorMessage={message}
        render={(questions) =>
          questions.map((question, i) => <ThreadCard key={i} {...question} />)
        }
      />
    </div>
  );
}

export default page;
