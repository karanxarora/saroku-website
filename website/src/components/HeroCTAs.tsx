"use client";

import Link from "next/link";

export default function HeroCTAs() {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
      <Link
        href="/docs"
        className="btn-primary"
        style={{
          backgroundColor: "var(--primary-h)",
          color: "#FFFFFF",
          padding: "13px 28px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        Read the Docs →
      </Link>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function HuggingFaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 95 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.2 0C21.1 0 0 19.7 0 44c0 24.3 21.1 44 47.2 44s47.2-19.7 47.2-44C94.4 19.7 73.3 0 47.2 0z" fill="#FFD21E"/>
      <path d="M27.5 38.2c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1zm29.7 0c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1z" fill="#3A3A3A"/>
      <path d="M28.4 53.7c2.8 6.4 9.2 10.9 16.7 11.1h4.2c7.5-.2 13.9-4.7 16.7-11.1H28.4z" fill="#3A3A3A"/>
      <path d="M22.1 25.1c.6-1.6 2-2.7 3.7-2.7 1.1 0 2.1.4 2.8 1.1M69.5 25.1c-.6-1.6-2-2.7-3.7-2.7-1.1 0-2.1.4-2.8 1.1" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
