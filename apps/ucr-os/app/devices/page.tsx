"use client";
import { useEffect, useMemo, useState } from "react";
import { UCRDevice } from "ucr-core";
import { fetchDevices } from "@/lib/api";
import { DeviceCard } from "@/components/DeviceCard";
import { Panel } from "@/components/Panel";

const filters = [
  { id: "all", label: "All" },
  { id: "agent-host", label: "Agent" },
  { id: "http-endpoint", label: "HTTP" },
  { id: "mock-device", label: "Mock" },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState<UCRDevice[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchDevices().then(setDevices).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return devices;
    return devices.filter((d) => d.kind === filter);
  }, [devices, filter]);

  return (
    <div className="space-y-4">
      <Panel className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f.id ? "bg-accent-primary text-slate-900" : "bg-white/5 text-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </Panel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
