import { UCRAction, UCRActionResult } from "./types";
import { nowIso } from "./utils";

export interface UCRActionRequest {
  secret?: string;
  action: UCRAction;
}

export interface UCRActionResponse extends UCRActionResult {}

export function createActionTimestamp(): string {
  return nowIso();
}

export function validateAction(action: UCRAction): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!action.deviceId) errors.push("deviceId is required");
  if (!action.capability) errors.push("capability is required");
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}

export function normalizeResponse(result: UCRActionResult): UCRActionResponse {
  return {
    ...result,
    timestamp: result.timestamp || createActionTimestamp(),
  };
}
