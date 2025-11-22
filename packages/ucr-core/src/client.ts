import { UCRAction, UCRActionResult, UCRDevice } from "./types";
import { UCRActionRequest, createActionTimestamp } from "./protocol";
import { nowIso } from "./utils";

const DEFAULT_TIMEOUT = 8000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function buildHeaders(secret?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["x-ucr-secret"] = secret;
  return headers;
}

export async function sendActionToDevice(device: UCRDevice, action: UCRAction): Promise<UCRActionResult> {
  const secret = process.env.UCR_AGENT_SECRET;
  const payload: UCRActionRequest = { secret, action };
  const timestamp = createActionTimestamp();

  if (device.kind === "mock-device") {
    return {
      success: true,
      message: `Simulated ${action.capability} on ${device.name}`,
      data: { params: action.params },
      timestamp,
    };
  }

  const controller = new AbortController();
  const targetUrl =
    device.kind === "agent-host"
      ? `${device.address.replace(/\/$/, "")}/ucr/action`
      : `${device.address.replace(/\/$/, "")}/ucr-http`;

  const response = await withTimeout(
    fetch(targetUrl, {
      method: "POST",
      headers: buildHeaders(secret),
      body: JSON.stringify(payload),
      signal: controller.signal,
    }),
    DEFAULT_TIMEOUT
  );

  if (!response.ok) {
    return {
      success: false,
      message: `Failed with status ${response.status}`,
      timestamp: nowIso(),
    };
  }

  const data = (await response.json()) as UCRActionResult;
  return { ...data, timestamp: data.timestamp || nowIso() };
}
