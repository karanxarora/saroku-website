import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Break Saroku — Verify",
  description: "Submit a transcript from the Break Saroku challenge harness for independent server-side verification.",
};

export default function VerifyPage() {
  return (
    <>
      <Navbar />

      <section style={{ maxWidth: "620px", margin: "0 auto", padding: "80px 24px 96px" }}>
        <AnimateIn direction="up">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: "14px" }}>
            Break Saroku
          </p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.75px", textAlign: "center", margin: "0 0 16px" }}>
            Verify a break
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted)", textAlign: "center", lineHeight: "1.6", margin: "0 0 40px" }}>
            Paste or upload the transcript file the CLI saved after a break, along with the instance ID it printed on first run. We independently re-run your case through the real saroku guard — that&apos;s what actually earns leaderboard credit, not the local claim alone.
          </p>
        </AnimateIn>

        <AnimateIn delay={80}>
          <VerifyForm />
        </AnimateIn>
      </section>

      <Footer />
    </>
  );
}
