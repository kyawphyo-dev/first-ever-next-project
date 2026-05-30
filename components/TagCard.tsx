import Link from "next/link";
import { ITagDoc } from "@/database/tag.model";

type TagCardProps = {
  tag: ITagDoc;
};

function TagCard({ tag }: TagCardProps) {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-hover"
    >
      <div className="flex items-center gap-4">
        <img
          alt={tag.name}
          width={40}
          height={40}
          className="h-10 w-10"
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tag.name.toLowerCase()}/${tag.name.toLowerCase()}-original.svg`}
        />

        <div>
          <h3 className="font-semibold text-white group-hover:text-primary">
            {tag.name}
          </h3>

          <p className="text-sm text-accent">{tag.questions || 0} questions</p>
        </div>
      </div>

      <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        #{tag.name}
      </div>
    </Link>
  );
}

export default TagCard;
