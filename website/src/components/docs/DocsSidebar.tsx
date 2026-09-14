"use client";

import { useState, useEffect } from "react";

export interface NavSection {
  title: string;
  items: { id: string; label: string }[];
}

export const navSections: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Runtime Safety Guard",
    items: [
      { id: "safety-guard", label: "SafetyGuard Overview" },
      { id: "guard-modes", label: "Guard Modes" },
      { id: "local-model", label: "Local PDP Model" },
    ],
  },
  {
    title: "Internals",
    items: [
      { id: "architecture", label: "Architecture" },
      { id: "roadmap", label: "Roadmap" },
    ],
  },
];

interface DocsSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function DocsSidebar({ mobileOpen, onClose }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    navSections.forEach((section) =>
      section.items.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      })
    );

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    onClose?.();
  };

  return (
    <aside
      className="docs-sidebar"
      style={{
        width: "240px",
        flexShrink: 0,
        position: "sticky",
        top: "76px",
        height: "calc(100vh - 76px)",
        overflowY: "auto",
        paddingBottom: "40px",
      }}
    >
      {navSections.map((section) => (
        <div key={section.title} style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "0 8px",
              marginBottom: "6px",
            }}
          >
            {section.title}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {section.items.map(({ id, label }) => {
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => handleClick(id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--primary)" : "var(--text-2)",
                      backgroundColor: isActive ? "var(--primary-t)" : "transparent",
                      transition: "all 0.12s",
                      fontFamily: "var(--font-work-sans), sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "var(--surface-2)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--text-2)";
                      }
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
