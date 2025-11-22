import Link from "next/link";
import { UCRDevice } from "ucr-core";
import { Panel } from "./Panel";
import { Tag } from "./Tag";
import { formatDateShort } from "ucr-core";

export function DeviceCard({ device }: { device: UCRDevice }) {
  return (
    <Link href={`/devices/${device.id}`} className="block">
      <Panel className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{device.name}</h3>
            <p className="text-xs text-slate-400">{device.address}</p>
          </div>
          <Tag label={device.kind} tone="info" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {device.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        {device.lastSeenAt && (
          <p className="text-xs text-slate-400">Last seen {formatDateShort(device.lastSeenAt)}</p>
        )}
      </Panel>
    </Link>
  );
}
