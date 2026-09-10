import { NextRequest, NextResponse } from "next/server";
import { checkInstallPingRateLimit, incrementInstallTotal } from "@/lib/challenge/ratelimit";

// Fired best-effort by install-challenge.sh near the start of the install.
// Purely a funnel-visibility counter (curl'd vs. actually checked in) —
// never blocks the install, and a failed/uncounted ping has no functional
// consequence for the participant.
function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const { allowed } = await checkInstallPingRateLimit(ip);
  if (allowed) {
    await incrementInstallTotal();
  }

  return NextResponse.json({ ok: true });
}
