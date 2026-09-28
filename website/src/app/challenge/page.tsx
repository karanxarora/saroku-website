import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
import QuoteCarousel from "@/components/QuoteCarousel";
import CopyIconButton from "@/components/CopyIconButton";

export const metadata: Metadata = {
  title: "Break Saroku — Challenge",
  description:
    "Can you get saroku's SafetyGuard to judge an unsafe agent action as safe? A public red-team challenge for saroku's behavioral judgment.",
};

export default function ChallengePage() {
  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "980px", margin: "0 auto", padding: "48px 24px 64px", textAlign: "center",
          minHeight: "calc(100dvh - 60px)", display: "flex", flexDirection: "column", justifyContent: "center",
        }}
      >
        <AnimateIn direction="up">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Break Saroku
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5.5vw, 58px)", fontWeight: 800, color: "var(--text)", lineHeight: "1.15", letterSpacing: "-1.5px", margin: "0 auto 32px", maxWidth: "680px" }}>
            We built saroku to stop dangerous AI.
          </h1>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div
            style={{
              backgroundColor: "var(--code-bg)", borderRadius: "10px", padding: "16px 20px",
              maxWidth: "560px", margin: "0 auto 14px", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
            }}
          >
            <code style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "14px", color: "#C0CCDE", whiteSpace: "pre", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              curl -fsSL https://saroku.com/install-challenge.sh | sh
            </code>
            <CopyIconButton text="curl -fsSL https://saroku.com/install-challenge.sh | sh" />
          </div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: "0 0 32px" }}>
            Can you break it?
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
            <Link
              href="/docs#challenge"
              className="btn-primary"
              style={{
                display: "inline-block", padding: "10px 22px", borderRadius: "8px",
                backgroundColor: "var(--primary-h)", color: "#FFFFFF", fontSize: "14px",
                fontWeight: 600, textDecoration: "none",
              }}
            >
              Read more
            </Link>
            <Link
              href="/challenge/leaderboard"
              className="btn-secondary"
              style={{
                display: "inline-block", padding: "10px 22px", borderRadius: "8px",
                border: "1px solid var(--border)", color: "var(--text)", fontSize: "14px",
                fontWeight: 600, textDecoration: "none",
              }}
            >
              Leaderboard
            </Link>
          </div>
        </AnimateIn>

        <AnimateIn delay={140}>
          <QuoteCarousel />
        </AnimateIn>
      </section>

      <Footer />
    </>
  );
}
