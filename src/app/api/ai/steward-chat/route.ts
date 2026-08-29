import { NextResponse } from "next/server";
import { stewardChatReply } from "@/lib/steward-engine";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, context } = body as { message: string; context: Record<string, unknown> };
  return NextResponse.json(stewardChatReply(message ?? "", context ?? {}));
}
