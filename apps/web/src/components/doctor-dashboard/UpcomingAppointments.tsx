'use client';

import { cn } from '@/lib/utils';
import { Play, UserRound, RefreshCw, AlertCircle } from 'lucide-react';
import { EmptyAppointmentsState } from '@/components/doctors/EmptyState';
import { useDoctorAppointments } from '@/hooks/useDoctorAppointments';
import { useRouter } from 'next/navigation';

export interface UpcomingAppointmentsProps {
  onAction?: (action: string, patient: string) => void;
  onViewFullSchedule?: () => void;
}

export function UpcomingAppointments({ onAction, onViewFullSchedule }: UpcomingAppointmentsProps) {
  // Use the dedicated TanStack Query hook for doctor appointments
  const {
    data: appointmentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorAppointments({
    status: ['SCHEDULED'],
    sortBy: 'slot.startTime',
    sortOrder: 'asc',
    limit: 10,
  });

  const router = useRouter();

  const handleStartConsultation = (appointmentId: string) => {
    router.push(`/doctor/consultation/${appointmentId}`);
    onAction?.('Start consultation', '');
  };

  const handleViewPatient = (patientName: string) => {
    router.push('/doctor/patients');
    onAction?.('View patient', patientName);
  };

  // Transform backend appointments data to the UI format expected by the table
  const appointments = appointmentsData?.data
    ? appointmentsData.data.map((appt) => {
        // appt is already transformed by the hook's select option, or we can transform it if needed
        // Let's verify what useDoctorAppointments returns. The hook transforms via transformDoctorAppointmentToUI.
        return {
          id: appt.id,
          time: appt.time,
          patient: appt.patient,
          type: appt.consultationType === 'VIDEO' ? 'Video consultation' : 'Follow-up',
          status:
            appt.status === 'Cancelled'
              ? ('Cancelled' as const)
              : appt.status === 'Checked in' || appt.status === 'Completed'
                ? ('Confirmed' as const)
                : ('Waiting' as const),
          payment: appt.payment === 'Paid' ? ('Paid' as const) : ('Pending' as const),
        };
      })
    : [];

  if (isLoading) {
    return (
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Upcoming appointments</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your clinic schedule for today</p>
          </div>
          <div className="bg-muted h-8 w-28 animate-pulse rounded-xl" />
        </div>
        <div className="mt-5 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-14 w-full animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Upcoming appointments</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your clinic schedule for today</p>
          </div>
          <button
            onClick={() => refetch()}
            className="border-border hover:bg-secondary flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        </div>
        <div className="border-destructive/20 bg-destructive/5 mt-6 flex flex-col items-center justify-center rounded-xl border p-6 text-center">
          <AlertCircle className="text-destructive mb-2 size-8" />
          <p className="text-destructive text-sm font-semibold">
            Failed to load upcoming appointments
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {error instanceof Error ? error.message : 'Please check your connection'}
          </p>
        </div>
      </section>
    );
  }

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            title="Refresh appointments"
            className="border-border hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl border p-2 text-xs font-bold"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            onClick={onViewFullSchedule}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2 text-xs font-bold"
          >
            View full schedule
          </button>
        </div>
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
              <tr key={item.id || item.time} className="border-border/70 border-b last:border-0">
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
                      onClick={() => handleStartConsultation(item.id)}
                      aria-label={`Start consultation for ${item.patient}`}
                      className="text-primary hover:bg-primary/10 rounded-lg p-2"
                    >
                      <Play className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleViewPatient(item.patient)}
                      aria-label={`View patient ${item.patient}`}
                      className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                    >
                      <UserRound className="size-4" aria-hidden="true" />
                    </button>
                    {/* <button
                      onClick={() => handleAction('More options', item.patient)}
                      aria-label={`More options for ${item.patient}`}
                      className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                    >
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                    </button> */}
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
