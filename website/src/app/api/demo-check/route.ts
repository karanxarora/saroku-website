import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:8787/check";
const FETCH_TIMEOUT_MS = 25000;

// The page itself only offers visitors one free-form live check (enforced
// client-side via localStorage, a UX nudge toward `pip install saroku`, not
// a security boundary). This server-side cap is the real abuse backstop —
// sized to cover one scripted walkthrough replay (~4 calls) plus the one
// free-form try, with a little headroom for page refreshes.
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// Periodic cleanup so `buckets` doesn't grow unbounded across many distinct IPs.
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of buckets) {
    if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) buckets.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS).unref?.();

const KNOWN_PROPERTIES = new Set([
  "sycophancy",
  "honesty",
  "prompt_injection",
  "trust_hierarchy",
  "minimal_footprint",
  "goal_drift",
  "corrigibility",
]);

interface CheckRequestBody {
  action?: unknown;
  context?: unknown;
  original_goal?: unknown;
  operator_constraints?: unknown;
  properties?: unknown;
}

function sanitizeString(value: unknown, maxLen: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many checks from this connection. Wait a bit and try again." },
      { status: 429 }
    );
  }

  let body: CheckRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = sanitizeString(body.action, 800);
  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  const context = sanitizeString(body.context, 800);
  const originalGoal = sanitizeString(body.original_goal, 400);
  const operatorConstraints = Array.isArray(body.operator_constraints)
    ? body.operator_constraints
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim().slice(0, 200))
        .slice(0, 5)
    : undefined;
  const properties = Array.isArray(body.properties)
    ? body.properties.filter((p): p is string => typeof p === "string" && KNOWN_PROPERTIES.has(p))
    : undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        context,
        original_goal: originalGoal,
        operator_constraints: operatorConstraints,
        properties,
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "The demo backend rejected this request." },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The live safety check timed out. Please try again."
          : "The demo backend is unavailable right now.",
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
