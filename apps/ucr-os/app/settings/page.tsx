"use client";
import { useEffect, useState } from "react";
import { Panel } from "@/components/Panel";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import { clearLocalState, useAgentUrl } from "@/lib/localState";
import { Toast } from "@/components/Toast";

export default function SettingsPage() {
  const { agentUrl, save } = useAgentUrl("http://localhost:5055");
  const [reachable, setReachable] = useState<string>("checking...");
  const [toast, setToast] = useState<string | null>(null);
  const aiConfigured = Boolean(process.env.AI_API_KEY);

  useEffect(() => {
    fetch("/api/agent-health")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReachable(data?.status === "ok" ? "online" : "offline"))
      .catch(() => setReachable("offline"));
  }, [agentUrl]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      <Panel className="space-y-3">
        <h3 className="font-semibold">Agent Configuration</h3>
        <TextInput value={agentUrl} onChange={(e) => save(e.target.value)} />
        <p className="text-sm text-slate-400">Status: {reachable}</p>
      </Panel>

      <Panel className="space-y-3">
        <h3 className="font-semibold">AI Settings</h3>
        <p className="text-sm text-slate-300">AI key configured: {aiConfigured ? "yes" : "no (mock mode)"}</p>
        <p className="text-xs text-slate-400">Natural language commands will be translated to actions when configured.</p>
      </Panel>

      <Panel className="space-y-3">
        <h3 className="font-semibold">Data</h3>
        <Button
          variant="outline"
          onClick={() => {
            clearLocalState();
            setToast("Local data cleared");
          }}
        >
          Clear local state
        </Button>
      </Panel>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
