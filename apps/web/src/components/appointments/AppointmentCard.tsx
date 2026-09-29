'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, Check, Download, Clock3 } from 'lucide-react';

export interface AppointmentCardProps {
  appointment: {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    clinic: string;
    status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Scheduled';
    payment: 'Pending' | 'Paid' | 'Refunded';
    symptoms: string;
    prescription?: string;
    consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  };
  onView: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onDownloadPrescription?: () => void;
  onNotice?: (message: string) => void;
  className?: string;
}

export function AppointmentCard({
  appointment,
  onView,
  onCancel,
  onReschedule: _onReschedule,
  onDownloadPrescription,
  onNotice: _onNotice,
  className,
}: AppointmentCardProps) {
  const statusConfig = {
    Confirmed: { bg: 'bg-[#e9f8f3]', text: 'text-[#218765]', icon: Check },
    Completed: { bg: 'bg-[#eaf1ff]', text: 'text-primary', icon: Check },
    Cancelled: { bg: 'bg-[#fff2ef]', text: 'text-[#b86f63]', icon: Clock3 },
    Scheduled: { bg: 'bg-[#eaf1ff]', text: 'text-primary', icon: CalendarDays },
  };

  const paymentConfig = {
    Pending: { text: 'text-foreground' },
    Paid: { text: 'text-[#218765]' },
    Refunded: { text: 'text-[#218765]' },
  };

  const StatusConfig = statusConfig[appointment.status] || statusConfig.Scheduled;
  const PaymentConfig = paymentConfig[appointment.payment] || paymentConfig.Pending;

  const StatusIcon = StatusConfig.icon;

  return (
    <article
      className={cn(
        'border-border hover:border-primary/40 rounded-2xl border p-4 transition hover:shadow-sm sm:p-5',
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="text-primary grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf1ff]">
            <CalendarDays className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-bold">{appointment.doctor}</h3>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-bold',
                  StatusConfig.bg,
                  StatusConfig.text
                )}
              >
                <StatusIcon className="mr-1 inline size-3" aria-hidden="true" />
                {appointment.status}
              </span>
            </div>
            <p className="text-primary mt-1 text-xs font-semibold">{appointment.specialty}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {appointment.date} &middot; {appointment.time}
            </p>
            <p className="text-muted-foreground mt-1 truncate text-xs">{appointment.clinic}</p>
          </div>
        </div>

        <div className="border-border flex items-center gap-3 border-t pt-3 lg:border-t-0 lg:pt-0">
          <div className="min-w-24">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Payment
            </p>
            <p className={cn('mt-1 text-xs font-bold', PaymentConfig.text)}>
              {appointment.payment}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onView}
              className="border-border hover:bg-secondary rounded-lg border px-3 py-2 text-xs font-bold"
            >
              {appointment.status === 'Completed' ? 'View details' : 'View'}
            </button>

            {appointment.status === 'Confirmed' || appointment.status === 'Scheduled' ? (
              <>
                {/* {onReschedule && (
                  <button
                    type="button"
                    onClick={onReschedule}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-secondary"
                  >
                    Reschedule
                  </button>
                )} */}
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-[#efd3ce] px-3 py-2 text-xs font-bold text-[#b86f63] hover:bg-[#fff8f6]"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : null}

            {appointment.status === 'Completed' && (
              <button
                type="button"
                onClick={onDownloadPrescription}
                className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-bold hover:opacity-90"
              >
                <Download className="mr-1 inline size-3" aria-hidden="true" />
                Prescription
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
