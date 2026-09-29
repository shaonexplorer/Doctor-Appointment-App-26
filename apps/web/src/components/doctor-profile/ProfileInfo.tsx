"use client";

import { cn } from "@/lib/utils";

export interface ProfileInfoProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}

export function ProfileInfo({ icon: Icon, label, value, className }: ProfileInfoProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs font-bold leading-5">{value}</p>
      </div>
    </div>
  );
}