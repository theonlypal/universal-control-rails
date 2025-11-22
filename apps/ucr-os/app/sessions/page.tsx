"use client";
import { useLocalSessions } from "@/lib/localState";
import { SessionCard } from "@/components/SessionCard";

export default function SessionsPage() {
  const { sessions, save } = useLocalSessions();
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Sessions</h2>
      {sessions.length === 0 && <p className="text-sm text-slate-400">No active sessions.</p>}
      <div className="space-y-3">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onClose={(id) => save(sessions.filter((s) => s.id !== id))} />
        ))}
      </div>
    </div>
  );
}
