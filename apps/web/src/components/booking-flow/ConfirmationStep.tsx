"use client";

import { cn } from "@/lib/utils";
import { Clock3, ShieldCheck } from "lucide-react";
import { StepHeading } from "./StepHeading";
import { ActionRow } from "./ActionRow";
import { SummaryRow } from "./SummaryRow";
import { ErrorBox } from "./ErrorBox";
import { LoadingState } from "./LoadingState";

export type ConfirmationStatus = "idle" | "loading" | "conflict" | "failure";

export interface ConfirmationStepProps {
  date: string;
  time: string;
  symptoms: string;
  tags: string[];
  status: ConfirmationStatus;
  onBack: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  doctor?: string;
  clinic?: string;
  patient?: string;
  fee?: string;
  className?: string;
}

export function ConfirmationStep({
  date,
  time,
  symptoms,
  tags,
  status,
  onBack,
  onConfirm,
  onRetry,
  doctor = "Dr. Michael Anderson &middot; Cardiology",
  clinic = "Heart & Vascular Center, New York",
  patient = "Sarah Johnson &middot; sarah.johnson@example.com",
  fee = "$85",
  className,
}: ConfirmationStepProps) {
  const displaySymptoms = symptoms || tags.join(", ") || "Routine consultation";

  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 4 of 5"
        title="Review and confirm"
        description="Please check the details before reserving this appointment."
      />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border border-border bg-background p-5">
          <SummaryRow label="Doctor" value={doctor} />
          <SummaryRow label="Date & time" value={`${date} &middot; ${time}`} />
          <SummaryRow label="Clinic" value={clinic} />
          <SummaryRow label="Patient" value={patient} />
          <SummaryRow label="Symptoms" value={displaySymptoms} />
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Payment status</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-black">Consultation fee</span>
            <span className="text-2xl font-black">{fee}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#f1d8a9] bg-[#fff9ed] px-3 py-3 text-xs font-bold text-[#a66d1c]">
            <Clock3 className="size-4" aria-hidden="true" />
            Pending
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            No payment is captured until your appointment is successfully reserved.
          </p>
        </div>
      </div>
      {status === "loading" && <LoadingState />}
      {status === "conflict" && (
        <ErrorBox
          title="This slot was just booked"
          text="Choose another available time to continue."
          onClick={onRetry}
        />
      )}
      {status === "failure" && (
        <ErrorBox
          title="Booking could not be completed"
          text="We couldn&apos;t reserve this appointment. Please try again."
          onClick={onRetry}
        />
      )}
      <ActionRow
        label={status === "loading" ? "Reserving..." : "Confirm Appointment"}
        onClick={onConfirm}
        onBack={onBack}
        disabled={status === "loading"}
      />
    </div>
  );
}