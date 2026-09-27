"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function DownloadIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/**
 * Small, quiet "N downloads on PyPI" readout for the header bar of a
 * `pip install trikesh` CodeBlock. Deliberately not the big animated
 * DownloadsCounter odometer used elsewhere on the site — this is meant to
 * sit next to the Copy button without competing for attention.
 */
export default function PypiDownloadsBadge() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/pypi-downloads", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { total?: number };
        if (!cancelled && typeof data.total === "number") setTotal(data.total);
      } catch {
        // Keep showing the last good value (or nothing, on first load).
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (total === null) return null;

  return (
    <span
      title={`${total.toLocaleString("en-US")} downloads on PyPI`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "11px",
        fontWeight: 600,
        color: "#A5B4FC",
        fontFamily: "var(--font-work-sans), sans-serif",
      }}
    >
      <DownloadIcon />
      {compactFormatter.format(total)}
    </span>
  );
}
