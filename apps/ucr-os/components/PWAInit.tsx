"use client";
import { useEffect } from "react";

export function PWAInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(console.error);
    }
  }, []);
  return null;
}
