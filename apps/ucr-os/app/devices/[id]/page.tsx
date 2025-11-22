"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { UCRAction, UCRCapabilityName, UCRDevice, createSession } from "ucr-core";
import { fetchDevices, runAction } from "@/lib/api";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { TextInput } from "@/components/TextInput";
import { useLocalSessions } from "@/lib/localState";
import { Toast } from "@/components/Toast";

export default function DeviceDetailPage() {
  const params = useParams<{ id: string }>();
  const [device, setDevice] = useState<UCRDevice | null>(null);
  const [command, setCommand] = useState("uptime");
  const [toast, setToast] = useState<string | null>(null);
  const { sessions, save } = useLocalSessions();

  useEffect(() => {
    fetchDevices().then((devices) => {
      const found = devices.find((d) => d.id === params.id);
      setDevice(found || null);
    });
  }, [params.id]);

  const capabilityGroups = useMemo(() => {
    if (!device) return {} as Record<string, UCRCapabilityName[]>;
    const groups: Record<string, UCRCapabilityName[]> = { power: [], media: [], system: [], other: [] };
    device.capabilities.forEach((c) => {
      if (c.name.startsWith("power")) groups.power.push(c.name);
      else if (c.name.startsWith("media")) groups.media.push(c.name);
      else if (c.name.startsWith("system")) groups.system.push(c.name);
      else groups.other.push(c.name);
    });
    return groups;
  }, [device]);

  const trigger = async (capability: UCRCapabilityName, params?: Record<string, any>) => {
    if (!device) return;
    const action: UCRAction = { deviceId: device.id, capability, params };
    const res = await runAction(action);
    setToast(res.success ? "Action executed" : res.message || "Failed");
  };

  const startSession = () => {
    if (!device) return;
    const session = createSession(device.id);
    save([...sessions, session]);
    setToast("Session started");
  };

  if (!device) return <p className="text-slate-200">Loading...</p>;

  return (
    <div className="space-y-4">
      <Panel className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent-primary">{device.kind}</p>
            <h2 className="text-xl font-bold">{device.name}</h2>
            <p className="text-xs text-slate-400">{device.address}</p>
          </div>
          <Button onClick={startSession}>Start Session</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {device.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </Panel>

      {capabilityGroups.power.length > 0 && (
        <Panel className="space-y-2">
          <h3 className="font-semibold">Power</h3>
          <div className="flex gap-2">
            {capabilityGroups.power.map((cap) => (
              <Button key={cap} variant="ghost" onClick={() => trigger(cap)}>
                {cap}
              </Button>
            ))}
          </div>
        </Panel>
      )}

      {capabilityGroups.media.length > 0 && (
        <Panel className="space-y-2">
          <h3 className="font-semibold">Media</h3>
          <div className="grid grid-cols-2 gap-2">
            {capabilityGroups.media.map((cap) => (
              <Button key={cap} variant="ghost" onClick={() => trigger(cap)}>
                {cap}
              </Button>
            ))}
          </div>
        </Panel>
      )}

      {capabilityGroups.system.length > 0 && (
        <Panel className="space-y-3">
          <h3 className="font-semibold">System</h3>
          <div className="flex gap-2">
            {capabilityGroups.system
              .filter((c) => c !== "system.command")
              .map((cap) => (
                <Button key={cap} variant="ghost" onClick={() => trigger(cap)}>
                  {cap}
                </Button>
              ))}
          </div>
          {capabilityGroups.system.includes("system.command") && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Run whitelisted command</p>
              <div className="flex gap-2">
                <TextInput value={command} onChange={(e) => setCommand(e.target.value)} />
                <Button onClick={() => trigger("system.command", { command })}>Run</Button>
              </div>
            </div>
          )}
        </Panel>
      )}

      {capabilityGroups.other.length > 0 && (
        <Panel className="space-y-2">
          <h3 className="font-semibold">Other</h3>
          <div className="flex gap-2 flex-wrap">
            {capabilityGroups.other.map((cap) => (
              <Button key={cap} variant="ghost" onClick={() => trigger(cap)}>
                {cap}
              </Button>
            ))}
          </div>
        </Panel>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
