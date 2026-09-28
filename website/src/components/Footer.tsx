"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
        marginTop: "80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary)", marginBottom: "12px", letterSpacing: "-0.5px" }}>
              saroku
            </div>
            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", maxWidth: "240px" }}>
              Test what your model values, not just what it knows.
            </p>
            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
              <FooterIcon href="https://pypi.org/project/saroku/" label="PyPI">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.18L20.3 7 12 11.82 3.7 7 12 2.18zM3 8.5l8.5 4.87v9.45L3 17.95V8.5zm9.5 14.32V13.37L21 8.5v9.45l-8.5 4.87z" />
                </svg>
              </FooterIcon>
            </div>
          </div>

          {/* Project */}
          <div>
            <FooterHeading>Project</FooterHeading>
            <FooterList items={[
              { href: "/#features",    label: "Features"     },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#comparison",  label: "Comparison"   },
              { href: "/blog",         label: "Blog"          },
            ]} />
          </div>

          {/* Docs */}
          <div>
            <FooterHeading>Documentation</FooterHeading>
            <FooterList items={[
              { href: "/docs#installation", label: "Installation"     },
              { href: "/docs#quick-start",  label: "Quick Start"      },
              { href: "/docs#architecture", label: "Architecture"     },
              { href: "/docs#roadmap",      label: "Roadmap"          },
            ]} />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "var(--subtle)", fontSize: "13px", margin: 0 }}>
            © 2026 saroku contributors. Released under the MIT License.
          </p>
          <p style={{ color: "var(--subtle)", fontSize: "13px", margin: 0 }}>
            Built for AI teams who ship responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>
      {children}
    </h3>
  );
}

function FooterList({ items }: { items: { href: string; label: string; external?: boolean }[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map(({ href, label, external }) => (
        <li key={href}>
          <FooterLink href={href} external={external}>{label}</FooterLink>
        </li>
      ))}
    </ul>
  );
}

function FooterIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="nav-link"
      style={{ color: "var(--subtle)" }}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const style: React.CSSProperties = { color: "var(--muted)", textDecoration: "none", fontSize: "14px" };
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="nav-link" style={style}>{children}</a>;
  }
  return <Link href={href} className="nav-link" style={style}>{children}</Link>;
}
