"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import {
  BookingStepper,
  StepHeading,
  ActionRow,
  DoctorStep,
  DateTimeStep,
  SymptomsStep,
  ConfirmationStep,
  SuccessState,
  LoadingState,
  ErrorBox,
  SummaryRow,
} from "@/components/booking-flow";
import { ArrowLeft } from "lucide-react";
import type { TimeSlot } from "@/components/booking-flow";

const steps = ["Doctor", "Date & Time", "Symptoms", "Confirmation", "Success"];
const dates = ["Tue, Sep 22", "Wed, Sep 23", "Thu, Sep 24", "Fri, Sep 25", "Sat, Sep 26"];
const times = ["09:00 AM", "09:20 AM", "10:00 AM", "10:30 AM", "02:00 PM", "02:40 PM", "04:20 PM", "05:00 PM"];
const tags = ["Chest pain", "Headache", "Fever", "Follow-up", "Routine consultation"];

const slots: Record<string, TimeSlot[]> = {
  Morning: [
    { time: "09:00 AM" },
    { time: "09:20 AM" },
    { time: "09:40 AM" },
  ],
  Afternoon: [
    { time: "02:00 PM" },
    { time: "02:20 PM" },
    { time: "02:40 PM" },
  ],
  Evening: [
    { time: "07:00 PM" },
    { time: "07:20 PM" },
    { time: "07:40 PM" },
  ],
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState(dates[2]);
  const [time, setTime] = useState("10:30 AM");
  const [symptoms, setSymptoms] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Routine consultation"]);
  const [status, setStatus] = useState<"idle" | "loading" | "conflict" | "failure">("idle");
  const [confirmed, setConfirmed] = useState(false);

  const toggleTag = (tag: string) => setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  const continueBooking = () => setStep((current) => Math.min(current + 1, 3));
  const confirm = () => {
    setStatus("loading");
    window.setTimeout(() => { setStatus("idle"); setConfirmed(true); setStep(4) }, 850);
  };
  const retry = () => { setStatus("idle"); setStep(3) };

  if (confirmed) return <SuccessState onDashboard={() => router.push("/dashboard/patient")} onBack={() => { setConfirmed(false); setStep(3) }} />;

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Book Appointment">
        <div className="mx-auto max-w-5xl">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Back to doctor
          </button>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <BookingStepper steps={steps} currentStep={step} />
            {step === 0 && <DoctorStep onContinue={continueBooking} />}
            {step === 1 && <DateTimeStep date={date} time={time} setDate={setDate} setTime={setTime} onBack={() => setStep(0)} onContinue={continueBooking} dates={dates.map(d => ({ label: d, value: d }))} timeSlots={slots} />}
            {step === 2 && <SymptomsStep symptoms={symptoms} setSymptoms={setSymptoms} selectedTags={selectedTags} toggleTag={toggleTag} onBack={() => setStep(1)} onContinue={continueBooking} />}
            {step === 3 && <ConfirmationStep date={date} time={time} symptoms={symptoms} tags={selectedTags} status={status} onBack={() => setStep(2)} onConfirm={confirm} onRetry={retry} />}
          </div>
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}