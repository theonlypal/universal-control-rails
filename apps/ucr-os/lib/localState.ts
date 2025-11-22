"use client";
import { useEffect, useState } from "react";
import { UCRMacro, UCRSession, UCRDevice } from "ucr-core";

function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (err) {
    console.error("Failed to parse local storage", err);
    return fallback;
  }
}

function setJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalSessions() {
  const [sessions, setSessions] = useState<UCRSession[]>([]);
  useEffect(() => setSessions(getJson<UCRSession[]>("ucr:sessions", [])), []);

  const save = (next: UCRSession[]) => {
    setSessions(next);
    setJson("ucr:sessions", next);
  };

  return { sessions, save };
}

export function useLocalMacros() {
  const [macros, setMacros] = useState<UCRMacro[]>([]);
  useEffect(() => setMacros(getJson<UCRMacro[]>("ucr:macros", [])), []);

  const save = (next: UCRMacro[]) => {
    setMacros(next);
    setJson("ucr:macros", next);
  };

  return { macros, save };
}

export function useCustomDevices() {
  const [devices, setDevices] = useState<UCRDevice[]>([]);
  useEffect(() => setDevices(getJson<UCRDevice[]>("ucr:customDevices", [])), []);

  const save = (next: UCRDevice[]) => {
    setDevices(next);
    setJson("ucr:customDevices", next);
  };

  return { devices, save };
}

export function clearLocalState() {
  if (typeof window === "undefined") return;
  ["ucr:sessions", "ucr:macros", "ucr:customDevices", "ucr:agentUrl"].forEach((k) => localStorage.removeItem(k));
}

export function useAgentUrl(defaultValue: string) {
  const [agentUrl, setAgentUrl] = useState<string>(defaultValue);
  useEffect(() => {
    const stored = getJson<string | null>("ucr:agentUrl", null);
    if (stored) setAgentUrl(stored);
  }, []);

  const save = (url: string) => {
    setAgentUrl(url);
    setJson("ucr:agentUrl", url);
  };

  return { agentUrl, save };
}
