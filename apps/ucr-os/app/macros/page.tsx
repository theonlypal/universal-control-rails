"use client";
import { useEffect, useState } from "react";
import { UCRMacro, createMacroStep, validateMacro, runMacroSequential } from "ucr-core";
import { fetchDevices, runAction } from "@/lib/api";
import { useLocalMacros } from "@/lib/localState";
import { Panel } from "@/components/Panel";
import { MacroCard } from "@/components/MacroCard";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { TextArea } from "@/components/TextArea";
import { Toast } from "@/components/Toast";

export default function MacrosPage() {
  const { macros, save } = useLocalMacros();
  const [editing, setEditing] = useState<UCRMacro | null>(null);
  const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices().then((list) => setDevices(list.map((d) => ({ id: d.id, name: d.name }))));
  }, []);

  const addStep = () => {
    if (!editing) return;
    const step = createMacroStep("New step", { deviceId: devices[0]?.id || "mock-tv", capability: "power.toggle" });
    setEditing({ ...editing, steps: [...editing.steps, step] });
  };

  const saveMacro = () => {
    if (!editing) return;
    const validation = validateMacro(editing);
    if (!validation.valid) {
      setToast(validation.errors?.join(", ") || "Macro invalid");
      return;
    }
    const others = macros.filter((m) => m.id !== editing.id);
    save([...others, editing]);
    setToast("Macro saved");
    setEditing(null);
  };

  const runMacro = async (macro: UCRMacro) => {
    const results = await runMacroSequential(macro, runAction);
    const failed = results.find((r) => !r.success);
    setToast(failed ? failed.message || "Macro error" : "Macro executed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Macros</h2>
        <Button
          onClick={() =>
            setEditing({ id: `macro-${Date.now()}`, name: "New Macro", description: "", steps: [], tags: [] })
          }
        >
          New Macro
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {macros.map((macro) => (
          <MacroCard key={macro.id} macro={macro} onRun={() => runMacro(macro)} onEdit={() => setEditing(macro)} />
        ))}
      </div>

      {editing && (
        <Panel className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Editing {editing.name}</h3>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Close
            </Button>
          </div>
          <TextInput
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            placeholder="Macro name"
          />
          <TextArea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            placeholder="Description"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Steps</h4>
              <Button variant="outline" onClick={addStep}>
                Add Step
              </Button>
            </div>
            {editing.steps.length === 0 && <p className="text-sm text-slate-400">No steps yet.</p>}
            {editing.steps.map((step, idx) => (
              <Panel key={step.id} className="space-y-2 bg-white/5">
                <TextInput
                  value={step.label}
                  onChange={(e) => {
                    const next = [...editing.steps];
                    next[idx] = { ...step, label: e.target.value };
                    setEditing({ ...editing, steps: next });
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm"
                    value={step.action.deviceId}
                    onChange={(e) => {
                      const next = [...editing.steps];
                      next[idx] = { ...step, action: { ...step.action, deviceId: e.target.value } } as any;
                      setEditing({ ...editing, steps: next });
                    }}
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm"
                    value={step.action.capability}
                    onChange={(e) => {
                      const next = [...editing.steps];
                      next[idx] = { ...step, action: { ...step.action, capability: e.target.value as any } };
                      setEditing({ ...editing, steps: next });
                    }}
                  >
                    {["power.toggle", "power.off", "power.on", "media.volume.up", "media.volume.down", "media.mute", "system.status"].map(
                      (cap) => (
                        <option key={cap} value={cap}>
                          {cap}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditing({ ...editing, steps: editing.steps.filter((s) => s.id !== step.id) })}
                >
                  Remove
                </Button>
              </Panel>
            ))}
          </div>
          <Button onClick={saveMacro}>Save Macro</Button>
        </Panel>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
