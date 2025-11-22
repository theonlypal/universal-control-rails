import { UCRAction, UCRActionResult, UCRDevice } from "ucr-core";

export async function fetchDevices(): Promise<UCRDevice[]> {
  const res = await fetch("/api/devices");
  if (!res.ok) return [];
  const data = (await res.json()) as { devices: UCRDevice[] };
  return data.devices;
}

export async function runAction(action: UCRAction): Promise<UCRActionResult> {
  const res = await fetch("/api/ucr-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) {
    return { success: false, message: `HTTP ${res.status}`, timestamp: new Date().toISOString() };
  }
  return (await res.json()) as UCRActionResult;
}
