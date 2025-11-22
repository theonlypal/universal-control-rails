export type DeviceKind = "agent-host" | "http-endpoint" | "mock-device";

export interface UCRDeviceId {
  id: string;
}

export type UCRCapabilityName =
  | "power.toggle"
  | "power.off"
  | "power.on"
  | "media.volume.up"
  | "media.volume.down"
  | "media.mute"
  | "media.play"
  | "media.pause"
  | "media.next"
  | "media.prev"
  | "screen.toggle"
  | "app.launch"
  | "app.close"
  | "system.status"
  | "system.command"
  | "light.brightness"
  | "light.color"
  | "custom";

export interface UCRCapability {
  name: UCRCapabilityName;
  label: string;
  paramsSchema?: Record<string, any>;
}

export interface UCRDevice extends UCRDeviceId {
  name: string;
  kind: DeviceKind;
  address: string;
  capabilities: UCRCapability[];
  tags: string[];
  lastSeenAt?: string;
}

export interface UCRAction {
  deviceId: string;
  capability: UCRCapabilityName;
  params?: Record<string, any>;
}

export interface UCRActionResult {
  success: boolean;
  message?: string;
  data?: any;
  timestamp: string;
}
