import { notFound } from "next/navigation";
import QuestionForm from "../../components/QuestionForm";
import { GetQuestion } from "@/lib/actions/GetQuestion.action";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(id);

  const { data: question, success } = await GetQuestion({
    questionId: id,
  });
  if (!success) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4">
      <QuestionForm question={question} isEdit={true} />
    </div>
  );
}

export default page;
