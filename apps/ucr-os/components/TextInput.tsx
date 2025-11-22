"use client";
import React from "react";
import clsx from "classnames";

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent-primary",
        className
      )}
      {...props}
    />
  );
}
