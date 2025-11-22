"use client";
import clsx from "classnames";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" };

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition shadow-panel text-sm flex items-center justify-center gap-2";
  const variants: Record<typeof variant, string> = {
    primary: "bg-gradient-to-r from-accent-primary to-accent-secondary text-slate-900 hover:opacity-90",
    ghost: "bg-white/5 text-slate-100 hover:bg-white/10",
    outline: "border border-white/20 text-slate-100 hover:border-accent-primary",
  } as const;

  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
