"use client";

import { useEffect } from "react";

// Fires once per tab per post, silently. No UI, no third-party analytics —
// just an internal pageview count kept server-side for later use.
export default function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `saroku:blog-view-sent:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — fall through and
      // still send the ping rather than losing the count entirely.
    }
    fetch("/api/blog-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
