import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoClient from "@/components/demo/DemoClient";

export const metadata: Metadata = {
  title: "Live Demo — saroku",
  description:
    "Watch saroku's SafetyGuard catch an AI agent going rogue mid-task, live — then run your own action through the real SDK.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main>
        <DemoClient />
      </main>
      <Footer />
    </>
  );
}
