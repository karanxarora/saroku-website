import { H2, P, Lead, UL, LI } from "@/components/blog/PostProse";

// Placeholder body — replaced with the full technical report when the
// user is ready to publish. Keep this short; it exists to verify the
// post-page template renders real prose, headings, and lists correctly.
export default function BenchmarkingSarokuGuard() {
  return (
    <>
      <Lead>
        A look at how saroku-guard, the local safety classifier at the core of saroku, was built and
        evaluated — and how it stacks up against other agent guard models on the same task.
      </Lead>

      <P>
        This post is a placeholder for the full write-up. It covers the reasoning behind treating
        pre-execution action judgment as its own problem, the evaluation methodology used to compare
        saroku-guard against other guard models, and what the results do and don&apos;t show.
      </P>

      <H2>What&apos;s coming</H2>

      <UL>
        <LI>Why judging a proposed action before it executes is a different task from content moderation</LI>
        <LI>How the evaluation set was built and what it does and doesn&apos;t cover</LI>
        <LI>Head-to-head results against other guard models, with methodology</LI>
        <LI>Where saroku-guard fits in saroku&apos;s execution path</LI>
      </UL>

      <P>Full post coming soon.</P>
    </>
  );
}
