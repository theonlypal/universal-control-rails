import { NextRequest, NextResponse } from "next/server";
import { UCRAction, UCRActionResult, sendActionToDevice, createMockDevices } from "ucr-core";

async function loadDevices(origin: string) {
  try {
    const res = await fetch(`${origin}/api/devices`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.devices as any[];
    }
  } catch (err) {
    // fall through
  }
  return createMockDevices();
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { action: UCRAction };
  const origin = new URL(req.url).origin;
  const devices = await loadDevices(origin);
  const device = devices.find((d: any) => d.id === body.action.deviceId);
  if (!device) {
    return NextResponse.json({ success: false, message: "Device not found", timestamp: new Date().toISOString() }, { status: 404 });
  }
  const result: UCRActionResult = await sendActionToDevice(device, body.action);
  return NextResponse.json(result);
}
