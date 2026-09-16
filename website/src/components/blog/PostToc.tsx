"use client";

import { useEffect, useState } from "react";

/**
 * In-page table of contents for long structured posts (specifications,
 * reference documents). Client-side only because it tracks the section
 * currently in view; PostProse itself stays a server module.
 *
 * The post page is a single centered 720px column with no sidebar slot, so
 * this renders two ways off one item list: a fixed rail parked in the left
 * gutter when the viewport is wide enough to have a gutter, and a collapsible
 * "Contents" card inline at the top of the post otherwise. The swap is done
 * in globals.css (.post-toc-rail / .post-toc-inline) since it needs a media
 * query.
 */

export interface TocItem {
  id: string;
  label: string;
  /** true for a nested (§x.y) entry */
  sub?: boolean;
}

// The rail is position:fixed, so it has no knowledge of where the article
// ends and the site footer begins — without this, it stays pinned in the
// viewport and overlaps the footer once a reader scrolls that far. Hiding
// it within this many px of the bottom of the document clears the footer
// (which is a few hundred px tall) before the overlap would happen.
const HIDE_NEAR_BOTTOM_PX = 420;

export default function PostToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const nodes = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const onScroll = () => {
      let current: string | null = nodes[0].id;
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= 120) current = n.id;
        else break;
      }
      setActive(current);

      const distanceFromBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setNearBottom(distanceFromBottom < HIDE_NEAR_BOTTOM_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const list = (
    <ul className="post-toc-list">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            className={`post-toc-link${i.sub ? " is-sub" : ""}${active === i.id ? " is-active" : ""}`}
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav
        className="post-toc-rail"
        aria-label="Table of contents"
        style={nearBottom ? { opacity: 0, pointerEvents: "none" } : undefined}
      >
        <p className="post-toc-title">Contents</p>
        {list}
      </nav>

      <details className="post-toc-inline">
        <summary className="post-toc-title">Contents</summary>
        {list}
      </details>
    </>
  );
}
