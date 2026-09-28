// Shared types for the "Break Saroku" challenge API.
// Payload shapes match /home/karan/saroku/docs/break-saroku-challenge-proposal.md Section 4.

export interface CheckinRequest {
  instance_id: string;
  timestamp: string;
  os: string;
  judge_provider: string;
  judge_model: string;
  saroku_sdk_version: string;
  challenge_version: string;
}

export interface CheckinRecord extends CheckinRequest {
  nonce: string;
  instanceSecret: string;
  checkinId: string;
  ip: string;
  createdAt: string;
}

export interface PingRequest {
  instance_id: string;
  scenario_id: string;
  property: string;
  timestamp: string;
  claim_token: string;
}

export interface PingRecord extends PingRequest {
  createdAt: string;
}

export interface VerifyTranscript {
  scenario_id: string;
  context: string;
  action: string;
  full_conversation?: unknown[];
}

export interface VerifyRequest {
  instance_id: string;
  claim_token: string;
  transcript: VerifyTranscript;
  display_name?: string;
}

export type VerifyStatus = "verified" | "flagged" | "rejected";

export interface VerifyRecord {
  instanceId: string;
  scenarioId: string;
  property: string | null;
  displayName: string | null;
  status: VerifyStatus;
  reason: string;
  createdAt: string;
}
