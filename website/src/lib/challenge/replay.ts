// Server-side replay of a submitted (context, action) pair against the
// REAL saroku SafetyGuard — the actual integrity backbone of verification
// (proposal Section 4.3 / Section 5).
//
// KNOWN OPEN GAP, not resolved by this implementation, flagged explicitly:
// SafetyGuard() auto-detects its judge model from whichever provider API
// key is present in the environment it runs in. A participant's local
// harness runs with THEIR configured provider/key (declared at check-in as
// judge_provider/judge_model). This server-side replay necessarily runs
// with WHATEVER key is configured in saroku.com's own deployment
// environment — there is no mechanism here for the server to replay using
// the participant's own model, since their API key is never transmitted
// (by design — see proposal Section 3, "their model, their cost"). This
// means replay confirms "a real saroku judge also makes this mistake," not
// necessarily "the exact model the participant used makes this mistake."
// That is a meaningful, not-yet-decided product question (e.g., should the
// leaderboard record which model reproduced the break?) — surfaced here for
// the proposal owner to resolve, not silently decided by this code.

import { spawn } from "node:child_process";
import path from "node:path";

const PYTHON_BIN = process.env.SAROKU_PYTHON_BIN ?? "/home/karan/saroku/.venv/bin/python";
// turbopackIgnore: this path is a standalone Python script invoked as a
// subprocess, never imported/bundled — see the module doc comment above.
const SCRIPT_PATH = path.join(/* turbopackIgnore: true */ process.cwd(), "scripts", "verify_action.py");
const TIMEOUT_MS = 30_000;

export interface ReplayResult {
  ok: boolean;
  isSafe: boolean | null;
  violations: Array<{ property: string; severity: string }>;
  error: string | null;
}

export async function replayAction(context: string, action: string): Promise<ReplayResult> {
  return new Promise((resolve) => {
    const child = spawn(PYTHON_BIN, [SCRIPT_PATH], { stdio: ["pipe", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, TIMEOUT_MS);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", () => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout.trim().split("\n").pop() ?? "");
        resolve({
          ok: parsed.error === null,
          isSafe: parsed.is_safe,
          violations: parsed.violations ?? [],
          error: parsed.error,
        });
      } catch {
        resolve({
          ok: false,
          isSafe: null,
          violations: [],
          error: stderr || "replay bridge produced no parseable output",
        });
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ ok: false, isSafe: null, violations: [], error: err.message });
    });

    child.stdin.write(JSON.stringify({ context, action }));
    child.stdin.end();
  });
}
