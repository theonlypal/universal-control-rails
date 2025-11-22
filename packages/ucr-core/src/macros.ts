import { UCRAction, UCRActionResult } from "./types";
import { createId } from "./utils";

export interface UCRMacroStep {
  id: string;
  label: string;
  action: UCRAction;
  delayMs?: number;
}

export interface UCRMacro {
  id: string;
  name: string;
  description?: string;
  steps: UCRMacroStep[];
  tags: string[];
}

export function describeMacro(macro: UCRMacro): string {
  const steps = macro.steps
    .map((s, idx) => `${idx + 1}. ${s.label} -> ${s.action.capability}`)
    .join(" | ");
  return `${macro.name}: ${steps}`;
}

export function validateMacro(macro: UCRMacro): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!macro.name) errors.push("Macro name is required");
  if (!macro.steps || !macro.steps.length) errors.push("At least one step required");
  macro.steps.forEach((step, idx) => {
    if (!step.action.deviceId) errors.push(`Step ${idx + 1} missing deviceId`);
    if (!step.action.capability) errors.push(`Step ${idx + 1} missing capability`);
  });
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}

export async function runMacroSequential(
  macro: UCRMacro,
  runAction: (action: UCRAction) => Promise<UCRActionResult>
): Promise<UCRActionResult[]> {
  const results: UCRActionResult[] = [];
  for (const step of macro.steps) {
    // eslint-disable-next-line no-await-in-loop
    const result = await runAction(step.action);
    results.push(result);
    if (step.delayMs) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, step.delayMs));
    }
  }
  return results;
}

export function createMacro(name: string, steps: UCRMacroStep[], description?: string, tags: string[] = []): UCRMacro {
  return {
    id: createId("macro"),
    name,
    description,
    steps,
    tags,
  };
}

export function createMacroStep(label: string, action: UCRAction, delayMs?: number): UCRMacroStep {
  return {
    id: createId("step"),
    label,
    action,
    delayMs,
  };
}
