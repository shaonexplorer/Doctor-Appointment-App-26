'use client';

import { cn } from '@/lib/utils';
import { Clock3, ShieldCheck } from 'lucide-react';

export interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointment: {
    id: string;
    doctor: string;
    date: string;
    time: string;
    clinic: string;
    status: string;
    payment: string;
    refundEligible?: boolean;
    hoursUntilAppointment?: number;
  };
  isLoading?: boolean;
  className?: string;
}

export function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isLoading = false,
  className,
}: CancelModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isWithinTwoHours =
    appointment.hoursUntilAppointment !== undefined && appointment.hoursUntilAppointment < 2;
  const refundEligible = appointment.refundEligible !== false && !isWithinTwoHours;

  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-5"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      aria-describedby="cancel-desc"
    >
      <div
        className={cn(
          'border-border bg-card animate-in fade-in zoom-in-95 w-full max-w-md rounded-2xl border p-6 shadow-2xl duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-5 grid size-11 place-items-center rounded-full bg-[#fff2ef] text-[#b86f63]">
          <Clock3 className="size-5" aria-hidden="true" />
        </div>

        {/* Title & Description */}
        <div className="mb-5 text-center">
          <h2 id="cancel-title" className="text-xl font-black">
            Are you sure you want to cancel this appointment?
          </h2>
          <p id="cancel-desc" className="text-muted-foreground mt-2 text-sm">
            {appointment.doctor} &middot; {formatDate(appointment.date)} at{' '}
            {formatTime(appointment.time)}
          </p>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-5 rounded-xl border border-[#f1d8a9] bg-[#fff9ed] p-4 text-xs leading-5 text-[#91651f]">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 mr-2 inline size-4 shrink-0" aria-hidden="true" />
            <div>
              <strong>Cancellation policy:</strong> Cancellations more than 24 hours before the
              visit are eligible for a full refund. Your current refund status is{' '}
              <strong>{refundEligible ? 'Eligible' : 'Not eligible'}</strong>.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-border hover:bg-secondary rounded-xl border px-4 py-3 text-sm font-bold"
          >
            Keep appointment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-bold text-white transition',
              isLoading ? 'cursor-wait bg-[#b86f63] opacity-70' : 'bg-[#b86f63] hover:bg-[#a05a52]'
            )}
          >
            {isLoading ? 'Cancelling...' : 'Cancel appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}
