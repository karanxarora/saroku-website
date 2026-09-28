import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock the Python-bridge replay call — these are route-logic tests, not an
// integration test of the actual saroku SDK subprocess (that's exercised
// manually/separately since it needs a real Python venv + LLM API key).
vi.mock("../replay", () => ({
  replayAction: vi.fn(),
}));

import { replayAction } from "../replay";
import { challengeStore } from "../store";
import { computeClaimToken } from "../hmac";

// Import route handlers after the mock is registered.
import { POST as checkinPOST } from "@/app/api/challenge/checkin/route";
import { POST as pingPOST } from "@/app/api/challenge/ping/route";
import { POST as verifyPOST } from "@/app/api/challenge/verify/route";

function jsonRequest(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("challenge routes", () => {
  beforeEach(() => {
    challengeStore.__resetForTests?.();
    vi.mocked(replayAction).mockReset();
  });

  it("checkin: accepts a valid request and returns nonce + instance_secret + checkin_id", async () => {
    const res = await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-1",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.nonce).toBe("string");
    expect(typeof data.instance_secret).toBe("string");
    expect(typeof data.checkin_id).toBe("string");
  });

  it("checkin: rejects a request missing required fields", async () => {
    const res = await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", { instance_id: "inst-1" })
    );
    expect(res.status).toBe(400);
  });

  it("checkin: enforces the 5/IP/hour rate limit", async () => {
    const makeReq = () =>
      jsonRequest(
        "http://localhost/api/challenge/checkin",
        {
          instance_id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          os: "linux",
          judge_provider: "openai",
          judge_model: "gpt-4o-mini",
          saroku_sdk_version: "0.5.1",
          challenge_version: "v1",
        },
        { "x-forwarded-for": "1.2.3.4" }
      );

    const results = [];
    for (let i = 0; i < 6; i++) {
      results.push(await checkinPOST(makeReq()));
    }
    const statuses = results.map((r) => r.status);
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });

  it("ping: rejects an instance_id with no prior check-in", async () => {
    const res = await pingPOST(
      jsonRequest("http://localhost/api/challenge/ping", {
        instance_id: "never-checked-in",
        scenario_id: "syco-01",
        property: "sycophancy",
        timestamp: new Date().toISOString(),
        claim_token: "deadbeef",
      })
    );
    expect(res.status).toBe(404);
  });

  it("ping: accepts a ping for a known instance", async () => {
    await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-2",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    const res = await pingPOST(
      jsonRequest("http://localhost/api/challenge/ping", {
        instance_id: "inst-2",
        scenario_id: "syco-01",
        property: "sycophancy",
        timestamp: new Date().toISOString(),
        claim_token: "deadbeef",
      })
    );
    expect(res.status).toBe(200);
  });

  it("verify: flags (not silently rejects) a submission with no matching prior ping", async () => {
    await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-3",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    const res = await verifyPOST(
      jsonRequest("http://localhost/api/challenge/verify", {
        instance_id: "inst-3",
        claim_token: "whatever",
        transcript: { scenario_id: "syco-01", context: "ctx", action: "delete_record(\"x\")" },
      })
    );
    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.status).toBe("flagged");
    expect(data.reason).toBe("no_matching_ping");
  });

  it("verify: rejects when the claim token doesn't match server-side HMAC recomputation", async () => {
    const checkinRes = await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-4",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    await checkinRes.json();

    await pingPOST(
      jsonRequest("http://localhost/api/challenge/ping", {
        instance_id: "inst-4",
        scenario_id: "syco-01",
        property: "sycophancy",
        timestamp: new Date().toISOString(),
        claim_token: "a-token-that-was-never-computed-correctly",
      })
    );

    const res = await verifyPOST(
      jsonRequest("http://localhost/api/challenge/verify", {
        instance_id: "inst-4",
        claim_token: "a-token-that-was-never-computed-correctly",
        transcript: { scenario_id: "syco-01", context: "ctx", action: "delete_record(\"x\")" },
      })
    );
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.status).toBe("rejected");
    expect(data.reason).toBe("claim_token_invalid");
  });

  it("verify: full happy path grants verified status when the token is valid and replay confirms the break", async () => {
    const checkinRes = await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-5",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    const { nonce } = await checkinRes.json();
    const checkin = await challengeStore.getCheckin("inst-5");
    const instanceSecret = checkin!.instanceSecret;

    const action = 'delete_record("user_001")';
    const scenarioId = "syco-01";
    const claimToken = computeClaimToken({ scenarioId, action, nonce, instanceSecret });

    await pingPOST(
      jsonRequest("http://localhost/api/challenge/ping", {
        instance_id: "inst-5",
        scenario_id: scenarioId,
        property: "sycophancy",
        timestamp: new Date().toISOString(),
        claim_token: claimToken,
      })
    );

    vi.mocked(replayAction).mockResolvedValue({
      ok: true,
      isSafe: true,
      violations: [],
      error: null,
    });

    const res = await verifyPOST(
      jsonRequest("http://localhost/api/challenge/verify", {
        instance_id: "inst-5",
        claim_token: claimToken,
        transcript: { scenario_id: scenarioId, context: "flattery pressure", action },
        display_name: "tester",
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("verified");
    expect(data.property).toBe("sycophancy");
  });

  it("verify: rejects when replay does NOT reproduce the claimed break (guard correctly said unsafe)", async () => {
    const checkinRes = await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-6",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );
    const { nonce } = await checkinRes.json();
    const checkin = await challengeStore.getCheckin("inst-6");
    const instanceSecret = checkin!.instanceSecret;

    const action = 'delete_record("user_001")';
    const scenarioId = "syco-01";
    const claimToken = computeClaimToken({ scenarioId, action, nonce, instanceSecret });

    await pingPOST(
      jsonRequest("http://localhost/api/challenge/ping", {
        instance_id: "inst-6",
        scenario_id: scenarioId,
        property: "sycophancy",
        timestamp: new Date().toISOString(),
        claim_token: claimToken,
      })
    );

    vi.mocked(replayAction).mockResolvedValue({
      ok: true,
      isSafe: false,
      violations: [{ property: "sycophancy", severity: "high" }],
      error: null,
    });

    const res = await verifyPOST(
      jsonRequest("http://localhost/api/challenge/verify", {
        instance_id: "inst-6",
        claim_token: claimToken,
        transcript: { scenario_id: scenarioId, context: "flattery pressure", action },
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("rejected");
    expect(data.reason).toBe("replay_did_not_reproduce_break");
  });
});
