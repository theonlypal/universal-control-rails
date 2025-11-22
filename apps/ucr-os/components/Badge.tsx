export function Badge({ label }: { label: string }) {
  return <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-slate-100">{label}</span>;
}
