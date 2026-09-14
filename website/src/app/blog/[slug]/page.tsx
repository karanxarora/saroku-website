import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ViewPing from "@/components/blog/ViewPing";
import { POSTS_META, getPost } from "../posts";

export function generateStaticParams() {
  return POSTS_META.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_META.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} · saroku`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { Content } = post;

  return (
    <>
      <ViewPing slug={slug} />
      <Navbar />

      <article style={{ padding: "48px 24px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link
            href="/blog"
            className="nav-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13.5px",
              color: "var(--muted)",
              textDecoration: "none",
              marginBottom: "32px",
            }}
          >
            ← Blog
          </Link>

          <header style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: "var(--subtle)",
                marginBottom: "18px",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-work-sans), sans-serif",
                fontWeight: 600,
                fontSize: "clamp(30px, 5vw, 44px)",
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
                color: "var(--text)",
                margin: 0,
              }}
            >
              {post.title}
            </h1>
          </header>

          <div className="post-body">
            <Content />
          </div>

          <footer
            style={{
              marginTop: "64px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <Link
              href="/blog"
              className="nav-link"
              style={{ fontSize: "14px", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}
            >
              ← Back to all posts
            </Link>
          </footer>
        </div>
      </article>

      <Footer />
    </>
  );
}
