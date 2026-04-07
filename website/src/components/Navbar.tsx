"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        backgroundColor: scrolled ? "rgba(var(--bg-rgb, 248,248,255), 0.97)" : "transparent",
        borderBottom: `1px solid var(--border)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow 0.35s ease, background-color 0.35s ease",
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 97%, transparent)"
          : "color-mix(in srgb, var(--bg) 92%, transparent)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--primary)",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          saroku
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "28px" }}
          className="desktop-nav"
        >
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/docs">Docs</NavLink>
          <a
            href="https://github.com/Karanxa/saroku"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href="https://huggingface.co/karanxa/saroku-safety-0.5b"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <HuggingFaceIcon />
            HuggingFace
          </a>
          <ThemeToggle />
          <a
            href="https://pypi.org/project/saroku/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-install-btn"
            style={{
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            pip install saroku
          </a>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="mobile-controls">
          <div className="mobile-theme">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text)",
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="mobile-menu-anim"
          style={{
            borderTop: `1px solid var(--border)`,
            backgroundColor: "var(--bg)",
            padding: "16px 24px 20px",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { href: "/#features",    label: "Features"      },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/docs",          label: "Docs"          },
              { href: "https://github.com/Karanxa/saroku", label: "GitHub" },
              { href: "https://huggingface.co/karanxa/saroku-safety-0.5b", label: "HuggingFace" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: "var(--text-2)",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "10px 0",
                  borderBottom: `1px solid var(--border-2)`,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav       { display: none !important; }
          .mobile-menu-btn   { display: block !important; }
          .mobile-controls   { display: flex !important; }
          .mobile-theme      { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-controls { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="nav-link"
      style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
    >
      {children}
    </Link>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function HuggingFaceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 95 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M47.2 0C21.1 0 0 19.7 0 44c0 24.3 21.1 44 47.2 44s47.2-19.7 47.2-44C94.4 19.7 73.3 0 47.2 0z" fill="#FFD21E"/>
      <path d="M27.5 38.2c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1zm29.7 0c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1z" fill="#3A3A3A"/>
      <path d="M28.4 53.7c2.8 6.4 9.2 10.9 16.7 11.1h4.2c7.5-.2 13.9-4.7 16.7-11.1H28.4z" fill="#3A3A3A"/>
      <path d="M22.1 25.1c.6-1.6 2-2.7 3.7-2.7 1.1 0 2.1.4 2.8 1.1M69.5 25.1c-.6-1.6-2-2.7-3.7-2.7-1.1 0-2.1.4-2.8 1.1" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
