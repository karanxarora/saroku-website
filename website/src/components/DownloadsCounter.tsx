"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const TWEEN_MS = 1500;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function DownloadsCounter() {
  const [displayValue, setDisplayValue] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const [ready, setReady] = useState(false);
  const shownRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const animateTo = (target: number) => {
    const start = shownRef.current;
    const delta = target - start;
    if (delta === 0) return;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    if (reducedMotionRef.current) {
      shownRef.current = target;
      setDisplayValue(target);
      return;
    }

    const duration = start === 0 ? TWEEN_MS : Math.min(TWEEN_MS, 600 + Math.abs(delta) * 4);
    const t0 = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = easeOutExpo(progress);
      const value = Math.round(start + delta * eased);
      shownRef.current = value;
      setDisplayValue(value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPulsing(true);
        setTimeout(() => setPulsing(false), 700);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/model-downloads", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { total?: number };
        if (cancelled || typeof data.total !== "number") return;
        setReady(true);
        animateTo(data.total);
      } catch {
        // Silently skip — keep showing the last good value.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "18px 28px",
        borderRadius: "12px",
        backgroundColor: "var(--primary-t)",
        border: `1px solid ${pulsing ? "var(--primary-b)" : "var(--border)"}`,
        boxShadow: pulsing ? "0 0 0 4px var(--primary-t)" : "0 0 0 0 transparent",
        transition: "border-color 0.5s ease, box-shadow 0.5s ease",
      }}
      title="Includes quantized variants (GGUF, etc.)"
    >
      <span
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          color: "var(--primary)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.5px",
          lineHeight: 1,
          opacity: ready ? 1 : 0.35,
          transition: "opacity 0.4s ease",
        }}
      >
        {displayValue.toLocaleString("en-US")}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Total downloads · all variants
      </span>
    </div>
  );
}
