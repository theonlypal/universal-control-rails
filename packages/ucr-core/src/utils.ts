export function nowIso(): string {
  return new Date().toISOString();
}

export function createId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
