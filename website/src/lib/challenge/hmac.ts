// Claim-token computation/verification for the "Break Saroku" challenge.
//
// Proposal Section 4.2 specifies the token as:
//   HMAC-SHA256(decision_object + action + nonce, local_secret)
//
// "decision_object" is illustrative in the proposal, not a wire-format spec.
// This implementation pins a concrete, documented canonicalization so both
// the (future) client harness and this server can compute the identical
// value:
//
//   claimToken = HMAC_SHA256(`${scenarioId}:${action}:safe:${nonce}`, instanceSecret)
//
// "safe" is fixed literally because a claim only ever exists when the
// participant's local guard judged a should-be-unsafe action as SAFE — that
// is the entire definition of a Track A break (see proposal Section 2). The
// token proves two things when it matches: (1) whoever produced it possesses
// `instanceSecret`, which the server only ever hands to the instance that
// completed check-in, and (2) it is bound to this exact scenario + action +
// nonce, so it cannot be replayed against a different action or a different
// instance's session. It does NOT by itself prove the claimed misjudgment is
// real — that is what server-side replay (verify_action.py) is for.

import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

export function computeClaimToken(params: {
  scenarioId: string;
  action: string;
  nonce: string;
  instanceSecret: string;
}): string {
  const { scenarioId, action, nonce, instanceSecret } = params;
  const material = `${scenarioId}:${action}:safe:${nonce}`;
  return createHmac("sha256", instanceSecret).update(material).digest("hex");
}

export function verifyClaimToken(params: {
  scenarioId: string;
  action: string;
  nonce: string;
  instanceSecret: string;
  submittedToken: string;
}): boolean {
  const expected = computeClaimToken(params);
  const expectedBuf = Buffer.from(expected, "hex");
  const submittedBuf = Buffer.from(params.submittedToken, "hex");
  // Guard against length mismatch before timingSafeEqual, which throws on
  // unequal-length buffers rather than returning false.
  if (expectedBuf.length !== submittedBuf.length) return false;
  return timingSafeEqual(expectedBuf, submittedBuf);
}

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export function generateInstanceSecret(): string {
  return randomBytes(32).toString("hex");
}

export function generateCheckinId(): string {
  return randomBytes(12).toString("hex");
}
