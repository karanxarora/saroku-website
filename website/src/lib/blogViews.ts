import { promises as fs } from "fs";
import path from "path";

// Deliberately not surfaced in the UI yet — this just accumulates raw
// pageview counts per post so the numbers exist if/when we want to use
// them later. Not a unique-visitor count, no analytics vendor involved.
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "blog-views.json");

type ViewCounts = Record<string, number>;

async function readCounts(): Promise<ViewCounts> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Single-process pm2 fork, low traffic — a plain read-modify-write is
// good enough here and avoids pulling in a real datastore for a counter.
let writeQueue = Promise.resolve();

export function incrementBlogView(slug: string): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const counts = await readCounts();
    counts[slug] = (counts[slug] ?? 0) + 1;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(counts, null, 2));
  });
  return writeQueue;
}

export async function getBlogViews(): Promise<ViewCounts> {
  return readCounts();
}
