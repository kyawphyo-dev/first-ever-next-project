import { IPopulatedAll } from "@/database/question.model";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import MarkDownPreview from "./MarkDownPreview";

function QuestionDetails(props: IPopulatedAll) {
  const {
    title,
    createdAt,
    views,
    content,
    tags,
    author,
    upvotes,
    downvotes,
    answers,
  } = props;
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

      <div className="mt-6 prose">
        <MarkDownPreview content={content} />
        {/* <pre>{content}</pre> */}
      </div>

      <div className="flex items-center gap-4 text-text-muted">
        <div className="flex items-center gap-1 hover:text-accent transition-colors cursor-pointer">
          <AiOutlineLike className="text-lg" />
          <span className="text-sm">{upvotes}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-accent transition-colors cursor-pointer">
          <BiDislike className="text-lg" />
          <span className="text-sm">{downvotes}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-success transition-colors cursor-pointer">
          <FaRegComment className="text-md" />
          <span className="text-sm">{answers.length}</span>
        </div>
        {/* <div className="flex items-center gap-1 hover:text-warning transition-colors cursor-pointer">
                      <MdOutlineVisibility className="text-lg" />
                      <span className="text-sm">{question?.views}</span>
                    </div> */}
      </div>
    </div>
  );
}

export default QuestionDetails;
