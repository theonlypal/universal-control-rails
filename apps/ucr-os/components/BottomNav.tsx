"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "classnames";

const links = [
  { href: "/", label: "Control", icon: "⚡" },
  { href: "/devices", label: "Devices", icon: "📡" },
  { href: "/sessions", label: "Sessions", icon: "🛰️" },
  { href: "/macros", label: "Macros", icon: "🎛️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-md border-t border-white/10 z-50">
      <div className="grid grid-cols-5 text-center text-xs text-slate-200">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx("py-3 flex flex-col items-center gap-1", active && "text-accent-primary")}
            >
              <span aria-hidden>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
