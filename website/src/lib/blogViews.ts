import { promises as fs } from "fs";
import path from "path";

// Deliberately not surfaced in the UI yet — this just accumulates counts
// per post so the numbers exist if/when we want to use them later. No
// third-party analytics vendor involved.
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "blog-views.json");

interface PostViewCounts {
  pageviews: number;
  // Distinct visitors, per the client's persistent localStorage id. Not a
  // cryptographic guarantee (private windows, multiple devices, or a
  // cleared browser all create a "new" visitor) but a real improvement
  // over raw pageviews for a first-party, no-cookie counter.
  uniqueVisitors: number;
}

type ViewCounts = Record<string, PostViewCounts>;

async function readCounts(): Promise<ViewCounts> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    // Migrate the old shape (slug -> number) transparently if present.
    const migrated: ViewCounts = {};
    for (const [slug, value] of Object.entries(parsed)) {
      if (typeof value === "number") {
        migrated[slug] = { pageviews: value, uniqueVisitors: value };
      } else if (value && typeof value === "object") {
        const v = value as Partial<PostViewCounts>;
        migrated[slug] = {
          pageviews: typeof v.pageviews === "number" ? v.pageviews : 0,
          uniqueVisitors: typeof v.uniqueVisitors === "number" ? v.uniqueVisitors : 0,
        };
      }
    }
    return migrated;
  } catch {
    return {};
  }
}

// Single-process pm2 fork, low traffic — a plain read-modify-write is
// good enough here and avoids pulling in a real datastore for a counter.
let writeQueue = Promise.resolve();

export function incrementBlogView(slug: string, isUniqueVisitor: boolean): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const counts = await readCounts();
    const entry = counts[slug] ?? { pageviews: 0, uniqueVisitors: 0 };
    entry.pageviews += 1;
    if (isUniqueVisitor) entry.uniqueVisitors += 1;
    counts[slug] = entry;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(counts, null, 2));
  });
  return writeQueue;
}

export async function getBlogViews(): Promise<ViewCounts> {
  return readCounts();
}
