"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

const tabs = [
  {
    id: "benchmark",
    label: "Benchmark",
    shortLabel: "Bench",
    content: [
      {
        description: "Install saroku (Python 3.10+):",
        code: `pip install saroku`,
        language: "bash",
      },
      {
        description: "Run the reproducible bench-v1 benchmark or generate dynamic probes:",
        code: `export OPENAI_API_KEY=sk-...

# Run the static bench-v1 benchmark (96 hand-authored probes, reproducible)
saroku run --model gpt-4o-mini --benchmark bench-v1

# Generate dynamic probes — all 8 behavioral properties
saroku run --model gpt-4o-mini

# Run specific properties only
saroku run --model gpt-4o-mini --probes sycophancy,prompt_injection

# Control depth: smoke | standard | deep | exhaustive
saroku run --model gpt-4o-mini --intensity deep

# Compare two models side-by-side on the same benchmark
saroku compare --models gpt-4o-mini,claude-sonnet-4-6

# Run against Anthropic Claude
export ANTHROPIC_API_KEY=sk-ant-...
saroku run --model claude-sonnet-4-6

# Run against Google Gemini via Vertex AI
saroku run --model vertex_ai/gemini-1.5-pro`,
        language: "bash",
      },
    ],
  },
  {
    id: "baseline",
    label: "Save & Compare Baseline",
    shortLabel: "Baselines",
    content: [
      {
        description: "Save a baseline for your current production model:",
        code: `# Run tests and save results as a named baseline
saroku run --model gpt-4o-mini --benchmark bench-v1 --save-baseline prod-v1`,
        language: "bash",
      },
      {
        description: "After a model update, compare against the saved baseline:",
        code: `# Compare new model run against saved baseline
saroku run --model gpt-4o-mini --benchmark bench-v1 --compare-baseline prod-v1

# Example output:
# ┌──────────────────────────────────────────────────────────┐
# │              saroku Behavioral Report                     │
# │  Model: gpt-4o-mini        Baseline: prod-v1             │
# ├──────────────────────────┬────────┬─────────┬────────────┤
# │ Property                 │ Score  │Baseline │  Delta     │
# ├──────────────────────────┼────────┼─────────┼────────────┤
# │ Sycophancy Rate          │ 23.1%  │ 18.4%   │ +4.7% ⚠   │
# │ Honesty Score            │ 61.2%  │ 68.9%   │ -7.7% ✗   │
# │ Consistency Score        │ 79.3%  │ 77.1%   │ +2.2% ✓   │
# │ Injection Resistance     │ 84.1%  │ 87.3%   │ -3.2% ⚠   │
# │ Trust Hierarchy          │ 91.0%  │ 90.5%   │ +0.5% ✓   │
# │ Corrigibility            │ 88.2%  │ 88.2%   │  0.0% ✓   │
# │ Minimal Footprint        │ 76.4%  │ 79.1%   │ -2.7% ⚠   │
# │ Goal Stability           │ 82.0%  │ 83.5%   │ -1.5% ✓   │
# └──────────────────────────┴────────┴─────────┴────────────┘`,
        language: "bash",
      },
      {
        description: "Manage your saved baselines:",
        code: `# List all saved baselines
saroku baseline list

# Save current run as baseline
saroku baseline save prod-v2

# Compare directly against a saved baseline
saroku baseline compare prod-v1`,
        language: "bash",
      },
    ],
  },
  {
    id: "guard",
    label: "Runtime Guard",
    shortLabel: "Guard",
    content: [
      {
        description: "Add one safety check before your agent executes any action:",
        code: `from saroku import SafetyGuard

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
        print(f"[{v.severity.upper()}] {v.description}")
        print(f"  → {v.recommendation}")

# Async support for async agent pipelines
result = await guard.acheck(action="...", context="...")`,
        language: "python",
      },
      {
        description: "Choose the right mode for your deployment:",
        code: `# Fast — rules + ML only, no model required (<5ms)
guard = SafetyGuard(mode="fast")

# Balanced — 3-layer cascade, recommended for production (~65ms with local model)
guard = SafetyGuard(
    mode="balanced",
    local_model_path="./models/saroku-safety-0.5b/model",  # no API key needed
)

# Balanced via Ollama (pull once, runs locally)
# ollama pull karanxa/saroku-safety-0.5b
guard = SafetyGuard(mode="balanced", judge_model="ollama/saroku-safety-0.5b")

# Balanced with API judge (if no local GPU)
guard = SafetyGuard(mode="balanced", judge_model="gpt-4o-mini")

# Thorough — always use the LLM judge
guard = SafetyGuard(mode="thorough", judge_model="gpt-4o-mini")`,
        language: "python",
      },
      {
        description: "Inspect the result object:",
        code: `result.is_safe          # bool
result.violations       # list[SafetyViolation]
result.latency_ms       # float — total check time
result.layers_used      # ["rules"] | ["rules", "ml"] | ["rules", "ml", "local_model"]
result.ml_risk_score    # float 0–1

# Each violation:
v.property        # "trust_hierarchy", "minimal_footprint", etc.
v.severity        # "high", "medium", "low"
v.description     # what the violation is
v.recommendation  # what to do instead
v.source          # "rules", "ml", or "local_model"`,
        language: "python",
      },
    ],
  },
  {
    id: "cicd",
    label: "CI/CD Integration",
    shortLabel: "CI/CD",
    content: [
      {
        description: "Use --fail-on-regression to gate deployments in CI:",
        code: `# Exit code 1 if any property regresses vs. baseline
saroku run --model gpt-4o-mini \\
  --benchmark bench-v1 \\
  --compare-baseline production \\
  --fail-on-regression`,
        language: "bash",
      },
      {
        description: "GitHub Actions workflow example:",
        code: `name: Behavioral Regression Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  saroku:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Run saroku behavioral tests
        run: |
          pip install saroku
          saroku run \\
            --model gpt-4o-mini \\
            --benchmark bench-v1 \\
            --compare-baseline production \\
            --fail-on-regression \\
            --output results.json
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}

      - name: Upload results artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: saroku-results
          path: results.json`,
        language: "yaml",
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
              fontFamily: "var(--font-inter), sans-serif",
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
