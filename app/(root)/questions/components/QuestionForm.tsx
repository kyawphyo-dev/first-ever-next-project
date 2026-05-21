"use client";
import Editor from "@/components/Editor";
import { QuestionsCreate } from "@/lib/actions/QuestionsCreate.action";
import ROUTES from "@/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function QuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await QuestionsCreate({
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });
      if (result.success && result.data) {
        toast.success("Question submitted successfully");
        setFormData({ title: "", content: "", tags: "" });
        return router.push(ROUTES.QUESTIONS_DETAILS(result.data.id));
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 p-8 rounded-xl border border-border shadow-2xl max-w-4xl mx-auto my-12"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-main-text">
          Ask a Question
        </h1>
        <p className="text-secondary-text text-sm">
          Be specific and imagine you’re asking a question to another person.
        </p>
      </div>

      {/* Title Field */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="title"
          className="text-lg font-semibold text-main-text flex items-center gap-2"
        >
          Question Title
          <span className="text-danger text-2xl font-normal">*</span>
        </label>
        <p className="text-secondary-text text-xs italic">
          What’s the main problem you’re facing?
        </p>
        <input
          id="title"
          type="text"
          placeholder="e.g. How do I center a div in Tailwind CSS?"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          className="bg-input-background border border-border text-main-text rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
      </div>

      {/* Tags Field */}
      <div className="flex flex-col gap-3">
        <label htmlFor="tags" className="text-lg font-semibold text-main-text">
          Tags
        </label>
        <p className="text-secondary-text text-xs italic">
          Add up to 5 tags to describe what your question is about. Separate
          with commas.
        </p>
        <input
          id="tags"
          type="text"
          placeholder="e.g. react, nextjs, tailwind"
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
          className="bg-input-background border border-border text-main-text rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
      </div>

      {/* Editor Content Field */}
      <div className="flex flex-col gap-3">
        <label className="text-lg font-semibold text-main-text">
          Detailed Explanation
        </label>
        <p className="text-secondary-text text-xs italic mb-2">
          Include all the information someone would need to answer your
          question.
        </p>
        <Editor
          value={formData.content}
          onChange={(v) => setFormData((prev) => ({ ...prev, content: v }))}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent hover:bg-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Posting..." : "Post Your Question"}
      </button>
    </form>
  );
}

export default QuestionForm;
