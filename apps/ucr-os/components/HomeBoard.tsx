"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UCRDevice, UCRMacro, UCRSession, createSession, runMacroSequential } from "ucr-core";
import { fetchDevices, runAction } from "@/lib/api";
import { Button } from "./Button";
import { Panel } from "./Panel";
import { DeviceCard } from "./DeviceCard";
import { MacroCard } from "./MacroCard";
import { CommandBar } from "./CommandBar";
import { useLocalMacros, useLocalSessions } from "@/lib/localState";
import { SessionCard } from "./SessionCard";
import { Toast } from "./Toast";

export function HomeBoard() {
  const [devices, setDevices] = useState<UCRDevice[]>([]);
  const { macros } = useLocalMacros();
  const { sessions, save: saveSessions } = useLocalSessions();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices().then(setDevices).catch(console.error);
  }, []);

  const startSession = (deviceId: string) => {
    const session = createSession(deviceId);
    saveSessions([...sessions, session]);
    setToast("Session started");
  };

  const runMacro = async (macro: UCRMacro) => {
    const results = await runMacroSequential(macro, runAction);
    const failed = results.find((r) => !r.success);
    setToast(failed ? failed.message || "Macro had an error" : "Macro executed");
  };

  return (
    <div className="space-y-6">
      <Panel className="bg-gradient-to-r from-white/5 to-white/0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent-primary">Control any connected device</p>
            <h2 className="text-2xl font-bold">Universal Control Rails</h2>
            <p className="text-sm text-slate-300">A phone-first control OS with rails for devices and macros.</p>
          </div>
          <Button onClick={() => startSession(devices[0]?.id || "mock-tv")}>
            Quick Session
          </Button>
        </div>
      </Panel>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick Devices</h3>
          <Link href="/devices" className="text-sm text-accent-primary">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {devices.slice(0, 4).map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <Link href="/sessions" className="text-sm text-accent-primary">
            Manage
          </Link>
        </div>
        {sessions.length === 0 && <p className="text-sm text-slate-400">No sessions yet.</p>}
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClose={(id) => {
                saveSessions(sessions.filter((s) => s.id !== id));
                setToast("Session closed");
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Macros</h3>
          <Link href="/macros" className="text-sm text-accent-primary">
            Edit
          </Link>
        </div>
        {macros.length === 0 && <p className="text-sm text-slate-400">Create macros to orchestrate actions.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {macros.slice(0, 4).map((macro) => (
            <MacroCard key={macro.id} macro={macro} onRun={() => runMacro(macro)} onEdit={() => {}} />
          ))}
        </div>
      </div>

      <CommandBar devices={devices.map((d) => ({ id: d.id, name: d.name }))} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
