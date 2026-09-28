import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsContent from "@/components/docs/DocsContent";

export const metadata: Metadata = {
  title: "Documentation · saroku",
  description:
    "Complete documentation for saroku: behavioral regression testing for LLMs. CLI reference, probe schemas, CI/CD integration, and architecture.",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          gap: "60px",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Sidebar — hidden below md via style tag */}
        <div className="docs-sidebar-wrapper">
          <DocsSidebar />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            paddingTop: "40px",
          }}
        >
          <DocsContent />
        </div>
      </div>
      <Footer />

      <style>{`
        .docs-sidebar-wrapper {
          display: block;
        }
        @media (max-width: 768px) {
          .docs-sidebar-wrapper {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
