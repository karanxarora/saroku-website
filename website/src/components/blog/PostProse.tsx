import type { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

/**
 * Typographic primitives for long-form post bodies. Borrows the editorial
 * layout quality (generous reading width, serif display headings, section
 * rhythm) of a well-set technical report, but built entirely on the site's
 * own design tokens (var(--text), var(--primary), var(--border), ...) so a
 * post still looks like it belongs on saroku.com.
 */

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontWeight: 600,
        fontSize: "clamp(22px, 3vw, 28px)",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        color: "var(--text)",
        margin: "56px 0 16px",
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontWeight: 600,
        fontSize: "19px",
        lineHeight: 1.35,
        color: "var(--text)",
        margin: "36px 0 12px",
      }}
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: "16.5px",
        lineHeight: 1.75,
        color: "var(--text-2)",
        margin: "0 0 20px",
      }}
    >
      {children}
    </p>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: "19px",
        lineHeight: 1.6,
        color: "var(--text)",
        fontWeight: 400,
        margin: "0 0 32px",
      }}
    >
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul style={{ margin: "0 0 20px", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "8px" }}>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li style={{ fontSize: "16.5px", lineHeight: 1.7, color: "var(--text-2)" }}>{children}</li>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "0.87em",
        background: "var(--surface-3)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        padding: "1px 6px",
        color: "var(--text)",
      }}
    >
      {children}
    </code>
  );
}

export function Code({ code, language }: { code: string; language?: string }) {
  return (
    <div style={{ margin: "28px 0" }}>
      <CodeBlock code={code} language={language} />
    </div>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      style={{
        margin: "28px 0",
        padding: "4px 0 4px 20px",
        borderLeft: "3px solid var(--primary)",
        color: "var(--text-2)",
        fontSize: "17px",
        lineHeight: 1.6,
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  );
}

export function Table({ children, minWidth }: { children: ReactNode; minWidth?: number }) {
  return (
    <div style={{ margin: "28px 0", overflowX: "auto", border: "1px solid var(--border)", borderRadius: "10px" }}>
      {/* minWidth makes a dense table scroll inside its own box on narrow
          screens instead of crushing its columns. */}
      <table style={{ width: "100%", minWidth, borderCollapse: "collapse", fontSize: "14.5px" }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 14px",
        background: "var(--surface-2)",
        color: "var(--muted)",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <td
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--border-2)",
        color: strong ? "var(--text)" : "var(--text-2)",
        fontWeight: strong ? 600 : 400,
      }}
    >
      {children}
    </td>
  );
}

export function Figure({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure style={{ margin: "32px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption ?? ""}
        style={{ width: "100%", borderRadius: "10px", border: "1px solid var(--border)", display: "block" }}
      />
      {caption && (
        <figcaption style={{ marginTop: "10px", fontSize: "13px", color: "var(--subtle)", textAlign: "center" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <section style={{ marginBottom: "8px" }}>{children}</section>;
}

/* ── Specification primitives ─────────────────────────────────────────────
 * Shared because any normative/reference post needs them: field-requirement
 * badges, RFC-2119 keyword emphasis, and a bordered callout box. All colors
 * come from the site's own tokens.
 */

type BadgeKind = "required" | "optional" | "conditional" | "neutral";

const BADGE_TOKENS: Record<BadgeKind, { fg: string; bg: string; bd: string }> = {
  required: { fg: "var(--danger)", bg: "var(--danger-t)", bd: "var(--danger-b)" },
  optional: { fg: "var(--success)", bg: "var(--success-t)", bd: "var(--success-b)" },
  conditional: { fg: "var(--primary-l)", bg: "var(--primary-t)", bd: "var(--primary-b)" },
  neutral: { fg: "var(--muted)", bg: "var(--surface-3)", bd: "var(--border)" },
};

export function Badge({ kind, children }: { kind: BadgeKind; children?: ReactNode }) {
  const t = BADGE_TOKENS[kind];
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "11px",
        lineHeight: 1.5,
        padding: "1px 7px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        color: t.fg,
        background: t.bg,
        border: `1px solid ${t.bd}`,
      }}
    >
      {children ?? kind}
    </span>
  );
}

/**
 * RFC 2119 keyword. Rendered in mono and tinted by strength so a reader can
 * scan a document for its normative requirements.
 */
export function KW({ children }: { children: ReactNode }) {
  const word = String(children).trim().toUpperCase();
  const color = word.startsWith("MUST")
    ? "var(--danger)"
    : word.startsWith("SHOULD")
      ? "var(--primary-l)"
      : word.startsWith("MAY")
        ? "var(--success)"
        : "var(--text)";
  return (
    <strong
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "0.86em",
        fontWeight: 600,
        letterSpacing: "0.02em",
        color,
      }}
    >
      {word}
    </strong>
  );
}

/** Bordered box with a small mono eyebrow — conformance levels, notes, etc. */
export function Callout({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        borderRadius: "10px",
        padding: "18px 20px 4px",
        margin: "0 0 16px",
      }}
    >
      {label && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary-l)",
            margin: "0 0 10px",
          }}
        >
          {label}
        </p>
      )}
      <div style={{ fontSize: "15.5px" }}>{children}</div>
    </div>
  );
}
