import clsx from "classnames";
import React from "react";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "panel p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
