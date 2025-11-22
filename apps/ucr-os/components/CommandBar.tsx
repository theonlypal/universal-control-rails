"use client";
import { useEffect, useState } from "react";
import { UCRAction } from "ucr-core";
import { Button } from "./Button";
import { Panel } from "./Panel";
import { Tag } from "./Tag";
import { runAction } from "@/lib/api";

interface Props {
  devices: { id: string; name: string }[];
}

export function CommandBar({ devices }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [actions, setActions] = useState<UCRAction[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const parse = async () => {
    setResult(null);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "ucr_commands", input }),
    });
    const data = await res.json();
    if (data.success) setActions(data.actions as UCRAction[]);
    else setResult(data.error || "Failed to parse command");
  };

  const run = async () => {
    setRunning(true);
    const outputs = [] as string[];
    for (const action of actions) {
      // eslint-disable-next-line no-await-in-loop
      const res = await runAction(action);
      outputs.push(`${action.capability}: ${res.success ? "ok" : res.message}`);
    }
    setResult(outputs.join(" | "));
    setRunning(false);
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => setOpen(true)} className="w-full">
        ⌘K Command Bar
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <Panel className="w-full max-w-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Command Bar</h3>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2"
              placeholder="Describe what you want to do"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={parse}>Parse</Button>
              <Button onClick={run} disabled={!actions.length || running} variant="outline">
                Run {actions.length ? `(${actions.length})` : ""}
              </Button>
            </div>
            {actions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-300">Parsed actions</p>
                <div className="space-y-2">
                  {actions.map((a, idx) => (
                    <Panel key={idx} className="bg-white/5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{a.capability}</span>
                        <Tag label={a.deviceId} tone="info" />
                      </div>
                      {a.params && <pre className="text-xs text-slate-300 mt-2">{JSON.stringify(a.params)}</pre>}
                    </Panel>
                  ))}
                </div>
              </div>
            )}
            {result && <p className="text-sm text-slate-200">{result}</p>}
          </Panel>
        </div>
      )}
    </div>
  );
}
