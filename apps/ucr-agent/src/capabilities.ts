import os from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { UCRAction, UCRActionResult } from "ucr-core";
import { config } from "./config";
import { log } from "./log";

const execAsync = promisify(exec);

function buildSuccess(message: string, data?: any): UCRActionResult {
  return { success: true, message, data, timestamp: new Date().toISOString() };
}

function buildFailure(message: string): UCRActionResult {
  return { success: false, message, timestamp: new Date().toISOString() };
}

export async function executeCapability(action: UCRAction): Promise<UCRActionResult> {
  switch (action.capability) {
    case "system.status": {
      const load = os.loadavg();
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      return buildSuccess("System status", {
        hostname: os.hostname(),
        platform: os.platform(),
        load,
        memory: { free: freeMem, total: totalMem },
        uptime: os.uptime(),
      });
    }
    case "system.command": {
      const command = action.params?.command as string | undefined;
      if (!command) return buildFailure("Command missing");
      if (!config.commandWhitelist.includes(command)) {
        return buildFailure("Command not allowed by whitelist");
      }
      log(`Executing command ${command}`);
      const { stdout, stderr } = await execAsync(command);
      return buildSuccess("Command executed", { stdout, stderr });
    }
    case "media.volume.up":
      return buildSuccess("Volume increased", { level: "+5" });
    case "media.volume.down":
      return buildSuccess("Volume decreased", { level: "-5" });
    case "media.mute":
      return buildSuccess("Muted");
    case "power.toggle":
      return buildSuccess("Power toggled");
    case "power.on":
      return buildSuccess("Power on");
    case "power.off":
      return buildSuccess("Power off");
    case "media.play":
      return buildSuccess("Play triggered");
    case "media.pause":
      return buildSuccess("Pause triggered");
    case "media.next":
      return buildSuccess("Next track");
    case "media.prev":
      return buildSuccess("Previous track");
    case "screen.toggle":
      return buildSuccess("Screen toggled");
    case "app.launch":
      return buildSuccess("App launch requested", { app: action.params?.app });
    case "app.close":
      return buildSuccess("App close requested", { app: action.params?.app });
    case "light.brightness":
      return buildSuccess("Brightness set", { level: action.params?.level ?? 50 });
    case "light.color":
      return buildSuccess("Color set", { color: action.params?.hex ?? "#ffffff" });
    default:
      return buildFailure("Capability not supported");
  }
}
