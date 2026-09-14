import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { POSTS_META } from "./posts";

export const metadata: Metadata = {
  title: "Blog · saroku",
  description: "Technical write-ups on saroku's architecture, benchmarks, and agent safety research.",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  const posts = [...POSTS_META].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <Navbar />

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 24px 80px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--primary)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          Blog
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 4.5vw, 40px)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            margin: "0 0 44px",
          }}
        >
          Notes on building saroku
        </h1>

        {posts.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: "15px" }}>No posts yet. Check back soon.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="feature-card"
              style={{
                display: "block",
                textDecoration: "none",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  color: "var(--subtle)",
                  marginBottom: "10px",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {post.title}
              </h2>
              <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
