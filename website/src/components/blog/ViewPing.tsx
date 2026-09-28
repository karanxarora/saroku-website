"use client";

import { useEffect } from "react";

// Fires once per tab load, silently. No UI, no third-party analytics —
// just an internal count kept server-side for later use.
//
// Distinguishes pageviews (every load) from unique visitors: a persistent
// id in localStorage (survives across tabs and reloads on this browser,
// unlike the old sessionStorage-per-tab guard) marks whether this browser
// has ever been counted for this slug before. Not a hard uniqueness
// guarantee — a private window, a different device, or a cleared browser
// all look like a "new" visitor — but a real improvement over raw
// pageviews for a first-party, cookie-free counter.
export default function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    const seenKey = `saroku:blog-view-seen:${slug}`;
    let isUnique = true;
    try {
      if (localStorage.getItem(seenKey)) {
        isUnique = false;
      } else {
        localStorage.setItem(seenKey, "1");
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — still send the
      // ping as a pageview rather than losing the count entirely, just
      // can't claim uniqueness for it.
      isUnique = false;
    }
    fetch("/api/blog-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, unique: isUnique }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
