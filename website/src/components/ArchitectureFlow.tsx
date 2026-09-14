/**
 * The core saroku PEP/PDP pipeline diagram: Agent Tool Call -> saroku PEP ->
 * saroku PDP -> Decision -> Allowed / Blocked.
 *
 * Single source of truth for this diagram. Originally lived only inline in
 * the homepage's ArchitectureSection; extracted so the technical report
 * blog post can embed the identical, real diagram instead of maintaining a
 * second illustration that could drift out of sync with it.
 */
const STAGES = [
  { label: "Agent Tool Call", sub: "delete_record(\"user_001\")", tint: "var(--surface-3)", text: "var(--text-2)", border: "var(--border)" },
  { label: "saroku PEP", sub: "wrap() / protect()", tint: "var(--primary-t)", text: "var(--primary)", border: "var(--primary-b)" },
  { label: "saroku PDP", sub: "SafetyGuard", tint: "var(--primary-t)", text: "var(--primary)", border: "var(--primary-b)" },
  { label: "Decision", sub: "policy + classifiers", tint: "var(--warning-t)", text: "var(--warning)", border: "var(--warning-b)" },
];

export default function ArchitectureFlow() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: "0" }} className="arch-flow">
        {STAGES.map((s, i) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
            <div
              className="pipeline-stage"
              style={{
                backgroundColor: s.tint,
                border: `1px solid ${s.border}`,
                borderRadius: "12px",
                padding: "16px 20px",
                minWidth: "160px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 700, color: s.text, fontFamily: "var(--font-jetbrains), monospace" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "11px", color: "var(--subtle)", marginTop: "4px", fontFamily: "var(--font-jetbrains), monospace" }}>
                {s.sub}
              </div>
            </div>
            {i < STAGES.length - 1 && (
              <span style={{ color: "var(--subtle)", fontSize: "20px", padding: "0 10px", flexShrink: 0 }} aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", marginBottom: "8px" }}>
        <span style={{ color: "var(--subtle)", fontSize: "20px" }} aria-hidden>↓</span>
      </div>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{
          backgroundColor: "var(--success-t)", border: "1px solid var(--success-b)", borderRadius: "12px",
          padding: "14px 22px", textAlign: "center", minWidth: "180px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--success)" }}>✅ Allowed</div>
          <div style={{ fontSize: "11px", color: "var(--subtle)", marginTop: "3px" }}>PEP executes the real tool call</div>
        </div>
        <div style={{
          backgroundColor: "var(--danger-t)", border: "1px solid var(--danger-b)", borderRadius: "12px",
          padding: "14px 22px", textAlign: "center", minWidth: "180px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--danger)" }}>⛔ Blocked</div>
          <div style={{ fontSize: "11px", color: "var(--subtle)", marginTop: "3px" }}>Raises SafetyBlockedError</div>
        </div>
      </div>
    </div>
  );
}
