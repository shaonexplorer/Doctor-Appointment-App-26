import { Clock3 } from 'lucide-react';

export function ScheduleLegend() {
  return (
    <div className="border-border text-muted-foreground mt-6 flex flex-wrap items-center gap-4 border-t pt-4 text-[11px] font-bold">
      <span className="flex items-center gap-2">
        <i className="size-2.5 rounded-full bg-[#69b899]" />
        Available
      </span>
      <span className="flex items-center gap-2">
        <i className="bg-primary size-2.5 rounded-full" />
        Booked
      </span>
      <span className="flex items-center gap-2">
        <i className="size-2.5 rounded-full bg-[#e49b8e]" />
        Cancelled
      </span>
      <span className="ml-auto flex items-center gap-2">
        <Clock3 className="size-3.5" />
        Timezone: Asia/Kolkata
      </span>
    </div>
  );
}
