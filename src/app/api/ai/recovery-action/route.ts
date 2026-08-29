import { NextResponse } from "next/server";
import { recoveryAction } from "@/lib/steward-engine";

export async function POST(request: Request) {
  const { missedAction, context } = await request.json();
  // `context` here is free-text describing the circumstances (e.g. "Low
  // energy / Schedule disruption") — not a LoopType — so we pass it through
  // as unstructured info for the recalibration message rather than trying
  // to match it against the LoopType union.
  return NextResponse.json(recoveryAction(missedAction ?? "", context ?? undefined));
}
