import { NextResponse } from "next/server";

export async function GET() {
  const agentUrl = process.env.UCR_DEFAULT_AGENT_URL;
  if (!agentUrl) return NextResponse.json({ status: "missing" }, { status: 200 });
  try {
    const res = await fetch(`${agentUrl.replace(/\/$/, "")}/ucr/health`, { cache: "no-store" });
    if (res.ok) return NextResponse.json({ status: "ok" });
    return NextResponse.json({ status: "offline" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: "offline" }, { status: 200 });
  }
}
