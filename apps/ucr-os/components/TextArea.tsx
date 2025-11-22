"use client";
import React from "react";
import clsx from "classnames";

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent-primary",
        className
      )}
      {...props}
    />
  );
}
