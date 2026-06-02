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

const question = {
  id: "q123",
  title: "How to improve React app performance?",
  content: `### Question

  I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

  #### What I've Tried:
  - Lazy loading components
  - Using React.memo on some components
  - Managing state with React Context API

  #### Issues:
  - The app still lags when rendering large lists.
  - Switching between pages feels sluggish.
  - Sometimes, re-renders happen unexpectedly.

  #### Key Areas I Need Help With:
  1. Efficiently handling large datasets.
  2. Reducing unnecessary re-renders.
  3. Optimizing state management.

  Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:

  \`\`\`js
  import React, { useState, useMemo } from "react";

  const LargeList = ({ items }) => {
    const [filter, setFilter] = useState("");

    // Filtering items dynamically
    const filteredItems = useMemo(() => {
      return items.filter((item) => item.includes(filter));
    }, [items, filter]);

    return (
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items"
        />
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  export default LargeList;
  \`\`\`

  #### Questions:
  1. Is using \`useMemo\` the right approach here, or is there a better alternative?
  2. Should I implement virtualization for the list? If yes, which library would you recommend?
  3. Are there better ways to optimize state changes when dealing with user input and dynamic data?

  Looking forward to your suggestions and examples!

  **Tags:** React, Performance, State Management
    `,
  createdAt: "2025-01-15T12:34:56.789Z",
  upvotes: 42,
  downvotes: 3,
  views: 1234,
  answers: 5,
  tags: [
    { _id: "tag1", name: "React" },
    { _id: "tag2", name: "Node" },
    { _id: "tag3", name: "PostgreSQL" },
  ],
  author: {
    _id: "u456",
    name: "Jane Doe",
    image: "/avatars/jane-doe.png",
  },
};
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
          questions.map((question, i) => (
            <ThreadCard key={question.id} {...question} />
          ))
        }
      />
    </div>
  );
}

export default page;
