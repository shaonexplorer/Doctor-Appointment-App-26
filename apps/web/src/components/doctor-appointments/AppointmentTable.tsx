'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, Check, Clock3, MoreHorizontal, Phone, Video } from 'lucide-react';
import type { AppointmentTableProps, DoctorAppointment } from './types';

function getStatusConfig(status: DoctorAppointment['status']) {
  switch (status) {
    case 'Confirmed':
      return { bg: 'bg-[#e9f8f3]', text: 'text-[#218765]', icon: Check };
    case 'Checked in':
      return { bg: 'bg-[#eaf1ff]', text: 'text-primary', icon: Clock3 };
    case 'Completed':
      return { bg: 'bg-[#eaf1ff]', text: 'text-primary', icon: Check };
    case 'Cancelled':
      return { bg: 'bg-[#fff2ef]', text: 'text-[#b86f63]', icon: Clock3 };
    case 'No-show':
      return { bg: 'bg-[#fff2ef]', text: 'text-[#b86f63]', icon: Clock3 };
    default:
      return { bg: 'bg-secondary', text: 'text-muted-foreground', icon: Clock3 };
  }
}

function getConsultationIcon(type: DoctorAppointment['consultationType']) {
  switch (type) {
    case 'VIDEO':
      return Video;
    case 'PHONE':
      return Phone;
    default:
      return CalendarDays;
  }
}

export function AppointmentTable({
  appointments,
  onView,
  onStartConsultation,
  onReschedule,
  className,
}: AppointmentTableProps) {
  return (
    <div
      className={cn(
        'border-border bg-card overflow-hidden rounded-2xl border shadow-sm',
        className
      )}
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-border bg-secondary/60 text-muted-foreground border-b text-[10px] tracking-wider uppercase">
            <tr>
              {['Patient', 'Appointment time', 'Symptoms', 'Status', 'Payment', 'Actions'].map(
                (head) => (
                  <th key={head} className="px-5 py-4 font-bold">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-border border-b last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-primary grid size-9 place-items-center rounded-full bg-[#dce8ff] text-xs font-bold">
                      {appointment.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{appointment.patient}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {appointment.specialty} patient
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold">{appointment.date}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <CalendarDays className="text-primary size-3" aria-hidden="true" />
                    <p className="text-primary text-xs">{appointment.time}</p>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    {(() => {
                      const Icon = getConsultationIcon(appointment.consultationType);
                      return <Icon className="text-muted-foreground size-3" aria-hidden="true" />;
                    })()}
                    <span className="text-muted-foreground text-[10px] capitalize">
                      {appointment.consultationType.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="text-muted-foreground max-w-[220px] px-5 py-4 text-xs">
                  {appointment.symptoms}
                </td>
                <td className="px-5 py-4">
                  {(() => {
                    const config = getStatusConfig(appointment.status);
                    const StatusIcon = config.icon;
                    return (
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[10px] font-bold',
                          config.bg,
                          config.text
                        )}
                      >
                        <StatusIcon className="mr-1 inline size-3" aria-hidden="true" />
                        {appointment.status}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-5 py-4 text-xs font-bold">{appointment.payment}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(appointment)}
                      className="border-border hover:bg-secondary rounded-lg border px-2.5 py-1.5 text-[10px] font-bold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onStartConsultation(appointment)}
                      disabled={
                        appointment.status === 'Completed' || appointment.status === 'Cancelled'
                      }
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-[10px] font-bold',
                        appointment.status === 'Completed' || appointment.status === 'Cancelled'
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      Start
                    </button>
                    <button
                      onClick={() => onReschedule(appointment)}
                      aria-label={`More actions for ${appointment.patient}`}
                      className="hover:bg-secondary rounded-lg p-1.5"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-3 p-4 md:hidden">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="border-border rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary grid size-9 place-items-center rounded-full bg-[#dce8ff] text-xs font-bold">
                  {appointment.initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{appointment.patient}</p>
                  <p className="text-primary text-xs">{appointment.time}</p>
                </div>
              </div>
              {(() => {
                const config = getStatusConfig(appointment.status);
                const StatusIcon = config.icon;
                return (
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-[10px] font-bold',
                      config.bg,
                      config.text
                    )}
                  >
                    <StatusIcon className="mr-1 inline size-3" aria-hidden="true" />
                    {appointment.status}
                  </span>
                );
              })()}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">{appointment.symptoms}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onView(appointment)}
                className="border-border flex-1 rounded-lg border py-2 text-xs font-bold"
              >
                View
              </button>
              <button
                onClick={() => onStartConsultation(appointment)}
                disabled={appointment.status === 'Completed' || appointment.status === 'Cancelled'}
                className={cn(
                  'flex-1 rounded-lg py-2 text-xs font-bold',
                  appointment.status === 'Completed' || appointment.status === 'Cancelled'
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                Start consultation
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
