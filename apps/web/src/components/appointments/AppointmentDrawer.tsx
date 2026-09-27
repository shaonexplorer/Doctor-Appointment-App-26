"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, Download, FileText, MapPin, ShieldCheck, Stethoscope, Video, X } from "lucide-react";

export interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
    doctorAvatar?: string;
    doctorRating?: number;
    timeline?: Array<{
      event: string;
      completed: boolean;
      current?: boolean;
    }>;
  };
  onNotice?: (message: string) => void;
  className?: string;
}

export function AppointmentDrawer({
  isOpen,
  onClose,
  appointment,
  onNotice,
  className,
}: AppointmentDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const consultationTypeLabels = {
    IN_PERSON: "In-person visit",
    VIDEO: "Video visit",
    PHONE: "Phone consultation",
  };

  const consultationTypeIcons = {
    IN_PERSON: MapPin,
    VIDEO: Video,
    PHONE: Stethoscope,
  };

  const defaultTimeline = [
    { event: "Appointment requested", completed: true, current: false },
    { event: "Payment status verified", completed: true, current: false },
    {
      event: appointment.status === "Completed" ? "Visit completed" : "Appointment confirmed",
      completed: appointment.status === "Completed",
      current: appointment.status !== "Completed",
    },
  ];

  const timeline = appointment.timeline || defaultTimeline;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-foreground/20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Appointment details"
    >
      <aside
        className={cn(
          "h-full w-full max-w-xl overflow-y-auto border-l border-border bg-card p-6 shadow-2xl sm:p-8",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-primary">Appointment details</p>
            <h2 className="mt-2 text-2xl font-black">{appointment.doctor}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {appointment.specialty} &middot; {appointment.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Close details"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={CalendarDays} label="Date & time" value={`${formatDate(appointment.date)} &middot; ${formatTime(appointment.time)}`} />
          <InfoCard icon={MapPin} label="Clinic" value={appointment.clinic} />
          <InfoCard
            icon={consultationTypeIcons[appointment.consultationType] || Stethoscope}
            label="Visit type"
            value={consultationTypeLabels[appointment.consultationType]}
          />
          <InfoCard
            icon={CalendarDays}
            label="Appointment status"
            value={
              <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", getStatusColors(appointment.status))}>
                {appointment.status}
              </span>
            }
          />
          <InfoCard
            icon={ShieldCheck}
            label="Payment status"
            value={
              <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", getPaymentColors(appointment.payment))}>
                {appointment.payment}
              </span>
            }
          />
        </div>

        {/* Symptoms Section */}
        <Section title="Patient symptoms">
          <p className="text-sm leading-6 text-muted-foreground">{appointment.symptoms || "Not specified"}</p>
        </Section>

        {/* Doctor Information */}
        <Section title="Doctor information">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-[#dce8ff] text-sm font-black text-primary">
              {appointment.doctorAvatar ? (
                <img src={appointment.doctorAvatar} alt="" className="size-full rounded-full object-cover" />
              ) : (
                <Stethoscope className="size-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-black">{appointment.doctor}</p>
              <p className="text-xs text-muted-foreground">
                Verified {appointment.specialty} specialist &middot; 4.9 rating
              </p>
            </div>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <div className="flex flex-col gap-4">
            {timeline.map((item) => (
              <div key={item.event} className="flex items-center gap-3 text-sm">
                <div
                  className={cn(
                    "grid size-7 place-items-center rounded-full",
                    item.current ? "bg-primary text-primary-foreground" : item.completed ? "bg-secondary text-primary" : "bg-secondary text-primary"
                  )}
                >
                  <Check className="size-3" aria-hidden="true" />
                </div>
                <span className={cn("font-bold", item.current ? "text-primary" : "text-foreground")}>
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Prescription */}
        {appointment.prescription && (
          <Section title="Prescription">
            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" aria-hidden="true" />
                <span className="text-xs font-bold">{appointment.prescription}</span>
              </div>
              <button
                type="button"
                onClick={() => onNotice?.(`Downloading ${appointment.prescription}`)}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
              >
                <Download className="mr-1 inline size-3" aria-hidden="true" />
                Download
              </button>
            </div>
          </Section>
        )}

        {/* Close Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 border-t border-border pt-5">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

function getStatusColors(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-primary/10 text-primary";
    case "Completed":
      return "bg-primary/10 text-primary";
    case "Cancelled":
      return "bg-[#fff2ef] text-[#b86f63]";
    case "Scheduled":
      return "bg-primary/10 text-primary";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

function getPaymentColors(payment: string) {
  switch (payment) {
    case "Paid":
      return "bg-[#e6f7ef] text-[#278e70]";
    case "Refunded":
      return "bg-[#e6f7ef] text-[#278e70]";
    case "Pending":
      return "bg-[#fff3e7] text-[#b97932]";
    default:
      return "bg-secondary text-muted-foreground";
  }
}