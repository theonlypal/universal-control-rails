import Link from "next/link";
import { UCRSession, formatDateShort } from "ucr-core";
import { Panel } from "./Panel";
import { Tag } from "./Tag";
import { Button } from "./Button";

interface Props {
  session: UCRSession;
  onClose: (id: string) => void;
}

export function SessionCard({ session, onClose }: Props) {
  return (
    <Panel className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Session {session.id}</h3>
          <p className="text-xs text-slate-400">Device {session.deviceId}</p>
        </div>
        <Tag label={session.status} tone={session.status === "active" ? "success" : "default"} />
      </div>
      <p className="text-xs text-slate-400">Started {formatDateShort(session.startedAt)}</p>
      <p className="text-xs text-slate-400">Last activity {formatDateShort(session.lastActivityAt)}</p>
      <div className="flex gap-2">
        <Link href={`/devices/${session.deviceId}`} className="w-full">
          <Button className="w-full" variant="ghost">
            Open Panel
          </Button>
        </Link>
        <Button className="w-full" variant="outline" onClick={() => onClose(session.id)}>
          Close
        </Button>
      </div>
    </Panel>
  );
}
