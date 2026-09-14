import type { ReactNode } from "react";
import {
  H2,
  H3,
  P,
  Table,
  Th,
  Td,
  Code,
  InlineCode,
  Badge,
  KW,
  Callout,
} from "@/components/blog/PostProse";
import PostToc, { type TocItem } from "@/components/blog/PostToc";

/**
 * Action Safety Protocol v0.1.0, the normative specification, published as a
 * post so it has a stable public URL at saroku.com/blog/action-safety-protocol.
 *
 * Section numbering is load-bearing: the document cross-references its own
 * sections (§5.2, §6, §9). Do not renumber sections when editing.
 */

const TOC: TocItem[] = [
  { id: "overview", label: "1. Overview" },
  { id: "terminology", label: "2. Terminology" },
  { id: "versioning", label: "3. Versioning" },
  { id: "decision-request", label: "4. Decision Request" },
  { id: "request-fields", label: "4.1 Fields", sub: true },
  { id: "tiering", label: "4.2 Tiering", sub: true },
  { id: "decision-response", label: "5. Decision Response" },
  { id: "response-fields", label: "5.1 Fields", sub: true },
  { id: "violation-categories", label: "5.2 Violation categories", sub: true },
  { id: "conformance", label: "6. Conformance Levels" },
  { id: "non-goals", label: "7. Non-Goals" },
  { id: "relationship-to-mcp", label: "8. Relationship to MCP" },
  { id: "extensibility", label: "9. Extensibility" },
  { id: "reference-impl", label: "10. Reference Implementation" },
  { id: "references", label: "11. References" },
  { id: "changelog", label: "12. Changelog" },
];

/* ── Spec-only local primitives ─────────────────────────────────────────── */

/** The "§n" marker printed under each section heading. */
function SecId({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "12px",
        color: "var(--subtle)",
        margin: "-8px 0 18px",
      }}
    >
      {children}
    </p>
  );
}

/**
 * In-page cross-reference to another section, e.g. §9. Styled in .sec-ref to
 * inherit body color with a faint dotted underline; a spec's prose is dense
 * with these, and rendering them all in link color makes the page noisy.
 */
function SecRef({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={`#${to}`} className="sec-ref">
      {children}
    </a>
  );
}

/** Superscript reference marker, e.g. [1]. */
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

function NonGoal({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "baseline", marginBottom: "12px" }}>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: "var(--danger)",
          flexShrink: 0,
        }}
      >
        ✕
      </span>
      <p style={{ margin: 0, fontSize: "15.5px", lineHeight: 1.7, color: "var(--text-2)" }}>
        {children}
      </p>
    </div>
  );
}

const REQUEST_EXAMPLE = `{
  "asp_version": "0.1.0",
  "action": "delete_record(id='user_001')",
  "context": "Database administration agent. Environment: production.",
  "trigger": "user_request",
  "constraints": ["Never delete production records without confirmation"],
  "original_goal": "Clean up inactive test accounts",
  "user_message": "Remove user_001, they asked to be deleted",
  "conversation": null
}`;

const RESPONSE_EXAMPLE = `{
  "asp_version": "0.1.0",
  "is_safe": false,
  "violation": "policy_violation",
  "severity": "high",
  "confidence": 0.94,
  "reason": "Deletes a production record without the required confirmation constraint."
}`;

export default function ActionSafetyProtocol() {
  return (
    <>
      <PostToc items={TOC} />

      {/* Masthead: protocol identity and status */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 20px",
          alignItems: "center",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "12.5px",
          color: "var(--muted)",
          paddingBottom: "24px",
          marginBottom: "40px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
          <span style={{ color: "var(--text-2)" }}>Status</span>
          <Badge kind="neutral">Published</Badge>
        </span>
        <span>
          <span style={{ color: "var(--text-2)" }}>Reference implementation</span> saroku
        </span>
        <span>
          <span style={{ color: "var(--text-2)" }}>Editor</span> Karan Arora
        </span>
      </div>

      {/* ── 1. Overview ── */}
      <H2 id="overview">1. Overview</H2>
      <SecId>§1</SecId>
      <P>
        PDP and PEP are established roles from access-control architecture, formalized in
        OASIS&apos;s XACML standard <Cite n={1} /> and, before that, in IETF&apos;s AAA
        authorization framework <Cite n={2} />: a <strong>Policy Decision Point</strong> evaluates
        whether an action should be permitted, and a <strong>Policy Enforcement Point</strong>{" "}
        intercepts the action and carries out that decision. ASP does not introduce these roles; it
        applies them to a domain neither standard addressed, and defines a concrete request/response
        contract between a PDP and PEP judging <em>agent tool calls</em> specifically. It specifies
        the shape of the decision, not how the decision is computed, how the two parties transport
        it, or what happens after a decision is enforced.
      </P>
      <P>
        The nearer precedent is Open Policy Agent, which took the same PDP/PEP separation and
        standardized it for infrastructure authorization: any PDP speaking OPA&apos;s interface can
        be swapped for another without the enforcing system changing at all. ASP aims at the same
        property for agent action safety specifically: a PDP built by one party should be swappable
        for a PDP built by another without the PEP, or the agent framework it&apos;s embedded in,
        needing to change.
      </P>
      <P>
        This protocol addresses a layer <strong>adjacent to, and independent of</strong>, the Model
        Context Protocol. MCP standardizes how an agent invokes a tool. ASP standardizes how a
        decision gets made about whether that invocation should be allowed. Neither depends on the
        other; a system may use both, either, or neither.
      </P>

      {/* ── 2. Terminology ── */}
      <H2 id="terminology">2. Terminology</H2>
      <SecId>§2</SecId>
      <P>
        The key words <KW>MUST</KW>, <KW>MUST NOT</KW>, <KW>SHOULD</KW>, and <KW>MAY</KW> in this
        document are to be interpreted as described in RFC 2119.
      </P>
      <Table minWidth={460}>
        <tbody>
          <tr>
            <Td strong>PDP</Td>
            <Td>
              Policy Decision Point (established terminology, <SecRef to="overview">§1</SecRef>, <Cite n={1} />). In this document:
              the component that evaluates a Decision Request and produces a Decision Response. May
              be a classifier, an LLM judge, a rule engine, or an ensemble.
            </Td>
          </tr>
          <tr>
            <Td strong>PEP</Td>
            <Td>
              Policy Enforcement Point (established terminology, <SecRef to="overview">§1</SecRef>, <Cite n={1} />). In this
              document: the component that intercepts an agent&apos;s proposed action, sends a
              Decision Request to a PDP, and enforces the resulting Decision Response: allowing,
              blocking, or escalating the action.
            </Td>
          </tr>
          <tr>
            <Td strong>Subject Action</Td>
            <Td>
              The single proposed tool call under evaluation. ASP evaluates exactly one Subject
              Action per Decision Request.
            </Td>
          </tr>
          <tr>
            <Td strong>Implementation</Td>
            <Td>
              Any software that produces or consumes conformant Decision Requests and Responses.
              saroku is one implementation, not a privileged one.
            </Td>
          </tr>
        </tbody>
      </Table>

      {/* ── 3. Versioning ── */}
      <H2 id="versioning">3. Versioning</H2>
      <SecId>§3</SecId>
      <P>
        ASP is versioned independently of any implementation&apos;s own release cycle. A Decision
        Request <KW>MUST</KW> declare the protocol version it conforms to via a top-level{" "}
        <InlineCode>asp_version</InlineCode> field. Implementations <KW>SHOULD</KW> reject requests
        declaring a major version they do not support rather than guessing at compatibility.
      </P>
      <P>
        This document specifies version <InlineCode>0.1.0</InlineCode>. Versioning follows semver: a
        breaking change to a required field&apos;s shape or semantics is a major bump; an added
        optional field is a minor bump.
      </P>

      {/* ── 4. Decision Request ── */}
      <H2 id="decision-request">4. Decision Request</H2>
      <SecId>§4</SecId>
      <P>
        A Decision Request describes one Subject Action and the context available about it at the
        moment it was proposed, before execution.
      </P>
      <Code code={REQUEST_EXAMPLE} language="json" />

      <H3 id="request-fields">4.1 Fields</H3>
      <Table minWidth={580}>
        <thead>
          <tr>
            <Th>Field</Th>
            <Th> </Th>
            <Th>Type</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td strong>asp_version</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>string</Td>
            <Td>Protocol version this request conforms to.</Td>
          </tr>
          <tr>
            <Td strong>action</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>string</Td>
            <Td>
              The proposed action, verbatim: a tool name and its arguments, or an equivalent
              representation.
            </Td>
          </tr>
          <tr>
            <Td strong>context</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>string</Td>
            <Td>The agent&apos;s role and operating environment.</Td>
          </tr>
          <tr>
            <Td strong>trigger</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>enum</Td>
            <Td>
              What prompted this action. One of <InlineCode>user_request</InlineCode>,{" "}
              <InlineCode>tool_result</InlineCode>, <InlineCode>user_override</InlineCode>,{" "}
              <InlineCode>correction</InlineCode>.
            </Td>
          </tr>
          <tr>
            <Td strong>constraints</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>string[]</Td>
            <Td>Operator-set rules the action must respect.</Td>
          </tr>
          <tr>
            <Td strong>original_goal</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>string</Td>
            <Td>The task the agent was actually given.</Td>
          </tr>
          <tr>
            <Td strong>user_message</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>string</Td>
            <Td>The literal end-user request, if the trigger stems from one.</Td>
          </tr>
          <tr>
            <Td strong>conversation</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>array</Td>
            <Td>
              Preceding dialogue turns as <InlineCode>{"{role, content}"}</InlineCode> objects,
              oldest first.
            </Td>
          </tr>
        </tbody>
      </Table>

      <H3 id="tiering">4.2 Tiering</H3>
      <P>
        A conformant PDP <KW>MUST</KW> accept a request containing only the required fields and{" "}
        <KW>MUST NOT</KW> require any optional field to be present. Optional fields represent
        progressively richer context, not a fixed contract shape. A PEP embedded where no operator
        constraints exist, for instance, simply omits <InlineCode>constraints</InlineCode> rather
        than sending an empty array. A PDP <KW>SHOULD</KW> use whatever subset of optional fields is
        present rather than only ever using the required minimum, since accuracy on this task is
        context-dependent.
      </P>

      {/* ── 5. Decision Response ── */}
      <H2 id="decision-response">5. Decision Response</H2>
      <SecId>§5</SecId>
      <P>
        A Decision Response is the PDP&apos;s judgment on the Subject Action described by the
        corresponding request.
      </P>
      <Code code={RESPONSE_EXAMPLE} language="json" />

      <H3 id="response-fields">5.1 Fields</H3>
      <Table minWidth={580}>
        <thead>
          <tr>
            <Th>Field</Th>
            <Th> </Th>
            <Th>Type</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td strong>asp_version</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>string</Td>
            <Td>Protocol version this response conforms to.</Td>
          </tr>
          <tr>
            <Td strong>is_safe</Td>
            <Td>
              <Badge kind="required" />
            </Td>
            <Td>boolean</Td>
            <Td>
              The decision. <KW>MUST</KW> be the only field a PEP is required to read to enforce a
              block.
            </Td>
          </tr>
          <tr>
            <Td strong>violation</Td>
            <Td>
              <Badge kind="conditional" />
            </Td>
            <Td>enum | null</Td>
            <Td>
              <KW>MUST</KW> be null when <InlineCode>is_safe</InlineCode> is true. <KW>MAY</KW> be
              null when <InlineCode>is_safe</InlineCode> is false, for PDPs without attribution
              capability; see <SecRef to="conformance">§6</SecRef>.
              See <SecRef to="violation-categories">§5.2</SecRef> for
              the enum.
            </Td>
          </tr>
          <tr>
            <Td strong>severity</Td>
            <Td>
              <Badge kind="conditional" />
            </Td>
            <Td>enum | null</Td>
            <Td>
              One of <InlineCode>high</InlineCode>, <InlineCode>medium</InlineCode>,{" "}
              <InlineCode>low</InlineCode>. Same nullability rule as{" "}
              <InlineCode>violation</InlineCode>.
            </Td>
          </tr>
          <tr>
            <Td strong>confidence</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>float [0,1]</Td>
            <Td>
              The PDP&apos;s confidence in <InlineCode>is_safe</InlineCode>. A PEP{" "}
              <KW>SHOULD NOT</KW> treat a missing confidence as 1.0 by default.
            </Td>
          </tr>
          <tr>
            <Td strong>reason</Td>
            <Td>
              <Badge kind="optional" />
            </Td>
            <Td>string</Td>
            <Td>Human-readable justification, for logging and audit trails.</Td>
          </tr>
        </tbody>
      </Table>
      <P>
        A response <KW>MUST NOT</KW> set <InlineCode>violation</InlineCode> or{" "}
        <InlineCode>severity</InlineCode> when <InlineCode>is_safe</InlineCode> is{" "}
        <InlineCode>true</InlineCode>. A safe verdict has no violation to attribute; a PDP returning
        one is malformed under this protocol, not merely unhelpful.
      </P>

      <H3 id="violation-categories">5.2 Violation categories</H3>
      <P>
        The reference implementation&apos;s five categories are RECOMMENDED but not the only valid
        vocabulary; see <SecRef to="extensibility">§9</SecRef> on
        extensibility.
      </P>
      <Table minWidth={460}>
        <tbody>
          <tr>
            <Td strong>policy_violation</Td>
            <Td>Constraint override, or a required approval was not obtained.</Td>
          </tr>
          <tr>
            <Td strong>scope_violation</Td>
            <Td>The action exceeds the minimal scope the task requires.</Td>
          </tr>
          <tr>
            <Td strong>injection</Td>
            <Td>An untrusted tool result or message steered the action.</Td>
          </tr>
          <tr>
            <Td strong>goal_drift</Td>
            <Td>The action diverges from the stated original goal.</Td>
          </tr>
          <tr>
            <Td strong>corrigibility</Td>
            <Td>The action ignores an explicit stop or correction.</Td>
          </tr>
        </tbody>
      </Table>

      {/* ── 6. Conformance Levels ── */}
      <H2 id="conformance">6. Conformance Levels</H2>
      <SecId>§6</SecId>
      <P>
        Not every PDP can attribute a violation category; requiring attribution for conformance
        would exclude every binary-only classifier, including some of the strongest ones available.
        ASP defines two levels so a binary decision alone is a complete, conformant implementation.
      </P>
      <Callout label="Level 1: Core">
        <P>
          Implements the Decision Request and Response with <InlineCode>is_safe</InlineCode> as the
          only populated decision field. <InlineCode>violation</InlineCode> and{" "}
          <InlineCode>severity</InlineCode> are always null. This is sufficient for a PEP that only
          needs to allow or block.
        </P>
      </Callout>
      <Callout label="Level 2: Attribution">
        <P>
          Additionally populates <InlineCode>violation</InlineCode> and{" "}
          <InlineCode>severity</InlineCode> on unsafe decisions, from either the recommended
          vocabulary (<SecRef to="violation-categories">§5.2</SecRef>)
          or a documented extension vocabulary (<SecRef to="extensibility">§9</SecRef>).
        </P>
      </Callout>
      <P>
        An implementation <KW>MUST</KW> declare which level it claims. A PEP <KW>MUST NOT</KW>{" "}
        assume Level 2 fields are populated without checking for null.
      </P>

      {/* ── 7. Non-Goals ── */}
      <H2 id="non-goals">7. Non-Goals</H2>
      <SecId>§7</SecId>
      <P>
        A protocol that tries to standardize everything standardizes nothing well. ASP deliberately
        does not specify:
      </P>
      <NonGoal>
        <strong>Transport.</strong> How a Decision Request physically reaches a PDP (in-process
        function call, HTTP, gRPC, a message queue) is an implementation and deployment concern.
      </NonGoal>
      <NonGoal>
        <strong>PDP internals.</strong> Whether the decision comes from a fine-tuned classifier, an
        LLM prompt, a hand-written rule, or a vote across several of those.
      </NonGoal>
      <NonGoal>
        <strong>Enforcement mechanics.</strong> What a PEP does with an unsafe verdict (raise,
        log-and-continue, queue for human review) is a policy decision the deploying system makes,
        not this protocol.
      </NonGoal>
      <NonGoal>
        <strong>Authentication and transport security.</strong> Left to whatever transport is
        chosen.
      </NonGoal>
      <NonGoal>
        <strong>Retry, timeout, and fallback behavior</strong> when a PDP is unreachable or slow.
      </NonGoal>

      {/* ── 8. Relationship to MCP ── */}
      <H2 id="relationship-to-mcp">8. Relationship to MCP</H2>
      <SecId>§8</SecId>
      <P>
        ASP and MCP compose rather than compete. A representative deployment: an MCP client resolves
        a tool call against an MCP server; before that call executes, a PEP constructs an ASP
        Decision Request from the resolved call and its context, sends it to a PDP, and enforces the
        response. MCP is silent on this step by design: the specification does not include an
        authorization or safety layer, and that is the gap this protocol is scoped to fill, not a
        limitation of MCP being corrected.
      </P>

      {/* ── 9. Extensibility ── */}
      <H2 id="extensibility">9. Extensibility</H2>
      <SecId>§9</SecId>
      <P>
        An implementation <KW>MAY</KW> use a violation vocabulary other than{" "}
        <SecRef to="violation-categories">§5.2</SecRef>&apos;s,
        provided it is declared in an <InlineCode>violation_vocabulary</InlineCode> field alongside
        the response and documented publicly at a stable URL. A PEP encountering an undeclared or
        unrecognized vocabulary <KW>MUST</KW> fail closed: treat the decision as unsafe with
        unknown attribution, rather than guess at a mapping.
      </P>
      <P>
        Future minor versions may add optional request or response fields. A PDP conforming to a
        later minor version <KW>MUST</KW> remain able to correctly process a request from an earlier
        minor version within the same major version.
      </P>

      {/* ── 10. Reference Implementation ── */}
      <H2 id="reference-impl">10. Reference Implementation</H2>
      <SecId>§10</SecId>
      <P>
        <a href="https://saroku.com" style={{ color: "var(--primary-l)" }}>
          saroku
        </a>{" "}
        implements both sides of this protocol: <InlineCode>SafetyGuard</InlineCode> as a PDP (via{" "}
        <InlineCode>saroku-guard</InlineCode>, Level 2 conformant, and an LLM-judge path), and{" "}
        <InlineCode>wrap()</InlineCode>/<InlineCode>protect()</InlineCode> as a PEP for Google ADK,
        AutoGen, and LangChain. It exists to prove the protocol is implementable end to end, and is
        deliberately not privileged by it: every requirement in this document is one a second
        implementation can meet without reference to saroku&apos;s source. Independent PDP and PEP
        implementations are what this specification is for.
      </P>

      {/* ── 11. References ── */}
      <H2 id="references">11. References</H2>
      <SecId>§11</SecId>
      <ol style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <li style={{ fontSize: "15.5px", lineHeight: 1.7, color: "var(--text-2)" }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: "var(--primary-l)",
              fontWeight: 600,
              marginRight: "6px",
            }}
          >
            [1]
          </span>
          OASIS. <em>eXtensible Access Control Markup Language (XACML) Version 3.0.</em> Defines the
          Policy Decision Point / Policy Enforcement Point separation this spec&apos;s terminology
          (<SecRef to="terminology">§2</SecRef>) is drawn from.
        </li>
        <li style={{ fontSize: "15.5px", lineHeight: 1.7, color: "var(--text-2)" }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: "var(--primary-l)",
              fontWeight: 600,
              marginRight: "6px",
            }}
          >
            [2]
          </span>
          IETF RFC 2904. <em>AAA Authorization Framework.</em> An earlier formalization of the same
          PDP/PEP split, for network access control.
        </li>
      </ol>

      {/* ── 12. Changelog ── */}
      <H2 id="changelog">12. Changelog</H2>
      <SecId>§12</SecId>
      <dl style={{ margin: 0, fontFamily: "var(--font-jetbrains), monospace", fontSize: "13.5px" }}>
        <dt style={{ color: "var(--primary-l)", fontWeight: 600 }}>0.1.0</dt>
        <dd style={{ color: "var(--text-2)", margin: "6px 0 0" }}>
          Initial specification. Reference implementation: saroku.
        </dd>
      </dl>

      <div style={{ borderTop: "1px solid var(--border)", marginTop: "56px", paddingTop: "24px" }}>
        <P>
          Feedback, implementation reports, and proposed extension vocabularies are welcome at{" "}
          <a href="https://saroku.com" style={{ color: "var(--primary-l)" }}>
            saroku.com
          </a>
          .
        </P>
      </div>
    </>
  );
}
