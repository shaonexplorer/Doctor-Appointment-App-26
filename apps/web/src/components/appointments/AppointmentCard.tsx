"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Check, Download, Clock3 } from "lucide-react";

export interface AppointmentCardProps {
  appointment: {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    clinic: string;
    status: "Confirmed" | "Completed" | "Cancelled" | "Scheduled";
    payment: "Pending" | "Paid" | "Refunded";
    symptoms: string;
    prescription?: string;
    consultationType: "IN_PERSON" | "VIDEO" | "PHONE";
  };
  onView: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onDownloadPrescription?: () => void;
  className?: string;
}

export function AppointmentCard({
  appointment,
  onView,
  onCancel,
  onReschedule,
  onDownloadPrescription,
  className,
}: AppointmentCardProps) {
  const statusConfig = {
    Confirmed: { bg: "bg-green-100", text: "text-green-700", icon: Check },
    Completed: { bg: "bg-blue-100", text: "text-blue-700", icon: Check },
    Cancelled: { bg: "bg-orange-100", text: "text-orange-700", icon: Clock3 },
    Scheduled: { bg: "bg-blue-100", text: "text-blue-700", icon: CalendarDays },
  };

  const paymentConfig = {
    Pending: { text: "text-foreground" },
    Paid: { text: "text-green-700" },
    Refunded: { text: "text-green-700" },
  };

  const StatusConfig = statusConfig[appointment.status] || statusConfig.Scheduled;
  const PaymentConfig = paymentConfig[appointment.payment] || paymentConfig.Pending;

  const StatusIcon = StatusConfig.icon;

  return (
    <article
      className={cn(
        "rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:shadow-sm sm:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-primary">
            <CalendarDays className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold truncate">{appointment.doctor}</h3>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-bold",
                  StatusConfig.bg,
                  StatusConfig.text
                )}
              >
                <StatusIcon className="inline size-3 mr-1" aria-hidden="true" />
                {appointment.status}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-primary">{appointment.specialty}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {appointment.date} · {appointment.time}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{appointment.clinic}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
          <div className="min-w-24">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment
            </p>
            <p className={cn("mt-1 text-xs font-bold", PaymentConfig.text)}>
              {appointment.payment}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onView}
              className="rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-secondary"
            >
              {appointment.status === "Completed" ? "View details" : "View"}
            </button>

            {appointment.status === "Confirmed" || appointment.status === "Scheduled" ? (
              <>
                {onReschedule && (
                  <button
                    type="button"
                    onClick={onReschedule}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-secondary"
                  >
                    Reschedule
                  </button>
                )}
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : null}

            {appointment.status === "Completed" && (
              <button
                type="button"
                onClick={onDownloadPrescription}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
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