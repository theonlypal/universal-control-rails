import { UCRMacro, describeMacro } from "ucr-core";
import { Panel } from "./Panel";
import { Tag } from "./Tag";
import { Button } from "./Button";

interface Props {
  macro: UCRMacro;
  onRun: () => void;
  onEdit: () => void;
}

export function MacroCard({ macro, onRun, onEdit }: Props) {
  return (
    <Panel className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{macro.name}</h3>
          <p className="text-xs text-slate-400">{macro.description || describeMacro(macro)}</p>
        </div>
        <div className="flex gap-1">
          {macro.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" onClick={onRun}>
          Run
        </Button>
        <Button variant="outline" className="w-full" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </Panel>
  );
}
