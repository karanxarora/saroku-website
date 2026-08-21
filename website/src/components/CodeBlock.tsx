"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  compact?: boolean;
}

export default function CodeBlock({
  code,
  language = "bash",
  showCopy = true,
  compact = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = code.trim();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1E1E2E",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: compact ? "8px 14px" : "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          {language}
        </span>
        {showCopy && (
          <button
            onClick={handleCopy}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "3px 10px",
              color: copied ? "#22C55E" : "#9CA3AF",
              fontSize: "11px",
              fontWeight: 500,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!copied) e.currentTarget.style.color = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              if (!copied) e.currentTarget.style.color = "#9CA3AF";
            }}
          >
            {copied ? (
              <>
                <CheckIcon size={11} />
                Copied
              </>
            ) : (
              <>
                <CopyIcon size={11} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code content */}
      <div style={{ overflowX: "auto" }}>
        <pre
          style={{
            margin: 0,
            padding: compact ? "14px 16px" : "20px 20px",
            color: "#CDD6F4",
            fontSize: compact ? "13px" : "13.5px",
            lineHeight: "1.65",
            fontFamily: "inherit",
            whiteSpace: "pre",
          }}
        >
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
