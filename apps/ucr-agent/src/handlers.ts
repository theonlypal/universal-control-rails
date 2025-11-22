import { Request, Response } from "express";
import { UCRAction, UCRActionResult, UCRDevice } from "ucr-core";
import { config } from "./config";
import { executeCapability } from "./capabilities";
import { log } from "./log";

export function requireSecret(req: Request): boolean {
  const provided = (req.headers["x-ucr-secret"] as string) || (req.body?.secret as string) || "";
  return !config.secret || provided === config.secret;
}

export async function handleAction(req: Request, res: Response) {
  if (!requireSecret(req)) {
    res.status(401).json({ success: false, message: "Unauthorized", timestamp: new Date().toISOString() });
    return;
  }
  const action = req.body?.action as UCRAction | undefined;
  if (!action) {
    res.status(400).json({ success: false, message: "Action missing", timestamp: new Date().toISOString() });
    return;
  }
  log("Action received", { action });
  try {
    const result = await executeCapability(action);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || "Execution error", timestamp: new Date().toISOString() });
  }
}

export function handleDevices(req: Request, res: Response, devices: UCRDevice[]) {
  res.json({ devices });
}

export function handleHealth(req: Request, res: Response) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
