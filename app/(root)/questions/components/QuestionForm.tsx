"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Editor from "@/components/Editor";
import { IQuestionPopulated } from "@/database/question.model";
import { QuestionsCreate } from "@/lib/actions/QuestionsCreate.action";
import { QuestionEdit } from "@/lib/actions/QuestionEdit.action";
import RemovableTagCard from "@/components/RemovableTagCard";

import ROUTES from "@/routes";

function QuestionForm({
  question,
  isEdit = false,
}: {
  question?: IQuestionPopulated;
  isEdit?: boolean;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(question?.title ?? "");
  const [content, setContent] = useState(question?.content ?? "");
  const [tags, setTags] = useState<string[]>(
    question?.tags.map((tag) => tag.name) ?? [],
  );
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const formattedTag = newTag.trim().toLowerCase();

      if (!formattedTag) {
        setError("Tag cannot be empty");
        return;
      }

      if (tags.length >= 5) {
        setError("Maximum 5 tags allowed");
        return;
      }

      if (tags.includes(formattedTag)) {
        setError("Tag already exists");
        return;
      }

      setTags((prev) => [...prev, formattedTag]);

      setNewTag("");
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // =========================
      // EDIT QUESTION
      // =========================
      if (isEdit && question) {
        console.log(question);
        const result = await QuestionEdit({
          questionId: question._id as string,
          title,
          content,
          tags,
        });

        if (result.success && result.data) {
          toast.success("Question updated successfully");

          router.push(ROUTES.QUESTIONS_DETAILS(result.data.id));

          return;
        }

        toast.error(result.message || "Something went wrong");

        return;
      }

      // =========================
      // CREATE QUESTION
      // =========================
      const result = await QuestionsCreate({
        title: title,
        content: content,
        tags: tags,
      });

      if (result.success && result.data) {
        toast.success("Question submitted successfully");

        // Reset form
        setTitle("");
        setContent("");
        setTags([]);

        // setError("");
        // setNewTag("");

        router.push(ROUTES.QUESTIONS_DETAILS(result.data.id));

        return;
      }

      toast.error(result.message || "Something went wrong");
    } catch (error: unknown) {
      console.error("QuestionForm error:", error);
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTag = (tag: string) => {
    setTags((prevTags) => {
      return prevTags.filter((eachTag) => eachTag != tag);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 p-8 rounded-xl border shadow-2xl border-border max-w-4xl mx-auto my-12"
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-main-text">
          {isEdit ? "Edit Question" : "Ask a Question"}
        </h1>

        <p className="text-secondary-text text-sm">
          Be specific and imagine you’re asking a question to another developer.
        </p>
      </div>

      {/* TITLE */}
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className="text-lg font-semibold text-main-text">
          Question Title
        </label>

        <p className="text-secondary-text text-xs italic">
          What’s the main problem you’re facing?
        </p>

        <input
          id="title"
          type="text"
          required
          placeholder="e.g. How do I center a div in Tailwind CSS?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border border-border text-main-text rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
      </div>

      {/* TAGS */}
      <div className="flex flex-col gap-3">
        <label htmlFor="tags" className="text-lg font-semibold text-main-text">
          Tags
        </label>

        <p className="text-secondary-text text-xs italic">
          Please press enter to add tags. (Max 5 tags)
        </p>

        <input
          id="tags"
          onKeyDown={handleEnterPress}
          type="text"
          placeholder="e.g. react, nextjs, typescript"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value.trim())}
          className="bg-input-background border border-border text-main-text rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-5 space-x-3 flex">
          {tags &&
            tags.map((tag, i) => (
              <RemovableTagCard key={i} onRemove={() => removeTag(tag)}>
                {tag}
              </RemovableTagCard>
            ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3">
        <label className="text-lg font-semibold text-main-text">
          Detailed Explanation
        </label>

        <p className="text-secondary-text text-xs italic">
          Include all the information someone would need to answer your
          question.
        </p>

        <Editor value={content} onChange={(v) => setContent(v)} />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent hover:bg-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Submitting..."
          : isEdit
            ? "Update Question"
            : "Post Your Question"}
      </button>
    </form>
  );
}

export default QuestionForm;
