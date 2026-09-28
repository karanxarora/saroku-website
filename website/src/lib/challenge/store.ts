// Data-access abstraction for the "Break Saroku" challenge.
//
// Two implementations:
//   - MemoryChallengeStore   — in-process, non-persistent. Used automatically
//     whenever SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY aren't set (e.g. in
//     tests/CI), so the full test suite never depends on network access or
//     real credentials.
//   - PostgresChallengeStore — real persistence via the "saroku" Supabase
//     project (see postgres-store.ts). Selected automatically whenever both
//     env vars ARE set. This is what production actually uses.
//
// The original design reasoning for keeping this behind one interface
// still holds: swapping backends is a matter of implementing ChallengeStore,
// never touching a route handler.

import type { CheckinRecord, PingRecord, VerifyRecord } from "./types";

export interface ChallengeStore {
  saveCheckin(record: CheckinRecord): Promise<void>;
  getCheckin(instanceId: string): Promise<CheckinRecord | null>;

  savePing(record: PingRecord): Promise<void>;
  getPing(instanceId: string, scenarioId: string): Promise<PingRecord | null>;

  saveVerification(record: VerifyRecord): Promise<void>;

  // Leaderboard read path: only records with status "verified" (i.e. server-
  // side replay actually reproduced the claimed break) count. "flagged" and
  // "rejected" records exist for audit/anti-abuse purposes and must never
  // surface here.
  listVerifiedSuccesses(): Promise<VerifyRecord[]>;

  // Simple sliding-window counters for rate limiting. `windowMs` identifies
  // the current window; the store buckets by `${key}:${bucket}`.
  incrementAndGetCount(key: string, windowMs: number): Promise<number>;
}

class MemoryChallengeStore implements ChallengeStore {
  private checkins = new Map<string, CheckinRecord>();
  // key: `${instanceId}::${scenarioId}`
  private pings = new Map<string, PingRecord>();
  private verifications: VerifyRecord[] = [];
  private counters = new Map<string, number>();

  async saveCheckin(record: CheckinRecord): Promise<void> {
    this.checkins.set(record.instance_id, record);
  }

  async getCheckin(instanceId: string): Promise<CheckinRecord | null> {
    return this.checkins.get(instanceId) ?? null;
  }

  async savePing(record: PingRecord): Promise<void> {
    this.pings.set(`${record.instance_id}::${record.scenario_id}`, record);
  }

  async getPing(instanceId: string, scenarioId: string): Promise<PingRecord | null> {
    return this.pings.get(`${instanceId}::${scenarioId}`) ?? null;
  }

  async saveVerification(record: VerifyRecord): Promise<void> {
    this.verifications.push(record);
  }

  async listVerifiedSuccesses(): Promise<VerifyRecord[]> {
    return this.verifications.filter((v) => v.status === "verified");
  }

  async incrementAndGetCount(key: string, windowMs: number): Promise<number> {
    const bucket = Math.floor(Date.now() / windowMs);
    const bucketKey = `${key}::${bucket}`;
    const next = (this.counters.get(bucketKey) ?? 0) + 1;
    this.counters.set(bucketKey, next);
    return next;
  }

  /** Test-only: wipe all state between test cases. */
  __resetForTests(): void {
    this.checkins.clear();
    this.pings.clear();
    this.verifications = [];
    this.counters.clear();
  }
}

// Module-level singleton, resolved once at import time. Real deployment
// (Pi, pm2, single process) sets SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY,
// so this resolves to PostgresChallengeStore there. Tests/CI leave those
// unset and get MemoryChallengeStore automatically — no test needs to know
// which backend it's running against.
function createStore(): ChallengeStore & { __resetForTests?: () => void } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    // Lazy require avoids pulling @supabase/supabase-js into the bundle
    // graph for test runs that never construct this branch.
    const { PostgresChallengeStore } = require("./postgres-store");
    return new PostgresChallengeStore(url, key);
  }
  return new MemoryChallengeStore();
}

export const challengeStore: ChallengeStore & { __resetForTests?: () => void } =
  createStore();
