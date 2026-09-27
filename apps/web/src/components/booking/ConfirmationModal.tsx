"use client";

import { cn } from "@/lib/utils";
import { Check, Clock3, X, Download, Calendar } from "lucide-react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  variant?: "confirm" | "success" | "cancel";
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
  variant = "confirm",
  title,
  description,
  appointmentId,
  appointmentDetails,
  confirmLabel,
  cancelLabel = "Close",
  showCalendarDownload = false,
  onDownloadCalendar,
  className,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const configs = {
    confirm: {
      icon: Clock3,
      iconBg: "bg-primary/10 text-primary",
      defaultTitle: "Confirm Your Appointment",
      defaultDescription: "Please review the details below before confirming your booking.",
      confirmLabel: confirmLabel || "Confirm Booking",
      confirmVariant: "primary" as const,
    },
    success: {
      icon: Check,
      iconBg: "bg-green-100 text-green-600",
      defaultTitle: "Appointment Confirmed!",
      defaultDescription: "Your appointment has been successfully booked.",
      confirmLabel: confirmLabel || "Done",
      confirmVariant: "primary" as const,
    },
    cancel: {
      icon: X,
      iconBg: "bg-red-100 text-red-600",
      defaultTitle: "Are you sure you want to cancel?",
      defaultDescription: "This action cannot be undone.",
      confirmLabel: confirmLabel || "Cancel Appointment",
      confirmVariant: "destructive" as const,
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-foreground/30 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={variant === "success" ? "success-title" : "confirm-title"}
      aria-describedby={variant === "success" ? "success-desc" : "confirm-desc"}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto grid size-12 place-items-center rounded-full mb-4">
          <div className={cn("grid size-9 place-items-center rounded-full", config.iconBg)}>
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-6">
          <h2
            id={variant === "success" ? "success-title" : "confirm-title"}
            className="text-xl font-black text-foreground"
          >
            {title || config.defaultTitle}
          </h2>
          <p
            id={variant === "success" ? "success-desc" : "confirm-desc"}
            className="mt-2 text-sm text-muted-foreground"
          >
            {description || config.defaultDescription}
          </p>
        </div>

        {/* Appointment Details (Success Variant) */}
        {variant === "success" && appointmentDetails && (
          <div className="mb-6 rounded-xl border border-border bg-background p-4">
            {appointmentId && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Appointment ID
                </span>
                <span className="font-mono text-sm font-bold text-primary">
                  {appointmentId}
                </span>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {formatDate(appointmentDetails.date)} at {formatTime(appointmentDetails.time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="font-semibold">{appointmentDetails.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clinic</p>
                  <p className="font-semibold">{appointmentDetails.clinic}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fee</p>
                  <p className="font-semibold text-primary">${appointmentDetails.fee.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details (Confirm Variant) */}
        {variant === "confirm" && appointmentDetails && (
          <div className="mb-6 rounded-xl border border-border bg-background p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Doctor
                </span>
                <span className="font-semibold">{appointmentDetails.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date & Time
                </span>
                <span className="font-semibold">
                  {formatDate(appointmentDetails.date)} at {formatTime(appointmentDetails.time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Clinic
                </span>
                <span className="font-semibold truncate text-right max-w-[180px]">
                  {appointmentDetails.clinic}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">${appointmentDetails.fee.toFixed(2)}</span>
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
              "rounded-xl px-4 py-3 text-sm font-bold transition",
              config.confirmVariant === "destructive"
                ? "border border-border bg-background text-foreground hover:bg-secondary"
                : "border border-border bg-background text-foreground hover:bg-secondary"
            )}
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-bold transition",
                config.confirmVariant === "primary"
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-destructive text-destructive-foreground hover:opacity-90"
              )}
            >
              {config.confirmLabel}
            </button>
          )}
        </div>

        {/* Calendar Download (Success Variant) */}
        {variant === "success" && showCalendarDownload && onDownloadCalendar && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onDownloadCalendar}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold hover:bg-secondary"
            >
              <Download className="size-4" aria-hidden="true" />
              Add to Calendar (.ics)
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Works with Google Calendar, Outlook, Apple Calendar
            </p>
          </div>
        )}

        {/* Next Steps (Success Variant) */}
        {variant === "success" && (
          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
            <h3 className="text-sm font-bold text-primary">What happens next?</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                <span>Reminder notifications 24h and 2h before</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                <span>Video link (if applicable) available 15 min before</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}