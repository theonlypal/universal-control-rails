"use client";
import clsx from "classnames";
import React from "react";

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-slate-100 shadow-panel",
        className
      )}
      {...props}
    />
  );
}
