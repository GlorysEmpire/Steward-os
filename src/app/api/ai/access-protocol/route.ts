import { NextResponse } from "next/server";
import { accessProtocol } from "@/lib/steward-engine";

export async function POST(request: Request) {
  const { currentState } = await request.json();
  return NextResponse.json(accessProtocol(currentState ?? "", ""));
}
