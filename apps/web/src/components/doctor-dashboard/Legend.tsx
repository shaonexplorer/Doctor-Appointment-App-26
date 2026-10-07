'use client';

export interface LegendProps {
  color: string;
  label: string;
}

export function Legend({ color, label }: LegendProps) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
