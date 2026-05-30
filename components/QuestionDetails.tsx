import { IPopulatedAll } from "@/database/question.model";
import { formatDistanceToNow } from "date-fns";

function QuestionDetails(props: IPopulatedAll) {
  const { title, createdAt, views, content, tags, author } = props;
  return (
    <div className="rounded-xl border border-border p-9 bg-card space-y-5 shadow-2xl">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Asked by {author.name}</span>
        <span>•</span>
        <span>
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          })}
        </span>
        <span>•</span>
        <span>{views} views</span>
      </div>

      <div className="mt-4 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag._id}
            className="bg-primary text-white px-4 py-2 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="mt-6 prose">{content}</div>
    </div>
  );
}

export default QuestionDetails;
