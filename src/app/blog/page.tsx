import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Learn about PDF generation, HTML to PDF conversion, and API best practices. Tips, tutorials, and updates from Doc API.",
  openGraph: {
    title: "Blog - Doc API",
    description:
      "Learn about PDF generation, HTML to PDF conversion, and API best practices.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Tips, tutorials, and updates about PDF generation and our API.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                slug={post.slug}
                date={post.date}
                description={post.description}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
