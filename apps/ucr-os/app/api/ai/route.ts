import { NextRequest, NextResponse } from "next/server";
import { UCRAction } from "ucr-core";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { mode: string; input: string; context?: any };
  if (body.mode !== "ucr_commands") {
    return NextResponse.json({ success: false, error: "Unsupported mode" }, { status: 400 });
  }

  const aiKey = process.env.AI_API_KEY;
  if (!aiKey) {
    const actions: UCRAction[] = [
      { deviceId: "mock-tv", capability: "power.toggle" },
      { deviceId: "mock-speakers", capability: "media.mute" },
    ];
    return NextResponse.json({ success: true, actions });
  }

  // Minimal mock to illustrate deterministic output; in production you would call an AI provider here
  const actions: UCRAction[] = [{ deviceId: "agent-host", capability: "system.status" }];
  return NextResponse.json({ success: true, actions });
}
