import { NextResponse } from "next/server";

const BASE_REPO = "karanxa/saroku-guard";
// karanxa/saroku-safety-0.5b was renamed to karanxa/saroku-guard on the Hub.
// Individual repo lookups (fetchDownloadsAllTime) redirect fine under either
// id, but the derivative-discovery *filter search* below does not — it's a
// literal string match against each derivative's own base_model tag, and
// third-party derivatives (e.g. community GGUF quantizations) still carry
// whatever id existed when they were created. Renaming our repo doesn't
// retroactively update their tags, so derivatives must be searched for under
// every id this repo has ever had, not just the current one — otherwise
// their downloads silently vanish from the total (this happened once
// already: 2157 -> 877 when BASE_REPO changed and this list didn't exist).
const LEGACY_REPO_IDS = ["karanxa/saroku-safety-0.5b"];
const CACHE_TTL_MS = 12 * 60 * 1000; // 12 minutes
const FETCH_TIMEOUT_MS = 5000;

interface Breakdown {
  repoId: string;
  downloads: number;
}

interface CachedPayload {
  total: number;
  updatedAt: string;
  breakdown: Breakdown[];
}

let cache: CachedPayload | null = null;
let cachedAt = 0;

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HF API ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDownloadsAllTime(repoId: string): Promise<number> {
  const data = (await fetchJson(
    `https://huggingface.co/api/models/${repoId}?expand[]=downloadsAllTime`
  )) as { downloadsAllTime?: number };
  return typeof data.downloadsAllTime === "number" ? data.downloadsAllTime : 0;
}

async function discoverQuantizedRepoIds(forRepoId: string): Promise<string[]> {
  const data = (await fetchJson(
    `https://huggingface.co/api/models?filter=base_model:quantized:${forRepoId}`
  )) as Array<{ id?: string }>;
  if (!Array.isArray(data)) return [];
  return data.map((m) => m.id).filter((id): id is string => typeof id === "string");
}

async function computeTotal(): Promise<CachedPayload> {
  const searchIds = [BASE_REPO, ...LEGACY_REPO_IDS];
  const derivativeIdLists = await Promise.all(searchIds.map(discoverQuantizedRepoIds));
  const derivativeIds = [...new Set(derivativeIdLists.flat())];
  const repoIds = [BASE_REPO, ...derivativeIds];

  const breakdown: Breakdown[] = await Promise.all(
    repoIds.map(async (repoId) => ({
      repoId,
      downloads: await fetchDownloadsAllTime(repoId),
    }))
  );

  const total = breakdown.reduce((sum, b) => sum + b.downloads, 0);
  return { total, updatedAt: new Date().toISOString(), breakdown };
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
      // HF API hiccup to visitors.
      return NextResponse.json(cache);
    }
    return NextResponse.json(
      { error: "Unable to fetch download counts", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}
