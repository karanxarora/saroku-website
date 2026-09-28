import { NextResponse } from "next/server";

// Combined lifetime PyPI downloads across both the current ("saroku") and
// legacy ("saroku") package names — same "merge every id this product has
// ever shipped under" pattern as /api/model-downloads uses for the Hugging
// Face side, so the two counters tell a consistent story.
const PACKAGE_IDS = ["saroku", "trikesh"];
const CACHE_TTL_MS = 12 * 60 * 1000; // 12 minutes
const FETCH_TIMEOUT_MS = 5000;

interface CachedPayload {
  total: number;
  updatedAt: string;
}

let cache: CachedPayload | null = null;
let cachedAt = 0;

async function fetchTotalDownloads(packageId: string): Promise<number> {
  const apiKey = process.env.PEPY_API_KEY;
  if (!apiKey) throw new Error("PEPY_API_KEY not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.pepy.tech/api/v2/projects/${packageId}`, {
      signal: controller.signal,
      headers: { "X-Api-Key": apiKey, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`pepy.tech API ${res.status} for ${packageId}`);
    const data = (await res.json()) as { total_downloads?: number };
    return typeof data.total_downloads === "number" ? data.total_downloads : 0;
  } finally {
    clearTimeout(timeout);
  }
}

async function computeTotal(): Promise<CachedPayload> {
  const totals = await Promise.all(PACKAGE_IDS.map(fetchTotalDownloads));
  const total = totals.reduce((sum, n) => sum + n, 0);
  return { total, updatedAt: new Date().toISOString() };
}

export async function GET() {
  const isFresh = cache !== null && Date.now() - cachedAt < CACHE_TTL_MS;
  if (isFresh) {
    return NextResponse.json(cache);
  }

  try {
    const fresh = await computeTotal();
    cache = fresh;
    cachedAt = Date.now();
    return NextResponse.json(fresh);
  } catch (err) {
    if (cache !== null) {
      // Serve the last-known-good value rather than surfacing a transient
      // pepy.tech API hiccup to visitors.
      return NextResponse.json(cache);
    }
    return NextResponse.json(
      { error: "Unable to fetch PyPI download counts", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}
