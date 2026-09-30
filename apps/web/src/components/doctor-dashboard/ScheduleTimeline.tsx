'use client';

import { cn } from '@/lib/utils';

export interface Appointment {
  time: string;
  patient: string;
  type: string;
  status: 'Confirmed' | 'Waiting' | 'Cancelled';
}

export interface ScheduleTimelineProps {
  appointments: Appointment[];
}

export function ScheduleTimeline({ appointments }: ScheduleTimelineProps) {
  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <h2 className="font-bold">Today&apos;s schedule</h2>
      <p className="text-muted-foreground mt-1 text-xs">A visual timeline of your clinic day</p>
      <div className="mt-5 space-y-1">
        {appointments.map((item, index) => (
          <div key={item.time} className="flex gap-3">
            <div className="text-muted-foreground w-16 pt-3 text-right text-[10px] font-bold">
              {item.time}
            </div>
            <div className="border-border relative flex flex-1 gap-3 border-l pb-4 pl-4">
              <span
                className={cn(
                  'border-card absolute top-3 -left-1.5 size-2.5 rounded-full border-2',
                  index === 1 ? 'bg-[#d68b42]' : 'bg-primary'
                )}
              />
              <div className="bg-secondary w-full rounded-xl px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">{item.patient}</p>
                  <span className="text-muted-foreground text-[10px]">{item.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
