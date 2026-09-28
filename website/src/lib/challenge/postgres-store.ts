// Real, persistent implementation of ChallengeStore, backed by the "saroku"
// Supabase Postgres project (project ref grjhnzyjzarmcymijide, ap-northeast-2).
//
// Schema: challenge_checkins, challenge_pings, challenge_verifications,
// challenge_rate_counters (see the migration "create_challenge_tables").
// Column names are snake_case to match Postgres convention; this file is the
// only place that translates between that and the camelCase fields on
// CheckinRecord/PingRecord/VerifyRecord.
//
// Uses the SERVICE ROLE key deliberately — these tables have RLS enabled
// with zero policies, so the anon/publishable key has no access at all by
// design. This client must only ever be constructed on the server (route
// handlers), never sent to a browser.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ChallengeStore } from "./store";
import type { CheckinRecord, PingRecord, VerifyRecord, VerifyStatus } from "./types";

export class PostgresChallengeStore implements ChallengeStore {
  private client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async saveCheckin(record: CheckinRecord): Promise<void> {
    const { error } = await this.client.from("challenge_checkins").upsert({
      instance_id: record.instance_id,
      timestamp: record.timestamp,
      os: record.os,
      judge_provider: record.judge_provider,
      judge_model: record.judge_model,
      saroku_sdk_version: record.saroku_sdk_version,
      challenge_version: record.challenge_version,
      nonce: record.nonce,
      instance_secret: record.instanceSecret,
      checkin_id: record.checkinId,
      ip: record.ip,
      created_at: record.createdAt,
    });
    if (error) throw new Error(`saveCheckin failed: ${error.message}`);
  }

  async getCheckin(instanceId: string): Promise<CheckinRecord | null> {
    const { data, error } = await this.client
      .from("challenge_checkins")
      .select("*")
      .eq("instance_id", instanceId)
      .maybeSingle();
    if (error) throw new Error(`getCheckin failed: ${error.message}`);
    if (!data) return null;
    return {
      instance_id: data.instance_id,
      timestamp: data.timestamp,
      os: data.os,
      judge_provider: data.judge_provider,
      judge_model: data.judge_model,
      saroku_sdk_version: data.saroku_sdk_version,
      challenge_version: data.challenge_version,
      nonce: data.nonce,
      instanceSecret: data.instance_secret,
      checkinId: data.checkin_id,
      ip: data.ip,
      createdAt: data.created_at,
    };
  }

  async savePing(record: PingRecord): Promise<void> {
    const { error } = await this.client.from("challenge_pings").upsert({
      instance_id: record.instance_id,
      scenario_id: record.scenario_id,
      property: record.property,
      timestamp: record.timestamp,
      claim_token: record.claim_token,
      created_at: record.createdAt,
    });
    if (error) throw new Error(`savePing failed: ${error.message}`);
  }

  async getPing(instanceId: string, scenarioId: string): Promise<PingRecord | null> {
    const { data, error } = await this.client
      .from("challenge_pings")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("scenario_id", scenarioId)
      .maybeSingle();
    if (error) throw new Error(`getPing failed: ${error.message}`);
    if (!data) return null;
    return {
      instance_id: data.instance_id,
      scenario_id: data.scenario_id,
      property: data.property,
      timestamp: data.timestamp,
      claim_token: data.claim_token,
      createdAt: data.created_at,
    };
  }

  async saveVerification(record: VerifyRecord): Promise<void> {
    const { error } = await this.client.from("challenge_verifications").insert({
      instance_id: record.instanceId,
      scenario_id: record.scenarioId,
      property: record.property,
      display_name: record.displayName,
      status: record.status,
      reason: record.reason,
      created_at: record.createdAt,
    });
    if (error) throw new Error(`saveVerification failed: ${error.message}`);
  }

  async listVerifiedSuccesses(): Promise<VerifyRecord[]> {
    const { data, error } = await this.client
      .from("challenge_verifications")
      .select("*")
      .eq("status", "verified")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`listVerifiedSuccesses failed: ${error.message}`);
    return (data ?? []).map((row) => ({
      instanceId: row.instance_id,
      scenarioId: row.scenario_id,
      property: row.property,
      displayName: row.display_name,
      status: row.status as VerifyStatus,
      reason: row.reason,
      createdAt: row.created_at,
    }));
  }

  async incrementAndGetCount(key: string, windowMs: number): Promise<number> {
    const bucket = Math.floor(Date.now() / windowMs);
    const bucketKey = `${key}::${bucket}`;
    // Atomic increment via a Postgres function avoids a read-modify-write
    // race between concurrent requests hitting the same bucket — see the
    // increment_rate_counter migration.
    const { data, error } = await this.client.rpc("increment_rate_counter", {
      p_bucket_key: bucketKey,
    });
    if (error) throw new Error(`incrementAndGetCount failed: ${error.message}`);
    return data as number;
  }
}
