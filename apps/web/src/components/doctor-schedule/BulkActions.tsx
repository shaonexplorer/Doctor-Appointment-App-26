import { Trash2, ShieldAlert } from 'lucide-react';

interface BulkActionsProps {
  selected: string[];
  onDelete: () => void;
  onToggleBlocked: () => void;
  blocked: boolean;
}

export function BulkActions({ selected, onDelete, onToggleBlocked, blocked }: BulkActionsProps) {
  const summary = `${selected.length} slot${selected.length === 1 ? '' : 's'} selected`;

  return (
    <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm">
      <div>
        <p className="text-sm font-bold">Bulk actions</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {summary}. Select available slots to edit or remove them.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          disabled={!selected.length}
          onClick={onDelete}
          className="flex items-center gap-2 rounded-xl border border-[#f0ccc5] px-3 py-2 text-xs font-bold text-[#bd7165] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
        <button
          onClick={onToggleBlocked}
          className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"
        >
          <ShieldAlert className="text-primary size-4" />
          {blocked ? 'Unblock time' : 'Block time'}
        </button>
      </div>
    </div>
  );
}
