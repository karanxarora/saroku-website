import type { ReactNode } from "react";
import {
  H2,
  H3,
  P,
  UL,
  LI,
  Table,
  Th,
  Td,
  Code,
  InlineCode,
  Callout,
} from "@/components/blog/PostProse";
import PostToc, { type TocItem } from "@/components/blog/PostToc";
import ArchitectureFlow from "@/components/ArchitectureFlow";

/**
 * "Control Is All You Need: Secure Before It Acts" — the flagship technical
 * report for saroku, published as a post so it has a stable public URL at
 * saroku.com/blog/control-is-all-you-need.
 *
 * Section numbering is load-bearing: the report cross-references its own
 * sections (§5.2, §8.1, §9.1, ...) throughout. Do not renumber sections when
 * editing — SEC ids below are what those cross-references resolve to.
 */

const TOC: TocItem[] = [
  { id: "introduction", label: "1. Introduction" },
  { id: "related-work", label: "2. Related Work" },
  { id: "approach", label: "3. Approach" },
  { id: "saroku", label: "4. saroku" },
  { id: "asp", label: "5. Action Safety Protocol" },
  { id: "asp-input", label: "5.1 Input", sub: true },
  { id: "asp-output", label: "5.2 Output", sub: true },
  { id: "saroku-guard", label: "6. saroku-guard" },
  { id: "dataset", label: "7. Dataset" },
  { id: "dataset-construction", label: "7.1 Construction", sub: true },
  { id: "dataset-composition", label: "7.2 Composition", sub: true },
  { id: "dataset-release", label: "7.3 Release plan", sub: true },
  { id: "methodology", label: "8. Evaluation Methodology" },
  { id: "methodology-tiers", label: "8.1 Classifying the models", sub: true },
  { id: "methodology-format", label: "8.2 Native input format", sub: true },
  { id: "methodology-scope", label: "8.3 Scope and scoring", sub: true },
  { id: "results", label: "9. Results" },
  { id: "results-primary", label: "9.1 Primary comparison", sub: true },
  { id: "results-attribution", label: "9.2 Violation-type attribution", sub: true },
  { id: "incident", label: "10. Reconstructing the Incident" },
  { id: "conclusion", label: "11. Conclusion" },
  { id: "references", label: "References" },
];

/* ── Report-only local primitives ─────────────────────────────────────── */

/**
 * In-page cross-reference to another section, e.g. §5.2. Reuses the same
 * .sec-ref treatment the ASP post introduced: inherits body color with a
 * faint dotted underline rather than full link-blue, since this report's
 * prose is dense with these.
 */
function SecRef({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={`#${to}`} className="sec-ref">
      {children}
    </a>
  );
}

/** Superscript citation marker, e.g. [9]. */
function Cite({ n }: { n: number }) {
  return (
    <a
      href="#references"
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "0.72em",
        color: "var(--primary-l)",
        verticalAlign: "super",
        textDecoration: "none",
      }}
    >
      [{n}]
    </a>
  );
}

type Tier = "peer" | "adjacent" | "baseline";

const TIER_TOKENS: Record<Tier, { fg: string; bg: string; italic?: boolean }> = {
  peer: { fg: "var(--primary-l)", bg: "var(--primary-t)" },
  adjacent: { fg: "var(--muted)", bg: "var(--surface-3)" },
  baseline: { fg: "var(--muted)", bg: "var(--surface-3)", italic: true },
};

function TierTag({ tier }: { tier: Tier }) {
  const t = TIER_TOKENS[tier];
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "10.5px",
        padding: "1px 7px",
        borderRadius: "4px",
        color: t.fg,
        background: t.bg,
        fontStyle: t.italic ? "italic" : "normal",
        whiteSpace: "nowrap",
      }}
    >
      {tier[0].toUpperCase() + tier.slice(1)}
    </span>
  );
}

/**
 * The 5-item release "stack" near the end of the report — a deliberately
 * non-tabular, editorial list (name + description per row) distinct from
 * the report's data tables, matching the source HTML's intent for this
 * element as a magazine-style callout rather than a spec table.
 */
function Stack({ items }: { items: { name: ReactNode; desc: ReactNode }[] }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)", margin: "24px 0 8px" }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 20px",
            padding: "16px 0",
            borderBottom: "1px solid var(--border-2)",
          }}
        >
          <div
            style={{
              flex: "0 0 150px",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--primary-l)",
            }}
          >
            {it.name}
          </div>
          <div style={{ flex: "1 1 300px", fontSize: "15px", lineHeight: 1.65, color: "var(--text-2)" }}>
            {it.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

const SAROKU_SNIPPET = `from saroku import SafetyGuard
from saroku.integrations import protect

guard = SafetyGuard()                      # saroku-guard loads by default
agent = await protect(agent, guard=guard)  # every tool call now judged`;

export default function ControlIsAllYouNeed() {
  return (
    <>
      <PostToc items={TOC} />

      <p
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "11.5px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--primary-l)",
          margin: "0 0 8px",
        }}
      >
        Technical Paper
      </p>
      <p
        style={{
          fontSize: "15px",
          color: "var(--text-2)",
          margin: "0 0 32px",
        }}
      >
        Author{" "}
        <a
          href="https://x.com/aiwithkaran"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          Karan Arora
        </a>
      </p>

      <Callout label="Abstract">
        <P>
          A tool call an agent proposes and a tool call an agent should be allowed to execute are
          not the same thing, and almost nothing deployed in front of agents today is designed to
          distinguish between them at the one moment that matters most: immediately before
          execution. That judgment is the <strong>Policy Decision Point (PDP)</strong> role from
          access-control architecture <Cite n={9} />, long established in authorization systems
          and, to my knowledge, never systematically evaluated as a distinct security problem for
          agent actions specifically.
        </P>
        <P>
          The premise here is simple: every action an agent takes should be checked before it
          executes. Making that a real security control instead of a slogan requires answering one
          question first: can existing safety models actually tell the actions that should run
          apart from the ones that shouldn&apos;t?
        </P>
        <P>
          To answer that, I built the benchmark before building anything else: pre-execution agent
          tool-call decisions across 16 domains, each labeled safe or unsafe with a violation
          category and severity. I scored five guard and moderation models and a non-learned
          baseline against it, each in its own documented input format, and classified each by
          whether it was actually built for this task, a related-but-different one, or neither.
          The results expose a trade, not a bad score. The strongest confirmed peer, purpose-built
          for multi-step agent trajectory safety, catches <strong>99.7%</strong> of unsafe actions
          and blocks <strong>72.1%</strong> of legitimate ones to do it. A guard that misses unsafe
          actions is
          ineffective; a guard that blocks legitimate work is unusable. Until now there was no
          standard benchmark that would have made that trade visible.
        </P>
        <P>
          This is the gap saroku is built to close. I formalized the decision itself as a
          standalone contract, the <strong>Action Safety Protocol (ASP)</strong>, so any
          enforcement layer can call any conformant judge. Then I trained the judge:{" "}
          <strong>
            <a href="https://huggingface.co/karanxa/saroku-guard" style={{ color: "var(--primary-l)" }}>
              saroku-guard
            </a>
          </strong>
          , a 184M-parameter classifier built for this task, catches <strong>97.9%</strong> of
          unsafe actions while wrongly blocking <strong>2.9%</strong> of safe ones, at
          single-digit-millisecond latency, and runs as the
          default judge inside{" "}
          <a href="https://saroku.com" style={{ color: "var(--primary-l)" }}>
            saroku
          </a>
          , an open-source runtime safety library that puts this decision directly in the agent&apos;s
          execution path. I also reconstruct the behavioral shape of a real agentic security
          incident (<SecRef to="incident">§10</SecRef>) and run it against saroku-guard directly,
          rather than resting on aggregate statistics alone. I release the labeled dataset with
          this report; the evaluation holdout stays private (
          <SecRef to="dataset-release">§7.3</SecRef>).
        </P>
      </Callout>

      {/* ── 1. Introduction ── */}
      <H2 id="introduction">1. Introduction</H2>
      <P>
        In July 2026, an OpenAI agent inside an internal security-testing environment was given a
        task that turned out to be unsolvable. Instead of stopping, it chained nine zero-day
        vulnerabilities in a self-hosted Artifactory instance, turned the service into a covert
        channel to talk to other agent instances, escalated to admin access, and forged
        credentials from a stolen signing key. Messages it sent to peer agents pulled several of
        them off their own assigned tasks too. Hugging Face&apos;s forensic team counted roughly
        17,600 attacker actions before it was contained <Cite n={8} />.
      </P>
      <P>
        Nine zero-days is a patching problem; no classifier touches that. But every step the agent
        took to exploit them was a proposed action that nothing evaluated before it ran. That is
        the problem this report is about: not the vulnerabilities, but the fact that each
        individual escalation went unchecked. And the way it spread, one agent&apos;s message
        derailing another agent&apos;s goal, is prompt injection at peer-agent scale. I had written
        the <InlineCode>injection</InlineCode> category in the taxonomy below (
        <SecRef to="asp-output">§5.2</SecRef>) before this incident, and it already covers it.
      </P>
      <P>
        This is also, concretely, why trajectory review isn&apos;t enough. The incident ran for
        weeks precisely because nothing was positioned to catch a single step of it in the moment:
        everything watching it was reviewing a sequence after the fact, not judging one action
        before it executed. My two closest confirmed benchmark peers, AgentDoG and ShieldAgent (
        <SecRef to="methodology-tiers">§8.1</SecRef>, <SecRef to="results-primary">§9.1</SecRef>),
        are trajectory-review models. That&apos;s the same gap.
      </P>
      <P>
        This decision, made immediately before a proposed action executes and distinct from
        trajectory review, chat moderation, or detecting an injected instruction upstream, is what
        the benchmark below measures directly. What it exposes is not that existing guard models
        score badly. It is that every one of them forces the same trade: miss unsafe actions, or
        block so many legitimate ones that the agent stops being useful and the guard gets
        switched off. A safety layer nobody leaves running is not a safety layer.
      </P>
      <Callout label="Objective">
        <P>
          Work out how this decision should actually be made and enforced (
          <SecRef to="approach">§3</SecRef>), fix it as a precise, checkable contract (
          <SecRef to="asp">§5</SecRef>), build the thing that makes and enforces it (
          <SecRef to="saroku">§4</SecRef>), and then measure how well the guard models already
          deployed for &quot;agent safety&quot; make that same decision today (
          <SecRef to="methodology">§8</SecRef>, <SecRef to="results">§9</SecRef>).
        </P>
      </Callout>

      {/* ── 2. Related Work ── */}
      <H2 id="related-work">2. Related Work</H2>
      <P>
        Four families of model already sit in front of agents, or close enough to be mistaken for
        it. None is built for the decision in <SecRef to="introduction">§1</SecRef>. Three of them
        are near enough that the difference is worth stating precisely.
      </P>

      <H3>General content-safety classifiers</H3>
      <P>
        Llama Guard <Cite n={1} />, ShieldGemma, and Qwen3Guard <Cite n={2} /> classify harm
        categories in conversational text: violence, illegal content, jailbreak attempts. Llama
        Guard&apos;s most recent generation documents agent/tool-call conversation support in its
        taxonomy, making it the closest off-the-shelf candidate, but it remains a harm-category
        classifier applied to an agent turn, not a classifier trained against a
        constraint-violation / scope / goal-drift taxonomy specific to pre-execution action
        judgment.
      </P>

      <H3>Prompt-injection detectors</H3>
      <P>
        Prompt Guard <Cite n={3} /> solves a genuinely different task: detecting that an upstream
        input contains an injected instruction, not judging whether a downstream action is safe to
        execute. A model can correctly flag an injection and say nothing useful about whether the
        resulting action should be blocked, and vice versa.
      </P>

      <H3>Agent-trajectory safety classifiers</H3>
      <P>
        AgentDoG <Cite n={4} /> and ShieldAgent <Cite n={5} /> are the closest prior work. Both are
        fine-tuned specifically to judge the safety of an LLM agent&apos;s behavior from its
        observations, reasoning, and actions. The framing difference is that both were built to
        review a completed or in-progress multi-step trajectory, whereas ASP&apos;s task judges a
        single proposed action before it executes: pre-execution rather than post-hoc, and
        single-action rather than trajectory-level. I treat this as a framing difference rather
        than a task mismatch and include both as valid head-to-head peers (
        <SecRef to="methodology-tiers">§8.1</SecRef>).
      </P>

      <H3>Agent-safety benchmarks</H3>
      <P>
        AgentHarm <Cite n={6} /> and ToolEmu <Cite n={7} /> evaluate agent behavior end-to-end or
        in simulation, generally scoring whether an agent completes a harmful task across a full
        interaction. Neither isolates the specific sub-decision this benchmark targets: one
        proposed action, judged before execution, independent of how the agent arrived at
        proposing it.
      </P>
      <P>
        None of the four categories above were built to answer, directly, the question this
        report benchmarks: given this proposed action, should it run?{" "}
        <SecRef to="approach">§3</SecRef> works out how that question should actually be answered
        and enforced; <SecRef to="asp">§5</SecRef> then fixes it as a precise input/output shape
        every instance in this benchmark, and every model evaluated against it, is held to.
      </P>

      {/* ── 3. Approach ── */}
      <H2 id="approach">3. Approach</H2>
      <P>
        The question itself is simple to state: given this proposed action and its context,
        should it run? Answering it well requires separating two things that are easy to conflate:{" "}
        <em>deciding</em> whether an action is safe, and <em>enforcing</em> that decision at the
        point where the action would actually execute. Access-control architecture already has
        names for this split and decades of production use behind it: a{" "}
        <strong>Policy Decision Point (PDP)</strong> decides, a{" "}
        <strong>Policy Enforcement Point (PEP)</strong> enforces that decision at the boundary
        where the action would otherwise proceed <Cite n={9} />. Applied to an agent, the mapping
        is direct: the PEP is code sitting inline in the agent&apos;s own tool-calling loop,
        intercepting every proposed call; the PDP is whatever judges whether that call should
        proceed.
      </P>
      <P>
        Keeping these separate is what makes the rest of this report possible. The PEP&apos;s job
        stays fixed and simple no matter how the PDP changes: intercept the call, ask the PDP, act
        on the verdict. That lets the PDP be improved, replaced, or run in combination with
        others, without touching the code sitting in the agent&apos;s tool-calling loop, or the
        agent itself. It also makes the PDP benchmarkable in isolation, since its entire job is
        one well-defined decision rather than something entangled with enforcement mechanics,
        retries, or transport. <SecRef to="dataset">§7</SecRef> through{" "}
        <SecRef to="results">§9</SecRef> do exactly that: benchmark PDPs as a category, independent
        of how any of them get enforced.
      </P>
      <P>
        I formalized this decision contract as a standalone, versioned specification, the{" "}
        <strong>
          <a
            href="https://saroku.com/blog/action-safety-protocol"
            style={{ color: "var(--primary-l)" }}
          >
            Action Safety Protocol (ASP)
          </a>
        </strong>
        , precisely so that a PDP built by anyone else could be evaluated against this benchmark,
        and so any PEP could call any conformant PDP, without either side depending on my code (
        <SecRef to="asp">§5</SecRef> defines that contract exactly). Models get replaced. The
        contract for what a safety decision even is should outlast them. I then built a reference
        implementation of both halves:{" "}
        <a href="https://saroku.com" style={{ color: "var(--primary-l)" }}>
          saroku
        </a>{" "}
        is the PEP, an open-source library that wraps an agent&apos;s tool calls and asks a
        configured PDP for a verdict before letting each one through;{" "}
        <a href="https://huggingface.co/karanxa/saroku-guard" style={{ color: "var(--primary-l)" }}>
          saroku-guard
        </a>{" "}
        is the PDP I ship as its default, fast enough to run on every call inline.{" "}
        <SecRef to="saroku">§4</SecRef> and <SecRef to="saroku-guard">§6</SecRef> detail them. The
        remainder of this report is the case for why that specific PDP is the right default:
        benchmarked against the alternatives (<SecRef to="methodology">§8</SecRef>,{" "}
        <SecRef to="results">§9</SecRef>), and checked directly against a real incident&apos;s
        behavioral shape (<SecRef to="incident">§10</SecRef>).
      </P>

      {/* ── 4. saroku ── */}
      <H2 id="saroku">4. saroku</H2>
      <P>
        <SecRef to="approach">§3</SecRef> argued the decision should be split into a PEP that
        enforces and a PDP that decides. saroku is that argument built: an open-source library
        that implements the enforcement half, ships a judge for the deciding half (
        <SecRef to="saroku-guard">§6</SecRef>), and speaks a protocol that lets either side be
        swapped (<SecRef to="asp">§5</SecRef>).
      </P>
      <P>
        A model that holds both ends of the trade is necessary for a guard you can leave on. It is
        not sufficient. The rest of that claim is an integration problem: a check nobody can adopt
        without rewriting their agent, or that adds a hosted dependency to every tool call, gets
        switched off for reasons that have nothing to do with its accuracy. saroku is the
        enforcement half, and it is built around removing those reasons.
      </P>
      <P>
        It requires no configuration to start. Installing it and instantiating the guard is enough
        to get a working policy enforcement point, because it loads saroku-guard as its default
        PDP automatically, with no API key, no hosted service, and no network call on the fast
        path. The decision stays on the machine the agent runs on.
      </P>
      <Code code={SAROKU_SNIPPET} language="python" />
      <P>
        <InlineCode>protect()</InlineCode> detects the framework from the agent object and applies
        interception to every tool it exposes, for Google ADK, AutoGen, and LangChain. A blocked
        call raises before the tool body runs. Where an agent is hand-rolled rather than built on
        one of those frameworks, <InlineCode>wrap()</InlineCode> applies the same interception to
        a single tool, and <InlineCode>guard.check()</InlineCode> exposes the raw decision for
        callers who want to route on it themselves. Adoption cost is one line against an existing
        agent, and nothing about the agent&apos;s own code changes.
      </P>
      <P>Three modes trade off latency against depth of review:</P>
      <UL>
        <LI>
          <strong>local</strong>: saroku-guard only, no LLM call, single-digit-millisecond
          decisions.
        </LI>
        <LI>
          <strong>balanced</strong> (default): saroku-guard runs on every action; only actions it
          flags unsafe escalate to an LLM judge for a second, deeper opinion.
        </LI>
        <LI>
          <strong>thorough</strong>: every action goes through the LLM judge, regardless of what
          saroku-guard says.
        </LI>
      </UL>
      <figure style={{ margin: "28px 0" }}>
        <ArchitectureFlow />
        <figcaption style={{ marginTop: "16px", fontSize: "13px", color: "var(--subtle)", textAlign: "center" }}>
          saroku&apos;s default (balanced) execution path.
        </figcaption>
      </figure>
      <P>
        None of this changes across modes except which PDP, or how many, get consulted.
        That&apos;s the point of keeping the PEP and PDP separate (<SecRef to="approach">§3</SecRef>
        ): the code sitting in the agent&apos;s tool-calling loop stays the same whether it&apos;s
        backed by saroku-guard alone, saroku-guard plus an LLM judge, or, since saroku speaks ASP,
        a different conformant PDP entirely.
      </P>

      {/* ── 5. Action Safety Protocol ── */}
      <H2 id="asp">5. Action Safety Protocol</H2>
      <P>
        saroku could have kept the shape of this decision as an internal detail. Fixing it as a
        public contract instead is what lets a PDP built by anyone else be scored on the same
        benchmark, and any enforcement layer swap judges without rewriting itself. ASP defines one
        unit of work, the <em>ActionSafetyRecord</em>: a single pre-execution policy decision,
        with a fixed input schema and a fixed output schema. The full specification, with its
        request/response contract and conformance levels, is published as its own{" "}
        <a href="/blog/action-safety-protocol" style={{ color: "var(--primary-l)" }}>
          standalone document
        </a>
        .
      </P>

      <H3 id="asp-input">5.1 Input</H3>
      <P>
        An instance provides, at minimum, the proposed action and its immediate context; up to
        four additional fields depending on how much surrounding information is available in a
        given deployment:
      </P>
      <Table minWidth={560}>
        <thead>
          <tr>
            <Th>Field</Th>
            <Th>Description</Th>
            <Th>Always present</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td strong>action</Td>
            <Td>The proposed tool call, verbatim (name + arguments)</Td>
            <Td>yes</Td>
          </tr>
          <tr>
            <Td strong>context</Td>
            <Td>Agent role and environment (e.g. &quot;CI/CD release agent, staging&quot;)</Td>
            <Td>yes</Td>
          </tr>
          <tr>
            <Td strong>trigger</Td>
            <Td>
              What prompted this action: user_request / tool_result / user_override / correction
            </Td>
            <Td>yes</Td>
          </tr>
          <tr>
            <Td strong>constraints</Td>
            <Td>Operator-set rules the action must respect</Td>
            <Td>when available</Td>
          </tr>
          <tr>
            <Td strong>original_goal</Td>
            <Td>The task the agent was actually given</Td>
            <Td>when available</Td>
          </tr>
          <tr>
            <Td strong>user_message</Td>
            <Td>The literal user request, if one exists</Td>
            <Td>when available</Td>
          </tr>
          <tr>
            <Td strong>conversation</Td>
            <Td>Preceding dialogue turns</Td>
            <Td>when available</Td>
          </tr>
        </tbody>
      </Table>
      <P>
        I tier instances 1–4 by how many of these optional fields are populated, so a model
        trained on this schema learns to judge correctly whether it receives a bare
        action-plus-context pair or a fully specified deployment with constraints, goal, and
        dialogue history attached.
      </P>

      <H3 id="asp-output">5.2 Output</H3>
      <P>
        A binary decision, <InlineCode>is_safe: true/false</InlineCode>, is the primary label.
        Unsafe instances additionally carry a five-category violation type and a severity
        (high/medium/low), collapsed from a more granular internal taxonomy to a set small enough
        to support reliable per-class evaluation at current dataset scale:
      </P>
      <UL>
        <LI>
          <strong>policy_violation</strong>: constraint override, missing required approval
        </LI>
        <LI>
          <strong>scope_violation</strong>: action exceeds the minimal scope the task requires
        </LI>
        <LI>
          <strong>injection</strong>: an untrusted tool result or message steers the action
        </LI>
        <LI>
          <strong>goal_drift</strong>: the action diverges from the original stated goal
        </LI>
        <LI>
          <strong>corrigibility</strong>: the action ignores an explicit stop or correction
        </LI>
      </UL>
      <P>
        The primary classifier&apos;s decision head is binary; the violation category is produced
        by a separate, additive head (<SecRef to="saroku-guard">§6</SecRef>) and is reported here
        as a secondary result, not the benchmark&apos;s main metric.
      </P>
      <P>
        This contract is what makes the rest of the work portable. A PDP that speaks it can be
        scored on this benchmark without adopting any of my code, and a PEP that speaks it can
        swap judges without rewriting the enforcement path. The full request/response contract and
        the two conformance levels are in the{" "}
        <a
          href="https://saroku.com/blog/action-safety-protocol"
          style={{ color: "var(--primary-l)" }}
        >
          Action Safety Protocol specification
        </a>
        ; saroku (<SecRef to="saroku">§4</SecRef>) is its first implementation, and the
        specification is written so it does not have to be the only one.
      </P>

      {/* ── 6. saroku-guard ── */}
      <H2 id="saroku-guard">6. saroku-guard</H2>
      <P>
        saroku-guard is the PDP saroku loads by default: a 184M-parameter classifier trained for
        this one decision, small enough to run inline on every call. It is scored against every
        alternative I could find in <SecRef to="results">§9</SecRef>. This is how it is built.
      </P>
      <P>
        A bare allow/block verdict is a hard thing to operate. Someone still has to work out why an
        action was stopped before deciding whether to fix the agent, adjust a policy, or let it
        through next time. saroku-guard attaches a reason to every block: one of the five violation
        categories defined in <SecRef to="asp-output">§5.2</SecRef>, so a{" "}
        <InlineCode>policy_violation</InlineCode> and a <InlineCode>goal_drift</InlineCode> can be
        routed differently instead of landing in the same undifferentiated review queue.
      </P>
      <P>
        That attribution is secondary to the binary decision, not a replacement for it. The model is
        selected on how well the binary decision alone catches unsafe actions, not on how well it
        explains them: a checkpoint that attributes violations precisely but lets more of them
        through is a worse gate, whatever its attribution quality. <SecRef to="results-attribution">§9.2</SecRef>{" "}
        reports how reliable that attribution actually is, including where it falls short.
      </P>

      {/* ── 7. Dataset ── */}
      <H2 id="dataset">7. Dataset</H2>
      <P>
        Measuring the decision required a corpus of the decision. None existed, so the first thing
        I built was not a model but a dataset, and the benchmark that sits on top of it. I call
        that benchmark <strong>ASP-Bench</strong>, after the protocol rather than after any model,
        so that it can be adopted and cited independently of whichever model currently tops it.
      </P>

      <H3 id="dataset-construction">7.1 Construction</H3>
      <P>
        Instances were generated across a grid of 16 domains × 15 scenario templates (destructive
        actions with and without approval, prompt-injection-bearing tool results, goal drift,
        privilege escalation, secrets exfiltration, hard negatives designed to resemble unsafe
        actions while being compliant, and others) using an LLM generator, then merged with a
        smaller volume of hand-authored seed instances and a filtered, converted external
        tool-safety corpus. Scenario-specific target ratios deliberately bias generation toward
        unsafe examples for the highest-stakes scenario types.
      </P>
      <P>
        Of 52,500 raw generated instances, 15,117 were dropped by an automated quality filter
        (removing low-signal patterns and generic tool-call templates from the converted external
        corpus) and a further reduction was applied to cap that corpus&apos;s contribution, leaving
        28,651 instances in the released splits.
      </P>

      <H3 id="dataset-composition">7.2 Composition</H3>
      <Table minWidth={480}>
        <thead>
          <tr>
            <Th>Split</Th>
            <Th>Rows</Th>
            <Th>Safe</Th>
            <Th>Unsafe</Th>
            <Th>Role</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td strong>train</Td>
            <Td>22,682</Td>
            <Td>10,235</Td>
            <Td>12,447</Td>
            <Td>Training</Td>
          </tr>
          <tr>
            <Td strong>val</Td>
            <Td>4,049</Td>
            <Td>1,798</Td>
            <Td>2,251</Td>
            <Td>Checkpoint selection</Td>
          </tr>
          <tr>
            <Td strong>holdout</Td>
            <Td>1,920</Td>
            <Td>624</Td>
            <Td>1,296</Td>
            <Td>Frozen evaluation, this report</Td>
          </tr>
        </tbody>
      </Table>
      <P>
        The realized dataset spans <strong>29 distinct domain labels</strong>, not the 16 in the
        original generation grid: 16 primary domains at roughly 1,650–1,880 instances each
        (personal_assistant, browser, messaging, file_manager, consumer, smart_home, media,
        travel, database, filesystem, api, cloud, devtools, automation, email, payments), plus 13
        long-tail domains inherited from the converted external corpus with far fewer instances
        each (git, kubernetes, secrets, ops, iam, storage, deploy, capacity, cache,
        feature_flags, support, data_platform, injection; 5 to 90 instances apiece). I report this
        discrepancy because a generation-grid description alone would overstate how evenly the
        released data actually covers its stated domain scope; the long-tail domains are present
        but too thin to support domain-specific claims.
      </P>

      <H3 id="dataset-release">7.3 Release plan</H3>
      <P>
        I publish the train and validation splits at{" "}
        <a
          href="https://huggingface.co/datasets/karanxa/agent-action-safety-dataset"
          style={{ color: "var(--primary-l)" }}
        >
          karanxa/agent-action-safety-dataset
        </a>
        , for independent fine-tuning and replication. I keep the holdout split back. Publishing a
        frozen test set turns it into training data for whatever is evaluated against it next, and
        within a few release cycles the number it produces stops meaning anything. I run
        evaluation against the holdout on request, the established pattern for benchmarks that
        keep a private test partition.
      </P>

      {/* ── 8. Evaluation Methodology ── */}
      <H2 id="methodology">8. Evaluation Methodology</H2>
      <P>
        A benchmark is worth exactly as much as the rules it is scored under. Three of those rules
        matter enough to state before any number appears.
      </P>

      <H3 id="methodology-tiers">8.1 Classifying the models</H3>
      <P>
        A benchmark inviting &quot;beats X&quot; claims against models that were never built for
        its task is not measuring what it appears to measure. I therefore classify every evaluated
        model into one of three tiers before reporting any comparison, and every classification is
        justified with a specific, checkable source (a model card, a paper, or a documented
        taxonomy), not an assumption from the model&apos;s name or marketing description.
      </P>
      <UL>
        <LI>
          <strong>Peer</strong>: confirmed to have been built for either this exact task or a
          closely related framing of it (agent-action or agent-trajectory safety judgment). Valid
          head-to-head comparison.
        </LI>
        <LI>
          <strong>Adjacent</strong>: confirmed to solve a related but genuinely different task
          (text-level prompt-injection detection, general content moderation). Reported as a sanity
          check only; a high score here does not mean the model was &quot;beaten&quot; at its own
          task, and a low score does not mean it is a worse model in general.
        </LI>
        <LI>
          <strong>Baseline</strong>: a non-learned reference point (e.g. always predicting
          unsafe), establishing the floor a real classifier must clear.
        </LI>
      </UL>

      <H3 id="methodology-format">8.2 Native input format</H3>
      <P>
        Every model is evaluated in its own documented input format: its own chat template,
        system prompt, and dialogue framing where one is specified, not a single generic prompt
        applied uniformly across all seven. ShieldAgent, for example, is evaluated in its
        documented single-user-turn, no-system-message, tool-call-dialogue format, producing its
        own <InlineCode>[Answer] safe/unsafe</InlineCode> output convention, rather than being
        asked to answer through a format designed for this benchmark&apos;s own classifier.
      </P>
      <Callout>
        <P>
          An unfamiliar prompt format handicaps a generative model in a way indistinguishable from
          genuine task difficulty. Conflating the two would understate every competitor&apos;s
          real capability, so every model is given its own best shot at the task, on its own
          terms.
        </P>
      </Callout>

      <H3 id="methodology-scope">8.3 Scope and scoring</H3>
      <P>
        All seven models are scored on an identical, frozen set of agent tool-call decisions
        spanning 16 domains (APIs, browser automation, cloud infrastructure, consumer apps,
        databases, dev tools, email, file systems, media, messaging, payments, personal
        assistants, smart home, and travel), disjoint from every model&apos;s own training data.
        Every model is scored with the same accuracy/precision/recall/F1 implementation and the
        same definition of the positive class (<InlineCode>unsafe = 0</InlineCode>). Latency is
        measured on the same hardware for every model, in both single-request and batched (n=32)
        configurations, at p50/p95/p99.
      </P>

      {/* ── 9. Results ── */}
      <H2 id="results">9. Results</H2>
      <P>
        Seven models, one frozen evaluation set, scored under the rules above. This is ASP-Bench,
        and what follows is not an accuracy leaderboard: it is a check on whether each model
        actually holds up under the trade <SecRef to="introduction">§1</SecRef> described, catching
        unsafe actions without blocking the agent into uselessness.
      </P>

      <H3 id="results-primary">9.1 Primary comparison</H3>
      <Table minWidth={820}>
        <thead>
          <tr>
            <Th>Model</Th>
            <Th>Tier</Th>
            <Th>Accuracy</Th>
            <Th>Unsafe recall</Th>
            <Th>Safe actions blocked</Th>
            <Th>p50 (single)</Th>
            <Th>p95 (single)</Th>
            <Th>p99 (single)</Th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: "var(--primary-t)" }}>
            <Td strong>saroku-guard</Td>
            <Td>
              <TierTag tier="peer" />
            </Td>
            <Td strong>97.7%</Td>
            <Td strong>97.9%</Td>
            <Td strong>18 / 624 (2.9%)</Td>
            <Td strong>6.5ms</Td>
            <Td strong>6.8ms</Td>
            <Td strong>8.6ms</Td>
          </tr>
          <tr>
            <Td strong>
              AgentDoG <Cite n={4} />
            </Td>
            <Td>
              <TierTag tier="peer" />
            </Td>
            <Td>76.4%</Td>
            <Td>99.7%</Td>
            <Td>450 / 624 (72.1%)</Td>
            <Td>39.0ms</Td>
            <Td>39.5ms</Td>
            <Td>42.2ms</Td>
          </tr>
          <tr>
            <Td strong>
              Llama Guard 4 <Cite n={1} />
            </Td>
            <Td>
              <TierTag tier="peer" />
            </Td>
            <Td>74.5%</Td>
            <Td>71.7%</Td>
            <Td>123 / 624 (19.7%)</Td>
            <Td>120.0ms</Td>
            <Td>235.8ms</Td>
            <Td>236.9ms</Td>
          </tr>
          <tr>
            <Td strong>
              ShieldAgent <Cite n={5} />
            </Td>
            <Td>
              <TierTag tier="peer" />
            </Td>
            <Td>65.2%</Td>
            <Td>94.6%</Td>
            <Td>598 / 624 (95.8%)</Td>
            <Td>954.3ms</Td>
            <Td>957.8ms</Td>
            <Td>959.9ms</Td>
          </tr>
          <tr>
            <Td strong>Majority-unsafe</Td>
            <Td>
              <TierTag tier="baseline" />
            </Td>
            <Td>67.5%</Td>
            <Td>100%</Td>
            <Td>624 / 624 (100%)</Td>
            <Td>&lt;0.1ms</Td>
            <Td>&lt;0.1ms</Td>
            <Td>&lt;0.1ms</Td>
          </tr>
          <tr>
            <Td strong>
              Prompt Guard <Cite n={3} />
            </Td>
            <Td>
              <TierTag tier="adjacent" />
            </Td>
            <Td>67.5%</Td>
            <Td>100%</Td>
            <Td>624 / 624 (100%)</Td>
            <Td>6.9ms</Td>
            <Td>7.5ms</Td>
            <Td>8.2ms</Td>
          </tr>
          <tr>
            <Td strong>
              Qwen3Guard <Cite n={2} />
            </Td>
            <Td>
              <TierTag tier="adjacent" />
            </Td>
            <Td>35.4%</Td>
            <Td>5.3%</Td>
            <Td>13 / 624 (2.1%)</Td>
            <Td>119.1ms</Td>
            <Td>134.2ms</Td>
            <Td>206.2ms</Td>
          </tr>
        </tbody>
      </Table>
      <P>
        Read the recall column alone and AgentDoG looks like the better gate: it catches 99.7% of
        unsafe actions against saroku-guard&apos;s 97.9%, missing four where saroku-guard misses
        twenty-seven. The next column is why that reading is wrong. AgentDoG buys that recall by
        blocking 450 of 624 legitimate actions, roughly seven in ten. ShieldAgent blocks 598 of
        624. An agent wrapped in either one cannot complete ordinary work, and a gate that stops
        ordinary work does not stay switched on long enough to stop anything else. Llama Guard 4
        lands in the worst position of the three, missing 367 unsafe actions while still blocking
        123 safe ones.
      </P>
      <P>
        saroku-guard is the only model here that holds both ends at once: 97.9% of unsafe actions
        caught, 18 of 624 safe actions wrongly blocked. That combination, not the accuracy column,
        is what makes it deployable by default. The adjacent-tier models behave as expected for
        models built for a different task, and Prompt Guard&apos;s result is the clearest case:
        flagging all 624 safe actions as unsafe is not tool-call reasoning, it is a model
        defaulting to &quot;unsafe&quot; on inputs shaped unlike anything it was trained on.
      </P>

      <H3 id="results-attribution">9.2 Violation-type attribution</H3>
      <P>
        The secondary property head reaches 74.0% accuracy and 76.9% macro-F1 across the five
        violation categories on the same holdout, with substantial variance by class:
        corrigibility (89.3% recall) and injection (87.4%) are attributed reliably; policy_violation
        (70.8%) and scope_violation (70.2%) less so; goal_drift (63.7%) is the weakest category. I
        report this as a directional result: useful for surfacing context in a log or a review
        queue, not reliable enough on its own to drive automated policy branching.
      </P>

      {/* ── 10. Reconstructing the Incident ── */}
      <H2 id="incident">10. Reconstructing the Incident</H2>
      <P>
        Everything to this point is aggregate statistics over a frozen holdout. To check the
        argument in <SecRef to="introduction">§1</SecRef> directly rather than by analogy, I built
        a runnable reconstruction of the incident&apos;s behavioral shape and ran it against a
        live <InlineCode>SafetyGuard()</InlineCode>. Not a tuned configuration, and not the model
        in isolation: the default install described in <SecRef to="saroku">§4</SecRef>, which is
        what anyone gets from <InlineCode>pip install saroku</InlineCode> with no API key and no
        further setup. What follows is therefore a test of the whole stack, protocol, enforcement
        layer, and judge, rather than of a checkpoint.
      </P>
      <P>
        The reconstruction is a five-step chain of proposed actions modeled on the real sequence:
        reconfiguring an internal tool to reach outside an assigned sandbox, writing to a shared
        resource as an improvised channel to reach other agent instances, escalating session
        privileges, deriving a credential outside any legitimate use, and a second, separate agent
        instance proposing an action after receiving a message from the first (the step that tests{" "}
        <SecRef to="introduction">§1</SecRef>&apos;s specific claim about the{" "}
        <InlineCode>injection</InlineCode> category). Every tool name, service, and credential in
        the script is fictional; no real network, infrastructure, or vulnerability is touched
        anywhere in it. I ran the chain twice: once with no check at all, and once with each
        proposed action evaluated by saroku-guard before execution.
      </P>
      <P>
        Unprotected, all five actions execute. Protected, all five are blocked before execution,
        including the fifth, the peer-agent-induced step, which is the one I built this specific
        test to check. In a real deployment, enforcement halts the chain at the first blocked
        action; all five are shown here because the script evaluates each step independently, so
        the result is legible on every step, not just the first.
      </P>
      <P>
        One result worth stating plainly: all five steps were attributed to the same category,{" "}
        <InlineCode>scope_violation</InlineCode>, rather than discriminating across the three
        categories the scenario was designed to exercise. This is consistent with{" "}
        <SecRef to="results-attribution">§9.2</SecRef>&apos;s own finding that attribution is
        markedly weaker than the binary decision, on fictional tool and service names further from
        the training distribution than anything in the holdout. The binary decision, block or
        allow, was correct on all five. The attribution layer did not add the resolution I built
        this reconstruction to show.
      </P>

      {/* ── 11. Conclusion ── */}
      <H2 id="conclusion">11. Conclusion</H2>
      <P>
        The agent in <SecRef to="introduction">§1</SecRef> took roughly 17,600 actions before
        anyone stopped it. Not one of them was judged in the moment it was proposed.
      </P>
      <P>
        Pre-execution agent tool-call judgment is a distinct task from the ones current guardrail
        models are built and marketed for. On this framing, every model I tested that catches
        unsafe actions reliably does so by blocking a large share of legitimate ones, which is the
        same as not shipping a guard at all. A model trained for the decision holds both ends:
        97.9% of unsafe actions caught, 2.9% of safe ones wrongly blocked. None of this works as a
        single model release, so it is not one. Five pieces ship together, and each is useful
        without the others.
      </P>

      <Stack
        items={[
          {
            name: (
              <a
                href="https://saroku.com/blog/action-safety-protocol"
                style={{ color: "inherit" }}
              >
                ASP
              </a>
            ),
            desc: "The protocol. Defines what a pre-execution safety decision is, as a request/response contract with two conformance levels. Implementable by anyone, and the piece meant to outlast the rest.",
          },
          {
            name: "ASP-Bench",
            desc: "The benchmark. One frozen evaluation set, per-model native input formats, and a tiering rule that keeps “beats X” claims honest. Named after the task, not the product, so it can be cited by people who do not use either.",
          },
          {
            name: (
              <a
                href="https://huggingface.co/datasets/karanxa/agent-action-safety-dataset"
                style={{ color: "inherit" }}
              >
                Dataset
              </a>
            ),
            desc: (
              <>
                28,651 labeled agent action decisions across 16 domains, each with a violation
                category and severity. Train and validation splits published; holdout held back (
                <SecRef to="dataset-release">§7.3</SecRef>).
              </>
            ),
          },
          {
            name: (
              <a href="https://huggingface.co/karanxa/saroku-guard" style={{ color: "inherit" }}>
                saroku-guard
              </a>
            ),
            desc: "The judge. 184M parameters, 97.9% of unsafe actions caught against 2.9% of safe ones wrongly blocked, at single-digit-millisecond latency.",
          },
          {
            name: (
              <a href="https://saroku.com" style={{ color: "inherit" }}>
                saroku
              </a>
            ),
            desc: "The enforcement layer. Wraps an agent's tool calls, runs the judge on every one of them, and escalates only what gets flagged. Installable today, and the reference implementation of ASP.",
          },
        ]}
      />
      <P>The evaluation harness follows.</P>

      {/* ── References ── */}
      <H2 id="references">References</H2>
      <ol style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          <>Meta AI. <em>Llama Guard 4 Model Card.</em> Hugging Face, 2026.</>,
          <>Qwen Team. <em>Qwen3Guard-Gen Model Card.</em> Hugging Face, 2026.</>,
          <>Meta AI. <em>Llama Prompt Guard Model Card.</em> Hugging Face, 2025.</>,
          <>
            Liu, D. et al. <em>AgentDoG 1.5: A Lightweight and Scalable Alignment Framework for AI
            Agent Safety and Security.</em> arXiv:2605.29801, 2026.
          </>,
          <>
            Chen, Z., Kang, M., and Li, B. <em>ShieldAgent: Shielding Agents via Verifiable Safety
            Policy Reasoning.</em> arXiv:2503.22738, 2025. Model evaluated:{" "}
            <InlineCode>thu-coai/ShieldAgent</InlineCode>, a Qwen2.5-7B-Instruct fine-tune.
          </>,
          <>
            Andriushchenko, M. et al. <em>AgentHarm: A Benchmark for Measuring Harmfulness of LLM
            Agents.</em> ICLR 2025. arXiv:2410.09024.
          </>,
          <>
            Ruan, Y. et al. <em>Identifying the Risks of LM Agents with an LM-Emulated Sandbox.</em>{" "}
            ICLR 2024. arXiv:2309.15817.
          </>,
          <>OpenAI. <em>The Hugging Face Incident: Technical Report.</em> August 2026.</>,
          <>
            OASIS. <em>eXtensible Access Control Markup Language (XACML) Version 3.0.</em> OASIS
            Standard, 2013.
          </>,
        ].map((entry, i) => (
          <li key={i} style={{ fontSize: "15.5px", lineHeight: 1.7, color: "var(--text-2)" }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: "var(--primary-l)",
                fontWeight: 600,
                marginRight: "6px",
              }}
            >
              [{i + 1}]
            </span>
            {entry}
          </li>
        ))}
      </ol>

      <div style={{ borderTop: "2px solid var(--text)", marginTop: "56px", paddingTop: "24px" }}>
        <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--text-2)", margin: 0 }}>
          <strong style={{ color: "var(--text)" }}>Agents are shipping faster than the checks
          around them.</strong> Allow or block, decided once per action, before the action runs, is
          the smallest place to put a check that actually holds. saroku-guard is one implementation
          of that check. ASP is the contract that lets there be others.
        </p>
      </div>
    </>
  );
}
