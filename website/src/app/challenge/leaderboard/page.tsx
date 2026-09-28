import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
import { getChallengeData } from "../ChallengeData";
import { PROPERTY_LABELS } from "@/lib/challenge/scenarioMeta";

export const metadata: Metadata = {
  title: "Break Saroku — Leaderboard",
  description: "Verified breaks against saroku's SafetyGuard, by property and participant.",
};

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { entries } = await getChallengeData();

  return (
    <>
      <Navbar />

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px 88px" }}>
        <AnimateIn direction="up">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: "14px" }}>
            Break Saroku
          </p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.75px", textAlign: "center", margin: "0 0 40px" }}>
            Leaderboard
          </h1>
        </AnimateIn>

        {entries.length === 0 ? (
          <AnimateIn delay={80}>
            <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed var(--border)", borderRadius: "12px" }}>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 16px" }}>
                No verified breaks yet — be the first.
              </p>
              <Link href="/challenge/verify" style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                Have a transcript already? Verify it →
              </Link>
            </div>
          </AnimateIn>
        ) : (
          <AnimateIn delay={80}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "480px", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>Participant</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>Property</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={`${e.scenarioId}-${i}`}>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--text)" }}>{e.displayName}</td>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--text-2)" }}>{PROPERTY_LABELS[e.property] ?? e.property}</td>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--subtle)" }}>{new Date(e.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateIn>
        )}
      </section>

      <Footer />
    </>
  );
}
