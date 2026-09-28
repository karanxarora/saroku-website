// Serves the Break Saroku Challenge Set scenario data to the CLI harness.
//
// IMPORTANT — why this exists as a dynamic API route instead of a static
// file: the scenario content (src/lib/challenge/data/challenge_scenarios_v1.json)
// is explicitly unpublished — see /home/karan/saroku-challenge/scenarios/README.md's
// own "Status: UNPUBLISHED" note. Publishing the raw scenario text in the
// public saroku-challenge GitHub repo, or as a static /public asset, would
// make it indexable/scrapable without ever running the harness, defeating
// the point of the challenge (a "break" should mean a real gap was found,
// not that someone read the answer key on GitHub or curled a static file).
//
// This endpoint requires a valid, already-completed check-in (the CLI
// always check-ins before requesting scenarios — see challenge/cli.py) —
// not full authentication, just enough friction that a bare unauthenticated
// GET from a scraper/crawler doesn't trivially dump the set. This does not,
// and cannot, stop a participant who has genuinely installed and run the
// harness from reading the scenario text — that's unavoidable, since
// SafetyGuard has to evaluate the real scenario content locally. The goal
// is stopping passive/automated harvesting, not perfect secrecy.

import { NextRequest, NextResponse } from "next/server";
import { challengeStore } from "@/lib/challenge/store";
import scenarioData from "@/lib/challenge/data/challenge_scenarios_v1.json";

export async function GET(req: NextRequest) {
  const instanceId = req.nextUrl.searchParams.get("instance_id");

  if (!instanceId) {
    return NextResponse.json({ error: "missing_instance_id" }, { status: 400 });
  }

  const checkin = await challengeStore.getCheckin(instanceId);
  if (!checkin) {
    return NextResponse.json(
      { error: "unknown_instance", message: "Check in first (POST /api/challenge/checkin) before requesting scenarios." },
      { status: 403 }
    );
  }

  return NextResponse.json(scenarioData);
}
