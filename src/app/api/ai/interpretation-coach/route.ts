import { NextResponse } from "next/server";
import { interpretationCoach } from "@/lib/steward-engine";

export async function POST(request: Request) {
  const { event, automaticNarrative, fixedBelief } = await request.json();
  return NextResponse.json(
    interpretationCoach(event ?? "", automaticNarrative ?? "", fixedBelief ?? "")
  );
}
