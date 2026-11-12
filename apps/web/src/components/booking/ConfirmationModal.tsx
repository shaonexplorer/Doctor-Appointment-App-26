'use client';

import { cn } from '@/lib/utils';
import { Check, Clock3, X, Download, Calendar } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  variant?: 'confirm' | 'success' | 'cancel';
  title?: string;
  description?: string;
  appointmentId?: string;
  appointmentDetails?: {
    doctorName: string;
    date: Date;
    time: string;
    clinic: string;
    fee: number;
  };
  confirmLabel?: string;
  cancelLabel?: string;
  showCalendarDownload?: boolean;
  onDownloadCalendar?: () => void;
  className?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  variant = 'confirm',
  title,
  description,
  appointmentId,
  appointmentDetails,
  confirmLabel,
  cancelLabel = 'Close',
  showCalendarDownload = false,
  onDownloadCalendar,
  className,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const configs = {
    confirm: {
      icon: Clock3,
      iconBg: 'bg-primary/10 text-primary',
      defaultTitle: 'Confirm Your Appointment',
      defaultDescription: 'Please review the details below before confirming your booking.',
      confirmLabel: confirmLabel || 'Confirm Booking',
      confirmVariant: 'primary' as const,
    },
    success: {
      icon: Check,
      iconBg: 'bg-green-100 text-green-600',
      defaultTitle: 'Appointment Confirmed!',
      defaultDescription: 'Your appointment has been successfully booked.',
      confirmLabel: confirmLabel || 'Done',
      confirmVariant: 'primary' as const,
    },
    cancel: {
      icon: X,
      iconBg: 'bg-red-100 text-red-600',
      defaultTitle: 'Are you sure you want to cancel?',
      defaultDescription: 'This action cannot be undone.',
      confirmLabel: confirmLabel || 'Cancel Appointment',
      confirmVariant: 'destructive' as const,
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={variant === 'success' ? 'success-title' : 'confirm-title'}
      aria-describedby={variant === 'success' ? 'success-desc' : 'confirm-desc'}
    >
      <div
        className={cn(
          'border-border bg-card animate-in fade-in zoom-in-95 w-full max-w-md rounded-2xl border p-6 shadow-2xl duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full">
          <div className={cn('grid size-9 place-items-center rounded-full', config.iconBg)}>
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6 text-center">
          <h2
            id={variant === 'success' ? 'success-title' : 'confirm-title'}
            className="text-foreground text-xl font-black"
          >
            {title || config.defaultTitle}
          </h2>
          <p
            id={variant === 'success' ? 'success-desc' : 'confirm-desc'}
            className="text-muted-foreground mt-2 text-sm"
          >
            {description || config.defaultDescription}
          </p>
        </div>

        {/* Appointment Details (Success Variant) */}
        {variant === 'success' && appointmentDetails && (
          <div className="border-border bg-background mb-6 rounded-xl border p-4">
            {appointmentId && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Appointment ID
                </span>
                <span className="text-primary font-mono text-sm font-bold">{appointmentId}</span>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date & Time</p>
                  <p className="font-semibold">
                    {formatDate(appointmentDetails.date)} at {formatTime(appointmentDetails.time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Doctor</p>
                  <p className="font-semibold">{appointmentDetails.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Clinic</p>
                  <p className="font-semibold">{appointmentDetails.clinic}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fee</p>
                  <p className="text-primary font-semibold">${appointmentDetails.fee.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details (Confirm Variant) */}
        {variant === 'confirm' && appointmentDetails && (
          <div className="border-border bg-background mb-6 rounded-xl border p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Doctor
                </span>
                <span className="font-semibold">{appointmentDetails.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Date & Time
                </span>
                <span className="font-semibold">
                  {formatDate(appointmentDetails.date)} at {formatTime(appointmentDetails.time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Clinic
                </span>
                <span className="max-w-[180px] truncate text-right font-semibold">
                  {appointmentDetails.clinic}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-t pt-3">
                <span className="font-semibold">Total</span>
                <span className="text-primary font-bold">${appointmentDetails.fee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-bold transition',
              config.confirmVariant === 'destructive'
                ? 'border-border bg-background text-foreground hover:bg-secondary border'
                : 'border-border bg-background text-foreground hover:bg-secondary border'
            )}
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                'rounded-xl px-4 py-3 text-sm font-bold transition',
                config.confirmVariant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-destructive text-destructive-foreground hover:opacity-90'
              )}
            >
              {config.confirmLabel}
            </button>
          )}
        </div>

        {/* Calendar Download (Success Variant) */}
        {variant === 'success' && showCalendarDownload && onDownloadCalendar && (
          <div className="border-border mt-4 border-t pt-4">
            <button
              type="button"
              onClick={onDownloadCalendar}
              className="border-border hover:bg-secondary flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold"
            >
              <Download className="size-4" aria-hidden="true" />
              Add to Calendar (.ics)
            </button>
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Works with Google Calendar, Outlook, Apple Calendar
            </p>
          </div>
        )}

        {/* Next Steps (Success Variant) */}
        {variant === 'success' && (
          <div className="bg-primary/5 border-primary/20 mt-4 rounded-xl border p-4">
            <h3 className="text-primary text-sm font-bold">What happens next?</h3>
            <ul className="text-muted-foreground mt-2 space-y-1.5 text-xs">
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>Reminder notifications 24h and 2h before</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>Video link (if applicable) available 15 min before</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
