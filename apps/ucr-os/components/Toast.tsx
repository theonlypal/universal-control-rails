"use client";
import { useEffect, useState } from "react";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const id = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2500);
    return () => clearTimeout(id);
  }, [onClose]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-24 inset-x-0 flex justify-center z-50">
      <div className="bg-slate-900/80 text-slate-50 px-4 py-2 rounded-full border border-white/10 shadow-panel">
        {message}
      </div>
    </div>
  );
}
