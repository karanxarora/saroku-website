import type { ComponentType } from "react";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date, e.g. "2026-09-14"
  readMinutes: number;
}

export interface Post extends PostMeta {
  Content: ComponentType;
}

// Each post is a small React component under ./_posts, registered here with
// its metadata. No MDX pipeline — long-form posts are infrequent enough that
// plain components (using PostProse's typographic primitives) are simpler
// than wiring up a markdown/MDX loader for one or two posts a month.
const registry: Record<string, () => Promise<{ default: ComponentType }>> = {
  "action-safety-protocol": () => import("./_posts/action-safety-protocol"),
  "control-is-all-you-need": () => import("./_posts/control-is-all-you-need"),
};

export const POSTS_META: PostMeta[] = [
  {
    slug: "control-is-all-you-need",
    title: "Control Is All You Need: Secure Before It Acts",
    description:
      "Pre-execution agent-action safety judgment is a distinct task nothing existing is built for: the benchmark, protocol, dataset, judge model, and enforcement library that close that gap, checked against a real agentic security incident.",
    date: "2026-09-14",
    readMinutes: 22,
  },
  {
    slug: "action-safety-protocol",
    title: "Action Safety Protocol: An Interface for Pre-Execution Agent Action Safety",
    description:
      "Version 0.1.0 of ASP: an open specification for the request/response contract between the component that judges whether an agent's proposed tool call is safe and the component that enforces that judgment.",
    date: "2026-09-14",
    readMinutes: 10,
  },
];

export function getPostMeta(slug: string): PostMeta | undefined {
  return POSTS_META.find((p) => p.slug === slug);
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const meta = getPostMeta(slug);
  const loader = registry[slug];
  if (!meta || !loader) return undefined;
  const mod = await loader();
  return { ...meta, Content: mod.default };
}
