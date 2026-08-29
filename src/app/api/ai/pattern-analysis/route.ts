import { NextResponse } from "next/server";
import { patternAnalysis } from "@/lib/steward-engine";

export async function POST(request: Request) {
  const { failureLogs, neverZeroStreak, singleAdjustmentProposal } = await request.json();
  return NextResponse.json(
    patternAnalysis(failureLogs ?? [], neverZeroStreak ?? 0, singleAdjustmentProposal ?? "")
  );
}
