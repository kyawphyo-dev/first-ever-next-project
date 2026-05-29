import Link from "next/link";
import { ITagDoc } from "@/database/tag.model";

type TagCardProps = {
  tag: ITagDoc;
};

function TagCard({ tag }: TagCardProps) {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className="block border border-border rounded-xl p-5 hover:bg-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="inline-block px-3 py-1 rounded-md bg-secondary text-white text-sm font-medium">
            {tag.name}
          </h3>

          <p className="text-secondary mt-3 text-sm max-w-md">
            {tag.description || "No description available."}
          </p>
        </div>

        <div className="text-xs text-secondary bg-input-background px-3 py-1 rounded-full">
          {tag.questions || 0} Questions
        </div>
      </div>
    </Link>
  );
}

export default TagCard;
