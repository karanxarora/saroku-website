import CodeBlock from "@/components/CodeBlock";

export default function DocsContent() {
  return (
    <article
      style={{
        minWidth: 0,
        flex: 1,
        maxWidth: "780px",
        paddingBottom: "80px",
      }}
    >
      <IntroductionSection />
      <InstallationSection />
      <QuickStartSection />
      <SafetyGuardSection />
      <GuardModesSection />
      <FrameworkIntegrationSection />
      <LocalModelSection />
      <ArchitectureSection />
      <RoadmapSection />
    </article>
  );
}

/* ─── Shared helpers ──────────────────────────────────────────────────── */

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: "26px",
        fontWeight: 700,
        color: "var(--text)",
        letterSpacing: "-0.5px",
        marginTop: "64px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #E5E7EB",
        scrollMarginTop: "88px",
      }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "18px",
        fontWeight: 600,
        color: "var(--text)",
        marginTop: "32px",
        marginBottom: "12px",
      }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "15px",
        color: "var(--text-2)",
        lineHeight: "1.75",
        marginBottom: "16px",
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      bg: "var(--primary-t)",
      border: "var(--primary-b)",
      color: "#3730A3",
      label: "Note",
    },
    warning: {
      bg: "var(--warning-t)",
      border: "var(--warning-b)",
      color: "var(--warning)",
      label: "Warning",
    },
    tip: {
      bg: "var(--success-t)",
      border: "var(--success-b)",
      color: "var(--success)",
      label: "Tip",
    },
  };
  const s = styles[type];

  return (
    <div
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "8px",
        padding: "14px 18px",
        marginBottom: "20px",
      }}
    >
      <strong
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: s.color,
          display: "block",
          marginBottom: "6px",
        }}
      >
        {s.label}
      </strong>
      <div style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: "1.65" }}>
        {children}
      </div>
    </div>
  );
}

function PropTable({
  rows,
}: {
  rows: { prop: string; type: string; default?: string; description: string }[];
}) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: "24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--surface-2)" }}>
            {["Option", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  fontSize: "12px",
                  borderBottom: "1px solid #E5E7EB",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} style={{ borderBottom: "1px solid #F3F4F6" }}>
              <td style={{ padding: "10px 14px" }}>
                <code
                  style={{
                    backgroundColor: "var(--border-2)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12.5px",
                    color: "var(--primary)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {row.prop}
                </code>
              </td>
              <td style={{ padding: "10px 14px", color: "var(--muted)" }}>
                <code style={{ fontSize: "12.5px", fontFamily: "var(--font-jetbrains), monospace" }}>
                  {row.type}
                </code>
              </td>
              <td style={{ padding: "10px 14px", color: "var(--muted)" }}>
                {row.default ? (
                  <code style={{ fontSize: "12.5px", fontFamily: "var(--font-jetbrains), monospace" }}>
                    {row.default}
                  </code>
                ) : (
                  <span style={{ color: "#D1D5DB" }}>—</span>
                )}
              </td>
              <td style={{ padding: "10px 14px", color: "var(--text-2)", lineHeight: "1.5" }}>
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        backgroundColor: "var(--border-2)",
        border: "1px solid #E5E7EB",
        padding: "1px 6px",
        borderRadius: "4px",
        fontSize: "13px",
        color: "var(--text-2)",
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      {children}
    </code>
  );
}

/* ─── Introduction ────────────────────────────────────────────────────── */

function IntroductionSection() {
  return (
    <div>
      <div
        id="introduction"
        style={{ scrollMarginTop: "88px", paddingTop: "8px" }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--primary-t)",
            border: "1px solid #C7D2FE",
            borderRadius: "20px",
            padding: "5px 14px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--primary-l)" }}>
            Documentation
          </span>
        </div>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-1px",
            marginBottom: "16px",
            marginTop: 0,
          }}
        >
          saroku
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--muted)",
            lineHeight: "1.65",
            marginBottom: "28px",
            fontStyle: "italic",
          }}
        >
          "The next action your agent takes is its own security boundary."
        </p>

        <P>
          saroku is an enforcement layer that intercepts an agent&apos;s proposed
          tool call immediately before execution and asks an independent judge
          whether it should run. It is the reference PEP (Policy Enforcement
          Point) for the Action Safety Protocol: it decides nothing itself,
          it enforces whatever verdict the judge returns.
        </P>
        <P>
          The default judge is <InlineCode>saroku-guard</InlineCode>, a
          184M-parameter classifier fine-tuned specifically for pre-execution
          agent-action safety: given the proposed action and its context, is
          this safe to execute? That is a different question from content
          moderation, prompt-injection detection, or post-hoc trajectory
          review, and it is the one saroku checks on every call.
        </P>

        <Callout type="info">
          On a held-out benchmark, saroku-guard catches 97.9% of unsafe
          actions while wrongly blocking 2.9% of safe ones, at single-digit
          millisecond latency. See the{" "}
          <a
            href="/blog/control-is-all-you-need"
            style={{ color: "var(--primary)" }}
          >
            technical report
          </a>{" "}
          for the full benchmark and how the numbers were measured.
        </Callout>

        <SubHeading>What saroku is NOT</SubHeading>
        <P>
          saroku is not a content filter and not a trajectory-review model.
          It does not judge whether a chat response is harmful, and it does
          not review a completed sequence of agent steps after the fact. It
          judges one proposed action, immediately before that action would
          execute, and enforces the verdict at the point where the action
          would otherwise proceed.
        </P>

        <SubHeading>Key concepts</SubHeading>
        <ul
          style={{
            paddingLeft: "20px",
            margin: "0 0 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            {
              term: "PDP",
              def: "Policy Decision Point. The component that evaluates a proposed action and returns a safety verdict. saroku-guard is the default PDP; any conformant judge can replace it.",
            },
            {
              term: "PEP",
              def: "Policy Enforcement Point. The component that intercepts the proposed action, asks the PDP for a verdict, and enforces it. saroku is the PEP.",
            },
            {
              term: "ASP",
              def: "Action Safety Protocol, the open specification defining the request/response contract between a PDP and a PEP for pre-execution agent-action decisions.",
            },
            {
              term: "Violation category",
              def: "One of five labels an unsafe verdict can carry: policy_violation, scope_violation, injection, goal_drift, corrigibility.",
            },
            {
              term: "Guard mode",
              def: "Controls how much of the decision saroku-guard handles alone versus escalates to an LLM judge: local, balanced, or thorough.",
            },
          ].map(({ term, def }) => (
            <li key={term} style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: "1.65" }}>
              <strong style={{ color: "var(--text)" }}>{term}:</strong> {def}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Installation ────────────────────────────────────────────────────── */

function InstallationSection() {
  return (
    <div>
      <SectionHeading id="installation">Installation</SectionHeading>

      <SubHeading>Requirements</SubHeading>
      <ul style={{ paddingLeft: "20px", margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Python 3.10+</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>An API key for an LLM provider, only if you use the balanced or thorough guard modes (§Guard Modes below)</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Internet access on first use, to download saroku-guard</li>
      </ul>

      <SubHeading>Install from PyPI</SubHeading>
      <CodeBlock code="pip install saroku" language="bash" />

      <SubHeading>Install from source</SubHeading>
      <CodeBlock
        code={`git clone https://github.com/saroku-ai/saroku.git
cd saroku
pip install -e ".[dev]"`}
        language="bash"
      />

      <SubHeading>Setting up API keys</SubHeading>
      <P>
        saroku talks to providers through its own native model adapters, used by
        the LLM judge in balanced/thorough guard modes: OpenAI and Anthropic are first-class adapters; Google, Groq, Mistral,
        Together, Perplexity, and Ollama route through an OpenAI-compatible
        adapter. Set environment variables for the providers you want to use:
      </P>
      <CodeBlock
        code={`# Required only for the LLM judge (balanced/thorough guard modes)
export OPENAI_API_KEY=sk-...

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini
export GOOGLE_API_KEY=...

# Groq
export GROQ_API_KEY=...

# Mistral AI
export MISTRAL_API_KEY=...

# Together AI
export TOGETHER_API_KEY=...

# Perplexity
export PERPLEXITY_API_KEY=...

# Azure OpenAI
export AZURE_OPENAI_ENDPOINT=https://my-resource.openai.azure.com
export AZURE_OPENAI_API_KEY=...

# Ollama (local), no key required`}
        language="bash"
      />
      <P>
        Prefix a model string with the provider to select its adapter:{" "}
        <InlineCode>anthropic:claude-3-5-haiku-20241022</InlineCode>,{" "}
        <InlineCode>google:gemini-2.0-flash</InlineCode>,{" "}
        <InlineCode>ollama:llama3.2</InlineCode>. No prefix defaults to OpenAI.
      </P>

      <Callout type="tip">
        You only need a provider API key if you run in balanced or thorough
        mode. The local guard mode uses only saroku-guard and needs no key
        at all. The LLM judge defaults to <InlineCode>gpt-4o-mini</InlineCode>,
        overridable with <InlineCode>SafetyGuard(judge_model=...)</InlineCode>.
      </Callout>

      <SubHeading>Verify installation</SubHeading>
      <CodeBlock code="saroku --version" language="bash" />
    </div>
  );
}

/* ─── Quick Start ─────────────────────────────────────────────────────── */

function QuickStartSection() {
  return (
    <div>
      <SectionHeading id="quick-start">Quick Start</SectionHeading>

      <P>
        No API key, no configuration. saroku-guard is the default judge and
        runs entirely on your own machine.
      </P>

      <SubHeading>Step 1: Install</SubHeading>
      <CodeBlock code="pip install saroku" language="bash" />

      <SubHeading>Step 2: Check an action</SubHeading>
      <CodeBlock
        code={`from saroku import SafetyGuard

guard = SafetyGuard()  # saroku-guard loads automatically

result = guard.check(
    action="DELETE FROM users WHERE last_login < '2023-01-01'",
    context="Production database agent",
    operator_constraints=[
        "Never DELETE on production without explicit confirmation",
    ],
)

if not result.is_safe:
    for v in result.violations:
        print(f"[{v.severity.upper()}] {v.description}")`}
        language="python"
      />
      <P>
        This is a one-off check. To catch every tool call automatically, wrap
        the agent instead.
      </P>

      <SubHeading>Step 3: Protect an agent</SubHeading>
      <CodeBlock
        code={`from saroku import SafetyGuard
from saroku.integrations import protect

guard = SafetyGuard()
safe_agent = await protect(agent, guard=guard)  # Google ADK, AutoGen, LangChain

try:
    result = await safe_agent.run(task)
except SafetyBlockedError as e:
    print(f"Action blocked: {e.violations}")`}
        language="python"
      />
      <P>
        <InlineCode>protect()</InlineCode> auto-detects the framework and wraps
        every tool call at its real execution boundary. See Framework
        Integration below for the supported frameworks, and Guard Modes for
        when to escalate to an LLM judge.
      </P>
    </div>
  );
}

/* ─── Runtime Safety Guard ────────────────────────────────────────────── */

function SafetyGuardSection() {
  return (
    <div>
      <SectionHeading id="safety-guard">SafetyGuard Overview</SectionHeading>
      <P>
        <InlineCode>SafetyGuard</InlineCode> intercepts agent actions before they execute and
        checks them against a pluggable, policy-driven safety stack: composable classifiers
        (rules, HuggingFace models, LLM judges, or ensembles) run under a declarative policy,
        orchestrated by an execution engine. Clear violations are caught in under 1ms ,
        only genuinely ambiguous actions reach a classifier or LLM judge.
      </P>
      <Callout type="tip">
        The legacy <InlineCode>SafetyGuard(mode=..., judge_model=...)</InlineCode> constructor
        still works unchanged, see <InlineCode>Guard Modes</InlineCode> below. The
        policy-driven API is additive, not a breaking change.
      </Callout>
      <CodeBlock
        code={`from saroku import SafetyGuard

guard = SafetyGuard()

result = guard.check(
    action="DELETE FROM users WHERE last_login < '2023-01-01'",
    context="Production database agent",
    operator_constraints=[
        "Never DELETE on production without explicit written confirmation",
    ],
)

if not result.is_safe:
    for v in result.violations:
        print(f"[{v.severity.upper()}] {v.property}: {v.description}")
        print(f"  → {v.recommendation}")

# Async support
result = await guard.acheck(action="...", context="...")`}
        language="python"
      />
      <SubHeading>Result object</SubHeading>
      <CodeBlock
        code={`result.is_safe            # bool
result.violations         # list[SafetyViolation]
result.checked_properties # list[str], properties evaluated
result.latency_ms         # float, total wall-clock time
result.layers_used        # list[str], classifier IDs that ran, e.g. ["rule:basic_checks"]
result.summary()          # human-readable string

# Each SafetyViolation:
v.property        # e.g. "trust_hierarchy", "minimal_footprint"
v.severity        # "high" | "medium" | "low"
v.description     # what the violation is
v.recommendation  # what to do instead
v.source          # the classifier ID that raised it`}
        language="python"
      />
      <SubHeading>Pluggable classifiers</SubHeading>
      <P>
        saroku ships built-in classifiers and supports custom ones, all composed through a
        registry:
      </P>
      <CodeBlock
        code={`from saroku.classifiers import ClassifierRegistry, HFModelClassifier

# Use a HuggingFace model
hf_classifier = HFModelClassifier("Qwen/Qwen2.5-0.5B")
ClassifierRegistry.register("hf:qwen-0.5b", hf_classifier)

# Combine classifiers in an ensemble
from saroku.classifiers import EnsembleClassifier
ensemble = EnsembleClassifier(
    classifiers=[hf_classifier],
    strategy="majority",  # or "cascade"
)
ClassifierRegistry.register("ensemble:hybrid", ensemble)`}
        language="python"
      />
      <SubHeading>Policy-driven API</SubHeading>
      <P>
        Declarative YAML policies define which classifiers run at which execution layer, with
        confidence thresholds and fallback chains:
      </P>
      <CodeBlock
        code={`from saroku import SafetyGuard, Policy

# Load a pre-built policy
policy = Policy.from_yaml("policies/default.yml")
guard = SafetyGuard(policy=policy)

result = await guard.acheck(action="...", context="...", mode="balanced")

# Inspect which classifiers were used
print(guard.metrics.summary())`}
        language="python"
      />
      <SubHeading>Execution strategies</SubHeading>
      <P>
        <InlineCode>ExecutionEngine</InlineCode> orchestrates classifiers across each policy
        layer with two strategies: <strong>cascade</strong> (try each layer&apos;s classifiers
        in order, stop at the first confident result) or <strong>speculative</strong> (run
        concurrent classifiers in a layer, use the first confident winner for lower latency).
      </P>
      <P>
        Every classifier invocation is tracked automatically, latency, confidence, outcome ,
        accessible via <InlineCode>guard.metrics</InlineCode>.
      </P>
    </div>
  );
}

/* ─── Guard Modes ─────────────────────────────────────────────────────── */

function GuardModesSection() {
  return (
    <div>
      <SectionHeading id="guard-modes">Guard Modes</SectionHeading>
      <P>
        saroku-guard, the local PDP model, protects every call by default, no setup
        required. Three modes control how it works with the LLM judge:
      </P>
      <CodeBlock
        code={`# balanced, default. saroku-guard clears safe actions in ~7ms locally;
# anything flagged escalates to the LLM judge for full attribution.
guard = SafetyGuard()

# local, saroku-guard only, zero API calls, works fully offline.
guard = SafetyGuard(mode="local")

# thorough, always uses the LLM judge for rich property-level analysis.
guard = SafetyGuard(mode="thorough", judge_model="gpt-4o-mini")`}
        language="python"
      />
      <Callout type="tip">
        <InlineCode>mode=&quot;balanced&quot;</InlineCode> (the default) is right for most
        production traffic, most actions never need an API call. For fine-grained
        control over which classifiers run and when, use the policy-driven API above instead.
      </Callout>
    </div>
  );
}

/* ─── Framework Integration ───────────────────────────────────────────── */

function FrameworkIntegrationSection() {
  return (
    <div>
      <SectionHeading id="framework-integration">Framework Integration</SectionHeading>
      <P>
        Wrap a single tool, or protect an entire agent&apos;s tools at once. saroku
        auto-detects the framework and intercepts tool calls before they execute.
      </P>
      <CodeBlock
        code={`from saroku import wrap, protect, SafetyBlockedError

# Protect a single tool
safe_search = wrap(agent.search_tool, guard=guard)

# Protect all tools in an agent (auto-detects framework)
safe_agent = await protect(agent, guard=guard)

# Handle blocked actions
try:
    result = await safe_agent.run(task)
except SafetyBlockedError as e:
    print(f"Action blocked: {e.violations}")`}
        language="python"
      />
      <SubHeading>Supported frameworks</SubHeading>
      <ul style={{ paddingLeft: "20px", margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}><strong>Google ADK</strong>, wraps every tool registered on the agent</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}><strong>AutoGen</strong>, wraps registered functions</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}><strong>LangChain</strong>, wraps each tool via <InlineCode>SarokuToolWrapper</InlineCode></li>
      </ul>
      <Callout type="tip">
        No supported framework installed? <InlineCode>wrap()</InlineCode> works on any
        callable, sync or async, so you can protect tools one at a time regardless of
        which agent framework you use.
      </Callout>
    </div>
  );
}

/* ─── Local Safety Model ──────────────────────────────────────────────── */

function LocalModelSection() {
  return (
    <div>
      <SectionHeading id="local-model">Local PDP Model, saroku-guard</SectionHeading>
      <P>
        saroku-guard protects every <InlineCode>SafetyGuard()</InlineCode> by default ,
        no setup, no API key, no data leaving your environment. It downloads automatically
        on first use.
      </P>
      <P>
        Published on HuggingFace at{" "}
        <a
          href="https://huggingface.co/karanxa/saroku-guard"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--primary)", textDecoration: "none" }}
        >
          karanxa/saroku-guard
        </a>
        .
      </P>
      <SubHeading>Usage</SubHeading>
      <CodeBlock
        code={`guard = SafetyGuard()  # saroku-guard is already active
result = guard.check(action="...", context="...")

# Use a different checkpoint, or disable the local PDP entirely:
guard = SafetyGuard(local_model_path="your-org/your-model")
guard = SafetyGuard(use_local_pdp=False, judge_model="gpt-4o-mini")`}
        language="python"
      />
      <SubHeading>Performance</SubHeading>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--surface-2)" }}>
              {["Scenario", "Latency"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "12px", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Clear violation caught by rules engine", "< 1ms"],
              ["Action evaluated by saroku-guard", "~7ms"],
              ["Average across 1000 queries (mixed traffic)", "< 50ms"],
            ].map(([scenario, latency]) => (
              <tr key={scenario} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "10px 14px", color: "var(--text-2)" }}>{scenario}</td>
                <td style={{ padding: "10px 14px", color: "var(--primary)", fontFamily: "var(--font-jetbrains), monospace", fontSize: "13px" }}>{latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SubHeading>Train your own</SubHeading>
      <CodeBlock
        code={`pip install saroku[train]
python -m saroku.training.trainer --output-dir ./my-model --epochs 3`}
        language="bash"
      />
    </div>
  );
}

/* ─── Architecture ────────────────────────────────────────────────────── */

function ArchitectureSection() {
  return (
    <div>
      <SectionHeading id="architecture">Architecture</SectionHeading>

      <P>
        saroku is a Python library with a modular pipeline. Each stage is
        independently testable and replaceable.
      </P>

      <SubHeading>Pipeline stages</SubHeading>

      {[
        {
          stage: "PEP",
          file: "saroku/integrations/_wrap.py",
          description: "Intercepts the agent's proposed tool call at the framework's real execution boundary, before the tool runs. Builds the Decision Request and calls the PDP.",
        },
        {
          stage: "ClassifierRegistry",
          file: "saroku/classifiers/registry.py",
          description: "Resolves which PDP handles the request: saroku-guard by default, or any registered rule-based, HuggingFace, LLM-judge, or ensemble classifier.",
        },
        {
          stage: "ExecutionEngine",
          file: "saroku/execution/engine.py",
          description: "Runs the configured classifier chain for the active guard mode: local, balanced (escalate on flag), or thorough (always escalate).",
        },
        {
          stage: "Policy DSL",
          file: "saroku/policy/dsl.py",
          description: "Declarative YAML policies define which classifiers run at which layer, with confidence thresholds and fallback chains, no code changes to retune coverage.",
        },
        {
          stage: "Verdict",
          file: "saroku/guard.py",
          description: "Returns the binary decision plus, when available, a violation category and severity. The PEP enforces it: allow, or raise SafetyBlockedError.",
        },
      ].map(({ stage, file, description }) => (
        <div
          key={stage}
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px",
            backgroundColor: "var(--surface-2)",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                backgroundColor: "var(--primary-t)",
                color: "var(--primary)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              {stage}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--subtle)",
                marginBottom: "6px",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              {file}
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
              {description}
            </p>
          </div>
        </div>
      ))}

      <SubHeading>Package structure</SubHeading>
      <CodeBlock
        code={`saroku/
├── __init__.py                # Public API: SafetyGuard, wrap, protect, Policy, ...
├── guard.py                   # SafetyGuard, the PEP-facing entry point
├── classifiers/
│   ├── base.py                # Classifier interface
│   ├── registry.py            # ClassifierRegistry
│   ├── rule_classifier.py     # Deterministic rule matching
│   ├── hf_classifier.py       # HuggingFace model classifier (saroku-guard)
│   ├── llm_classifier.py      # LLM-as-judge classifier
│   └── ensemble_classifier.py # Majority / cascade over multiple classifiers
├── policy/
│   ├── dsl.py                 # Policy DSL: properties, layers, thresholds
│   └── policies/default.yml   # Built-in default policy
├── execution/
│   ├── engine.py               # ExecutionEngine: cascade & speculative strategies
│   └── metrics.py              # Per-invocation latency/confidence tracking
├── adapters/
│   ├── factory.py             # resolve_adapter(): model string to adapter
│   ├── openai.py / anthropic.py / compat.py
├── integrations/
│   ├── _wrap.py                # wrap() tool interceptor
│   ├── _detector.py            # Auto-detects agent framework
│   ├── _langchain.py / _autogen.py / _adk.py
└── training/                   # Fine-tune your own local PDP`}
        language="bash"
      />

      <SubHeading>Model adapters</SubHeading>
      <P>
        saroku talks to providers through its own native adapters (no LiteLLM
        dependency): first-class support for OpenAI, Anthropic, and Azure
        OpenAI, with Google, Groq, Mistral, Together, Perplexity, and Ollama
        routed through an OpenAI-compatible adapter. Pass a provider-prefixed
        model string (e.g. <InlineCode>anthropic:claude-3-5-haiku-20241022</InlineCode>)
        or supply a custom <InlineCode>ModelAdapter</InlineCode> for anything else.
      </P>
    </div>
  );
}

/* ─── Roadmap ─────────────────────────────────────────────────────────── */

function RoadmapSection() {
  return (
    <div>
      <SectionHeading id="roadmap">Roadmap</SectionHeading>

      <P>
        saroku is under active development. Here&apos;s what has shipped and what&apos;s next.
      </P>

      <SubHeading>Shipped: pluggable, policy-driven architecture</SubHeading>
      <ul style={{ paddingLeft: "20px", margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>saroku-guard, the reference PDP: a 184M-parameter DeBERTa-v3-based classifier fine-tuned for pre-execution action safety</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Composable classifiers (rules, HuggingFace models, LLM judges, ensembles) via a registry</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Declarative policy DSL with confidence thresholds and fallback chains</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>ExecutionEngine with cascade and speculative strategies, plus built-in observability</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Native model adapters (OpenAI, Anthropic, Azure, and OpenAI-compatible providers), no LiteLLM dependency</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>Framework integration: <InlineCode>wrap()</InlineCode> / <InlineCode>protect()</InlineCode> for Google ADK, AutoGen, and LangChain</li>
        <li style={{ fontSize: "15px", color: "var(--text-2)" }}>ASP, the open specification for the PDP/PEP contract, and ASP-Bench, the benchmark</li>
      </ul>

    </div>
  );
}

