import { createId, nowIso } from "./utils";

export interface UCRSession {
  id: string;
  deviceId: string;
  startedAt: string;
  lastActivityAt: string;
  status: "active" | "idle" | "closed";
}

export function createSession(deviceId: string): UCRSession {
  const now = nowIso();
  return {
    id: createId("sess"),
    deviceId,
    startedAt: now,
    lastActivityAt: now,
    status: "active",
  };
}

export function touchSession(session: UCRSession): UCRSession {
  return {
    ...session,
    lastActivityAt: nowIso(),
    status: "active",
  };
}

export function closeSession(session: UCRSession): UCRSession {
  return { ...session, status: "closed", lastActivityAt: nowIso() };
}

export function sessionIsActive(session: UCRSession): boolean {
  return session.status === "active";
}

export interface SessionStore {
  sessions: UCRSession[];
  add(session: UCRSession): void;
  update(session: UCRSession): void;
  remove(id: string): void;
  list(): UCRSession[];
}

export function createInMemorySessionStore(): SessionStore {
  const sessions: UCRSession[] = [];
  return {
    sessions,
    add(session: UCRSession) {
      sessions.push(session);
    },
    update(session: UCRSession) {
      const idx = sessions.findIndex((s) => s.id === session.id);
      if (idx >= 0) sessions[idx] = session;
    },
    remove(id: string) {
      const idx = sessions.findIndex((s) => s.id === id);
      if (idx >= 0) sessions.splice(idx, 1);
    },
    list() {
      return [...sessions];
    },
  };
}
