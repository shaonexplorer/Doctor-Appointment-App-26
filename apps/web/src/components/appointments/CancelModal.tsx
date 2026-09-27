"use client";

import { cn } from "@/lib/utils";
import { Clock3, ShieldCheck } from "lucide-react";

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
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isWithinTwoHours = appointment.hoursUntilAppointment !== undefined && appointment.hoursUntilAppointment < 2;
  const refundEligible = appointment.refundEligible !== false && !isWithinTwoHours;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-foreground/30 p-4"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      aria-describedby="cancel-desc"
    >
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto grid size-11 place-items-center rounded-full mb-4">
          <div className="grid size-9 place-items-center rounded-full bg-orange-100 text-orange-600">
            <Clock3 className="size-5" aria-hidden="true" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-4">
          <h2 id="cancel-title" className="text-xl font-black text-foreground">
            Are you sure you want to cancel this appointment?
          </h2>
          <p id="cancel-desc" className="mt-2 text-sm text-muted-foreground">
            {appointment.doctor} · {formatDate(appointment.date)} at {formatTime(appointment.time)}
          </p>
        </div>

        {/* Appointment Details */}
        <div className="mb-4 rounded-xl border border-border bg-background p-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Doctor</span>
              <span className="font-semibold">{appointment.doctor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-semibold">{formatDate(appointment.date)} at {formatTime(appointment.time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clinic</span>
              <span className="font-semibold truncate max-w-[160px] text-right">{appointment.clinic}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold">Current Status</span>
              <span className="font-semibold">{appointment.status}</span>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
            <div className="text-xs leading-5 text-amber-800">
              <strong>Cancellation Policy:</strong> Cancellations more than 2 hours before the visit are eligible for a full refund.
              {isWithinTwoHours ? (
                <span className="text-red-700 font-semibold ml-1">Your appointment is within 2 hours - cancellation not allowed.</span>
              ) : refundEligible ? (
                <span className="text-green-700 font-semibold ml-1">Your current refund status is Eligible.</span>
              ) : (
                <span className="text-amber-700 font-semibold ml-1">Refund eligibility depends on clinic policy.</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-border px-4 py-3 text-sm font-bold hover:bg-secondary disabled:opacity-50"
          >
            Keep appointment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || isWithinTwoHours}
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-50",
              isWithinTwoHours
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {isLoading ? "Cancelling..." : "Cancel appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}