import clsx from "classnames";

export function Tag({ label, tone = "default" }: { label: string; tone?: "default" | "info" | "success" }) {
  const styles: Record<typeof tone, string> = {
    default: "bg-white/10 text-slate-200",
    info: "bg-accent-primary/20 text-accent-primary",
    success: "bg-emerald-400/20 text-emerald-200",
  };
  return <span className={clsx("px-2 py-1 rounded-full text-xs font-semibold", styles[tone])}>{label}</span>;
}
