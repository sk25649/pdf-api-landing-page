import Link from "next/link";
import { formatDate } from "@/lib/blog";

interface PostCardProps {
  title: string;
  slug: string;
  date: string;
  description: string;
  readingTime: string;
}

export function PostCard({
  title,
  slug,
  date,
  description,
  readingTime,
}: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div className="rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={date}>{formatDate(date)}</time>
            <span>·</span>
            <span>{readingTime}</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Link>
    </article>
  );
}
