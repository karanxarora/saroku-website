// Rate limiting for the "Break Saroku" challenge endpoints.
// Values per proposal Section 12, decision 5:
//   checkin: 5 / IP / hour
//   ping:    20 / instance / hour
//   verify:  10 / instance / day
//
// Backed by ChallengeStore.incrementAndGetCount(), which resolves to the
// real Postgres-backed store (see store.ts / postgres-store.ts) whenever
// SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY are set — true in production on
// the Pi. Uses the increment_rate_counter Postgres function (atomic
// upsert-and-increment) so concurrent requests hitting the same bucket
// don't race. Falls back to the in-memory store automatically in tests/CI
// where those env vars aren't set — safe there specifically because tests
// never run multiple concurrent processes against the same counter.

import { challengeStore } from "./store";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const RATE_LIMITS = {
  checkinPerIpPerHour: 5,
  pingPerInstancePerHour: 20,
  verifyPerInstancePerDay: 10,
  installPingPerIpPerHour: 10,
} as const;

// Effectively-infinite window (~31,000 years) so the bucket never rolls —
// turns incrementAndGetCount into a plain monotonic running total instead
// of a rate-limit window. Used only for the install-ping counter, which
// wants a lifetime count, not a per-window one.
const FOREVER_MS = 1e15;

export async function checkRateLimit(
  key: string,
  windowMs: number,
  limit: number
): Promise<{ allowed: boolean; count: number }> {
  const count = await challengeStore.incrementAndGetCount(key, windowMs);
  return { allowed: count <= limit, count };
}

export async function checkCheckinRateLimit(ip: string) {
  return checkRateLimit(`checkin:${ip}`, HOUR_MS, RATE_LIMITS.checkinPerIpPerHour);
}

export async function checkPingRateLimit(instanceId: string) {
  return checkRateLimit(`ping:${instanceId}`, HOUR_MS, RATE_LIMITS.pingPerInstancePerHour);
}

export async function checkVerifyRateLimit(instanceId: string) {
  return checkRateLimit(`verify:${instanceId}`, DAY_MS, RATE_LIMITS.verifyPerInstancePerDay);
}

export async function checkInstallPingRateLimit(ip: string) {
  return checkRateLimit(`install-ping:${ip}`, HOUR_MS, RATE_LIMITS.installPingPerIpPerHour);
}

// Lifetime total of install-script runs, independent of any per-IP window.
export async function incrementInstallTotal(): Promise<number> {
  return challengeStore.incrementAndGetCount("install:total", FOREVER_MS);
}
