import { NextRequest, NextResponse } from "next/server";
import { incrementBlogView } from "@/lib/blogViews";
import { POSTS_META } from "@/app/blog/posts";

const KNOWN_SLUGS = new Set(POSTS_META.map((p) => p.slug));

export async function POST(req: NextRequest) {
  let body: { slug?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : undefined;
  if (!slug || !KNOWN_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown slug" }, { status: 400 });
  }

  await incrementBlogView(slug);
  return NextResponse.json({ ok: true });
}
