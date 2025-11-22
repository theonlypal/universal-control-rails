import { DeviceKind, UCRCapability, UCRDevice } from "./types";
import { nowIso } from "./utils";

const baseCapabilities: Record<DeviceKind, UCRCapability[]> = {
  "agent-host": [
    { name: "system.status", label: "System Status" },
    { name: "system.command", label: "Run Command", paramsSchema: { command: "string" } },
    { name: "media.volume.up", label: "Volume Up" },
    { name: "media.volume.down", label: "Volume Down" },
    { name: "media.mute", label: "Mute" },
    { name: "power.toggle", label: "Power Toggle" },
  ],
  "http-endpoint": [
    { name: "power.on", label: "Power On" },
    { name: "power.off", label: "Power Off" },
    { name: "media.play", label: "Play" },
    { name: "media.pause", label: "Pause" },
    { name: "custom", label: "Custom Action", paramsSchema: { path: "string", payload: "object" } },
  ],
  "mock-device": [
    { name: "power.toggle", label: "Power Toggle" },
    { name: "media.volume.up", label: "Volume Up" },
    { name: "media.volume.down", label: "Volume Down" },
    { name: "media.mute", label: "Mute" },
    { name: "light.brightness", label: "Brightness", paramsSchema: { level: "number" } },
    { name: "light.color", label: "Color", paramsSchema: { hex: "string" } },
  ],
};

export function createMockDevices(): UCRDevice[] {
  const now = nowIso();
  return [
    {
      id: "mock-tv",
      name: "Mock TV",
      kind: "mock-device",
      address: "mock://tv",
      capabilities: baseCapabilities["mock-device"],
      tags: ["mock", "display"],
      lastSeenAt: now,
    },
    {
      id: "mock-speakers",
      name: "Mock Speakers",
      kind: "mock-device",
      address: "mock://speakers",
      capabilities: [
        { name: "media.volume.up", label: "Volume Up" },
        { name: "media.volume.down", label: "Volume Down" },
        { name: "media.mute", label: "Mute" },
        { name: "power.toggle", label: "Power" },
      ],
      tags: ["mock", "audio"],
      lastSeenAt: now,
    },
    {
      id: "mock-lights",
      name: "Mock Lights",
      kind: "mock-device",
      address: "mock://lights",
      capabilities: [
        { name: "power.toggle", label: "Power" },
        { name: "light.brightness", label: "Brightness" },
        { name: "light.color", label: "Color" },
      ],
      tags: ["mock", "lighting"],
      lastSeenAt: now,
    },
  ];
}

export function normalizeDevices(devices: UCRDevice[]): UCRDevice[] {
  const map = new Map<string, UCRDevice>();
  devices.forEach((device) => {
    map.set(device.id, {
      ...device,
      lastSeenAt: device.lastSeenAt || nowIso(),
      capabilities: device.capabilities || baseCapabilities[device.kind] || [],
      tags: device.tags || [],
    });
  });
  return Array.from(map.values());
}

export function groupByKind(devices: UCRDevice[]): Record<DeviceKind, UCRDevice[]> {
  return devices.reduce(
    (acc, device) => {
      const list = acc[device.kind] || [];
      list.push(device);
      acc[device.kind] = list;
      return acc;
    },
    { "agent-host": [], "http-endpoint": [], "mock-device": [] } as Record<DeviceKind, UCRDevice[]>
  );
}

export function getCapabilitiesForKind(kind: DeviceKind): UCRCapability[] {
  return baseCapabilities[kind] || [];
}
