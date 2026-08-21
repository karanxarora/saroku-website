"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const ROLL_DURATION_MS = 850;
const STAGGER_MS_PER_POSITION = 70;
const INITIAL_EXTRA_LOOPS = 2; // full 0-9 warm-up spins on first mount only

/**
 * One odometer wheel: an overflow-hidden window showing a vertical strip
 * of stacked digits (0..pos, content = i % 10), translated so `pos % 10`
 * sits in the window. Moving `pos` forward scrolls through every
 * intervening digit, like a real mechanical counter — it never jumps
 * straight to the target, and never runs backward (a 9→0 carry adds a
 * step of 1, not -9, by construction below).
 */
function DigitReel({
  digit,
  positionFromRight,
  reducedMotion,
}: {
  digit: number;
  positionFromRight: number;
  reducedMotion: boolean;
}) {
  const [pos, setPos] = useState(digit);
  const [transitionOn, setTransitionOn] = useState(false);
  const flourished = useRef(false);

  useEffect(() => {
    const currentDigit = ((pos % 10) + 10) % 10;

    if (!flourished.current) {
      flourished.current = true;
      if (reducedMotion) return;
      const raf = requestAnimationFrame(() => {
        setTransitionOn(true);
        setPos(digit + INITIAL_EXTRA_LOOPS * 10);
      });
      return () => cancelAnimationFrame(raf);
    }

    if (currentDigit === digit) return;
    const step = (10 + digit - currentDigit) % 10;
    setTransitionOn(true);
    setPos((prev) => prev + step);
    // pos is intentionally excluded — this effect is keyed on `digit`
    // changes only, and always reads the latest committed `pos` via
    // closure since a digit change re-renders before this effect fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit, reducedMotion]);

  const rows = Array.from({ length: pos + 1 }, (_, i) => i % 10);
  const delayMs = positionFromRight * STAGGER_MS_PER_POSITION;

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: "1em",
        width: "1ch",
        verticalAlign: "top",
      }}
    >
      <span
        style={{
          display: "block",
          transform: `translateY(-${pos}em)`,
          transition:
            transitionOn && !reducedMotion
              ? `transform ${ROLL_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`
              : "none",
        }}
      >
        {rows.map((d, i) => (
          <span key={i} style={{ display: "block", height: "1em", lineHeight: "1" }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function HuggingFaceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 95 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M47.2 0C21.1 0 0 19.7 0 44c0 24.3 21.1 44 47.2 44s47.2-19.7 47.2-44C94.4 19.7 73.3 0 47.2 0z" fill="#FFD21E"/>
      <path d="M27.5 38.2c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1zm29.7 0c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1z" fill="#3A3A3A"/>
      <path d="M28.4 53.7c2.8 6.4 9.2 10.9 16.7 11.1h4.2c7.5-.2 13.9-4.7 16.7-11.1H28.4z" fill="#3A3A3A"/>
      <path d="M22.1 25.1c.6-1.6 2-2.7 3.7-2.7 1.1 0 2.1.4 2.8 1.1M69.5 25.1c-.6-1.6-2-2.7-3.7-2.7-1.1 0-2.1.4-2.8 1.1" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function Odometer({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  const formatted = value.toLocaleString("en-US");
  const chars = formatted.split("");
  const digitCount = chars.filter((c) => c >= "0" && c <= "9").length;
  let digitsSeen = 0;

  return (
    <span style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums" }}>
      {chars.map((ch, i) => {
        if (ch >= "0" && ch <= "9") {
          digitsSeen += 1;
          const positionFromRight = digitCount - digitsSeen;
          return (
            <DigitReel
              key={i}
              digit={Number(ch)}
              positionFromRight={positionFromRight}
              reducedMotion={reducedMotion}
            />
          );
        }
        return (
          <span key={i} aria-hidden="true" style={{ width: "0.35ch" }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export default function DownloadsCounter() {
  const [total, setTotal] = useState<number | null>(null);
  const [pulsing, setPulsing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevTotalRef = useRef<number | null>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/model-downloads", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { total?: number };
        if (cancelled || typeof data.total !== "number") return;

        if (prevTotalRef.current !== null && prevTotalRef.current !== data.total) {
          setPulsing(true);
          setTimeout(() => setPulsing(false), ROLL_DURATION_MS + 400);
        }
        prevTotalRef.current = data.total;
        setTotal(data.total);
      } catch {
        // Keep showing the last good value.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        borderTop: "1px solid var(--border)",
        paddingTop: "28px",
      }}
    >
      <span
        style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 800,
          color: "var(--primary)",
          letterSpacing: "-1px",
          lineHeight: 1,
          minWidth: "1ch",
          opacity: total === null ? 0.35 : 1,
          textShadow: pulsing ? "0 0 32px var(--primary-b)" : "0 0 0 transparent",
          transition: "opacity 0.4s ease, text-shadow 0.6s ease",
        }}
      >
        {total === null ? "···" : <Odometer value={total} reducedMotion={reducedMotion} />}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Total Downloads
        </span>
        <span style={{ color: "var(--border)" }} aria-hidden="true">·</span>
        <a
          href="https://huggingface.co/karanxa/saroku-safety-0.5b"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: "var(--subtle)",
            textDecoration: "none",
          }}
        >
          <HuggingFaceIcon />
          on Hugging Face
        </a>
      </div>
    </div>
  );
}
