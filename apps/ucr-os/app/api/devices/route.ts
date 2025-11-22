import { NextResponse } from "next/server";
import { createMockDevices, normalizeDevices, UCRDevice } from "ucr-core";

export async function GET() {
  const devices: UCRDevice[] = [...createMockDevices()];
  const agentUrl = process.env.UCR_DEFAULT_AGENT_URL;
  if (agentUrl) {
    try {
      const res = await fetch(`${agentUrl.replace(/\/$/, "")}/ucr/devices`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { devices: UCRDevice[] };
        devices.push(...data.devices.map((d) => ({ ...d, address: agentUrl })));
      }
    } catch (err) {
      console.warn("Agent not reachable", err);
    }
  }
  return NextResponse.json({ devices: normalizeDevices(devices) });
}
