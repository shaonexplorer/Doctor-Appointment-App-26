'use client';

import { cn } from '@/lib/utils';
import { Play, UserRound, MoreHorizontal } from 'lucide-react';
import { EmptyAppointmentsState } from '@/components/doctors/EmptyState';

export interface Appointment {
  time: string;
  patient: string;
  type: string;
  status: 'Confirmed' | 'Waiting' | 'Cancelled';
  payment: 'Paid' | 'Pending';
}

export interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onAction?: (action: string, patient: string) => void;
  onViewFullSchedule?: () => void;
}

export function UpcomingAppointments({
  appointments,
  onAction,
  onViewFullSchedule,
}: UpcomingAppointmentsProps) {
  const handleAction = (action: string, patient: string) => {
    onAction?.(action, patient);
  };

  // Show empty state when no appointments
  if (appointments.length === 0) {
    return (
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Upcoming appointments</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your clinic schedule for today</p>
          </div>
          <button
            onClick={onViewFullSchedule}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2 text-xs font-bold"
          >
            View full schedule
          </button>
        </div>
        <EmptyAppointmentsState tab="Upcoming" onBook={onViewFullSchedule} />
      </section>
    );
  }

  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold">Upcoming appointments</h2>
          <p className="text-muted-foreground mt-1 text-xs">Your clinic schedule for today</p>
        </div>
        <button
          onClick={onViewFullSchedule}
          className="border-border hover:bg-secondary rounded-xl border px-3 py-2 text-xs font-bold"
        >
          View full schedule
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-[10px] tracking-wider uppercase">
              <th className="pb-3">Time</th>
              <th className="pb-3">Patient</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.time} className="border-border/70 border-b last:border-0">
                <td className="text-primary py-4 font-bold">{item.time}</td>
                <td className="py-4 font-bold">{item.patient}</td>
                <td className="text-muted-foreground py-4">{item.type}</td>
                <td className="py-4">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-bold',
                      item.status === 'Waiting'
                        ? 'bg-[#fff3e7] text-[#bd7b31]'
                        : item.status === 'Cancelled'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-[#e9f8f3] text-[#258c70]'
                    )}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={cn(
                      'text-xs font-bold',
                      item.payment === 'Paid' ? 'text-[#258c70]' : 'text-[#bd7b31]'
                    )}
                  >
                    {item.payment}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleAction('Start consultation', item.patient)}
                      aria-label={`Start consultation for ${item.patient}`}
                      className="text-primary hover:bg-primary/10 rounded-lg p-2"
                    >
                      <Play className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleAction('View patient', item.patient)}
                      aria-label={`View patient ${item.patient}`}
                      className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                    >
                      <UserRound className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleAction('More options', item.patient)}
                      aria-label={`More options for ${item.patient}`}
                      className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                    >
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
