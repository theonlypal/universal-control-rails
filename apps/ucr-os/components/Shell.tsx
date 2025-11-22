import Link from "next/link";
import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Panel } from "./Panel";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-primary">Universal Control Rails</p>
            <h1 className="text-xl font-bold text-slate-50">UCR OS</h1>
          </div>
          <Link href="/devices" className="text-sm text-slate-200 hover:text-accent-primary">
            Devices ↗
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">{children}</main>
      <BottomNav />
    </div>
  );
}
