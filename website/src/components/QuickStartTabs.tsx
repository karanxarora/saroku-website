"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

const tabs = [
  {
    id: "check",
    label: "Check an Action",
    shortLabel: "Check",
    content: [
      {
        description: "Install saroku (Python 3.10+). No API key needed for the default local guard:",
        code: `pip install saroku`,
        language: "bash",
      },
      {
        description: "Check one proposed action before it executes:",
        code: `from saroku import SafetyGuard

guard = SafetyGuard()  # saroku-guard loads automatically, no setup

result = guard.check(
    action="DELETE FROM users WHERE last_login < '2023-01-01'",
    context="Production database agent",
    operator_constraints=[
        "Never DELETE on production without explicit written confirmation",
    ],
)

if not result.is_safe:
    for v in result.violations:
        print(f"[{v.severity.upper()}] {v.description}")

# Async support for async agent pipelines
result = await guard.acheck(action="...", context="...")`,
        language: "python",
      },
      {
        description: "Inspect the result object:",
        code: `result.is_safe          # bool
result.violations       # list[SafetyViolation]
result.latency_ms       # float, total check time

# Each violation:
v.property        # "policy_violation" | "scope_violation" | "injection"
                   # | "goal_drift" | "corrigibility"
v.severity         # "high", "medium", "low"
v.description       # what the violation is`,
        language: "python",
      },
    ],
  },
  {
    id: "protect",
    label: "Protect an Agent",
    shortLabel: "Protect",
    content: [
      {
        description: "Wrap a single tool, or protect every tool an agent has at once:",
        code: `from saroku import SafetyGuard
from saroku.integrations import wrap, protect

guard = SafetyGuard()

# Protect a single tool
safe_search = wrap(agent.search_tool, guard=guard)

# Protect all tools in an agent (auto-detects framework)
safe_agent = await protect(agent, guard=guard)

# Handle blocked actions
from saroku import SafetyBlockedError
try:
    result = await safe_agent.run(task)
except SafetyBlockedError as e:
    print(f"Action blocked: {e.violations}")`,
        language: "python",
      },
      {
        description: "Supported frameworks: Google ADK, AutoGen, and LangChain, auto-detected. No framework installed? wrap() works on any callable, sync or async.",
        code: `# Google ADK, AutoGen, LangChain all use the same call:
safe_agent = await protect(agent, guard=guard)

# Or wrap one tool at a time, framework-agnostic:
safe_tool = wrap(my_tool_function, guard=guard)`,
        language: "python",
      },
    ],
  },
  {
    id: "modes",
    label: "Guard Modes",
    shortLabel: "Modes",
    content: [
      {
        description: "saroku-guard, the local PDP, protects every call by default. Three modes control how it works with an LLM judge:",
        code: `# balanced, default. saroku-guard clears safe actions in ~7ms
# locally; anything flagged escalates to the LLM judge.
guard = SafetyGuard()

# local, saroku-guard only, zero API calls, works fully offline.
guard = SafetyGuard(mode="local")

# thorough, always uses the LLM judge for deeper analysis.
guard = SafetyGuard(mode="thorough", judge_model="gpt-4o-mini")`,
        language: "python",
      },
    ],
  },
  {
    id: "asp",
    label: "The Protocol",
    shortLabel: "ASP",
    content: [
      {
        description: "saroku is the reference PEP for the Action Safety Protocol; saroku-guard is the reference PDP. Swap either side without changing the agent:",
        code: `# Use a different PDP, any classifier that speaks ASP
guard = SafetyGuard(local_model_path="your-org/your-model")

# Or skip the local model entirely and use only an LLM judge
guard = SafetyGuard(use_local_pdp=False, judge_model="gpt-4o-mini")`,
        language: "python",
      },
    ],
  },
];

export default function QuickStartTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Tab bar */}
      <div
        className="qs-tab-bar"
        style={{
          display: "flex",
          gap: "4px",
          backgroundColor: "var(--surface-3)",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="qs-tab-btn"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "7px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.15s",
              backgroundColor: activeTab === tab.id ? "var(--surface)" : "transparent",
              color: activeTab === tab.id ? "var(--text)" : "var(--muted)",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              fontFamily: "var(--font-work-sans), sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="qs-label-long">{tab.label}</span>
            <span className="qs-label-short">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content — key triggers re-mount + CSS fade animation */}
      <div key={activeTab} className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {active.content.map((block, i) => (
          <div key={i}>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "10px", marginTop: 0 }}>
              {block.description}
            </p>
            <CodeBlock code={block.code} language={block.language} />
          </div>
        ))}
      </div>

      <style>{`
        .qs-label-short { display: none; }
        @media (max-width: 580px) {
          .qs-label-long  { display: none; }
          .qs-label-short { display: inline; }
          .qs-tab-btn     { font-size: 12px; padding: 7px 5px; }
        }
      `}</style>
    </div>
  );
}
