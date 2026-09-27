"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BookingStepper,
  BookingSummary,
  SymptomNotesField,
  ConfirmationModal,
  ToastNotification,
  useToast,
} from "@/components/booking";
import { TimeSlotPicker } from "@/components/doctors";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  designation: string;
  fee: number;
  rating: number;
  avatar?: string;
  clinic: string;
  clinicAddress: string;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED" | "LOCKED";
}

type BookingStep = "slot" | "symptoms" | "confirm" | "success";

const mockDoctor: Doctor = {
  id: "doc-1",
  name: "Dr. Michael Anderson",
  specialty: "Cardiology",
  designation: "Senior Cardiologist",
  fee: 150,
  rating: 4.9,
  clinic: "Heart & Vascular Center",
  clinicAddress: "123 Medical Plaza, Suite 400, New York, NY 10001",
};

const mockSlots: Slot[] = [
  { id: "slot-1", startTime: "2026-09-24T09:00:00Z", endTime: "2026-09-24T09:30:00Z", status: "AVAILABLE" },
  { id: "slot-2", startTime: "2026-09-24T09:30:00Z", endTime: "2026-09-24T10:00:00Z", status: "AVAILABLE" },
  { id: "slot-3", startTime: "2026-09-24T10:00:00Z", endTime: "2026-09-24T10:30:00Z", status: "AVAILABLE" },
  { id: "slot-4", startTime: "2026-09-24T10:30:00Z", endTime: "2026-09-24T11:00:00Z", status: "BOOKED" },
  { id: "slot-5", startTime: "2026-09-24T11:00:00Z", endTime: "2026-09-24T11:30:00Z", status: "AVAILABLE" },
  { id: "slot-6", startTime: "2026-09-24T14:00:00Z", endTime: "2026-09-24T14:30:00Z", status: "AVAILABLE" },
  { id: "slot-7", startTime: "2026-09-24T14:30:00Z", endTime: "2026-09-24T15:00:00Z", status: "AVAILABLE" },
  { id: "slot-8", startTime: "2026-09-24T15:00:00Z", endTime: "2026-09-24T15:30:00Z", status: "AVAILABLE" },
];

const consultationTypes = [
  { value: "IN_PERSON" as const, label: "In-person visit", icon: Calendar },
  { value: "VIDEO" as const, label: "Video consultation", icon: Clock },
  { value: "PHONE" as const, label: "Phone consultation", icon: Clock },
];

const steps = [
  { label: "Select Slot", description: "Choose your preferred time" },
  { label: "Symptoms", description: "Tell us about your visit" },
  { label: "Confirm", description: "Review and confirm booking" },
  { label: "Success", description: "Appointment confirmed" },
];

export default function BookingPage({ params: _params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState<BookingStep>("slot");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    searchParams.get("slotId")
  );
  const [symptoms, setSymptoms] = useState("");
  const [consultationType, setConsultationType] = useState<"IN_PERSON" | "VIDEO" | "PHONE">("IN_PERSON");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Sync step with URL or default to slot selection
  useEffect(() => {
    const urlStep = searchParams.get("step") as BookingStep | null;
    if (urlStep && ["slot", "symptoms", "confirm", "success"].includes(urlStep)) {
      setStep(urlStep);
    }
  }, [searchParams]);

  // Update URL when step changes
  const updateStep = (newStep: BookingStep) => {
    setStep(newStep);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep);
    if (selectedSlotId) {
      params.set("slotId", selectedSlotId);
    }
    router.replace(`/doctors/${params.get("id") || "doc-1"}/book?${params.toString()}`);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("slotId", slotId);
    router.replace(`/doctors/${params.get("id") || "doc-1"}/book?${params.toString()}`);
  };

  const handleNext = () => {
    if (step === "slot" && selectedSlotId) {
      updateStep("symptoms");
    } else if (step === "symptoms") {
      updateStep("confirm");
    } else if (step === "confirm") {
      handleBook();
    }
  };

  const handleBack = () => {
    if (step === "symptoms") {
      updateStep("slot");
    } else if (step === "confirm") {
      updateStep("symptoms");
    }
  };

  const handleBook = async () => {
    setIsBooking(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        variant: "success",
        title: "Appointment Booked!",
        description: `Your appointment with ${mockDoctor.name} has been confirmed.`,
        duration: 5000,
      });

      updateStep("success");
      setShowSuccessModal(true);
    } catch {
      toast({
        variant: "error",
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/patient/appointments");
  };

  const selectedSlot = mockSlots.find((s) => s.id === selectedSlotId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl p-2 text-muted-foreground hover:bg-secondary"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold text-center">Book Appointment</h1>
            <div className="size-10" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Doctor Header */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="shrink-0 grid size-14 place-items-center rounded-xl bg-primary/10 text-primary">
              {mockDoctor.avatar ? (
                <img src={mockDoctor.avatar} alt="" className="size-full rounded-xl object-cover" />
              ) : (
                <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold truncate">{mockDoctor.name}</h2>
              <p className="mt-1 text-sm text-primary">{mockDoctor.specialty} · {mockDoctor.designation}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden="true" />
                {mockDoctor.clinic}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">${mockDoctor.fee.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per visit</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <BookingStepper
          currentStep={["slot", "symptoms", "confirm", "success"].indexOf(step) + 1}
          totalSteps={4}
          steps={steps}
        />

        {/* Step Content */}
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Step 1: Slot Selection */}
          {step === "slot" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Select Time Slot</h3>
                <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm">
                  <Calendar className="size-4 text-primary" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => {
                      // In real app, open date picker
                    }}
                    className="font-semibold text-foreground hover:underline"
                  >
                    {formatDate(new Date().toISOString())}
                  </button>
                </div>
              </div>

              <TimeSlotPicker
                slots={mockSlots}
                selectedSlotId={selectedSlotId || undefined}
                onSelect={handleSlotSelect}
                showDate={false}
                columns={3}
              />
            </div>
          )}

          {/* Step 2: Symptoms */}
          {step === "symptoms" && (
            <div>
              <h3 className="mb-4 text-lg font-bold">Reason for Visit</h3>

              <SymptomNotesField
                value={symptoms}
                onChange={setSymptoms}
                label="Symptoms & Notes"
                description="Help your doctor prepare for your visit (optional)"
                placeholder="Describe your symptoms, concerns, or reason for visit..."
                maxLength={1000}
              />

              <div className="mt-6">
                <h4 className="mb-3 text-sm font-bold">Consultation Type</h4>
                <div className="grid gap-2 sm:grid-cols-3">
                  {consultationTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setConsultationType(type.value)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        consultationType === type.value
                          ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-primary/[0.02]"
                      )}
                      aria-pressed={consultationType === type.value}
                    >
                      <type.icon className={cn("size-5", consultationType === type.value ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                      <span className={cn("text-sm font-bold", consultationType === type.value ? "text-primary" : "text-foreground")}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirm" && selectedSlot && (
            <div>
              <h3 className="mb-4 text-lg font-bold">Confirm Your Appointment</h3>

              <BookingSummary
                doctor={{
                  name: mockDoctor.name,
                  specialty: mockDoctor.specialty,
                  rating: mockDoctor.rating,
                }}
                slot={{
                  date: new Date(),
                  startTime: selectedSlot.startTime,
                  endTime: selectedSlot.endTime,
                }}
                fee={mockDoctor.fee}
                consultationType={consultationType}
                symptoms={symptoms}
                clinic={{
                  name: mockDoctor.clinic,
                  address: mockDoctor.clinicAddress,
                }}
                onEditSlot={() => updateStep("slot")}
                onEditSymptoms={() => updateStep("symptoms")}
                onEditConsultationType={() => updateStep("symptoms")}
              >
                <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <h4 className="text-sm font-bold text-primary">Important Reminders</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                      <span>Arrive 10 minutes early for in-person visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                      <span>Test your camera/microphone for video visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                      <span>Have your insurance card ready</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                      <span>Cancellation within 2 hours may incur a fee</span>
                    </li>
                  </ul>
                </div>
              </BookingSummary>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-green-100 text-green-600">
                <Check className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black">Appointment Confirmed!</h3>
              <p className="mt-2 text-muted-foreground">
                Your appointment has been successfully booked.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step !== "success" && (
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step !== "slot" && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-border px-6 py-3 text-sm font-bold hover:bg-secondary"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={step === "slot" && !selectedSlotId}
              className={cn(
                "rounded-xl px-6 py-3 text-sm font-bold transition",
                step === "confirm" && !isBooking
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-primary text-primary-foreground hover:opacity-90",
                (step === "slot" && !selectedSlotId) && "opacity-50 cursor-not-allowed"
              )}
              disabled={step === "slot" && !selectedSlotId}
            >
              {step === "confirm" ? (isBooking ? "Booking..." : "Confirm & Book") : "Continue"}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSuccessClose}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              View My Appointments
            </button>
          </div>
        )}
      </main>

      {/* Success Modal */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        variant="success"
        appointmentId="APT-2026-004821"
        appointmentDetails={{
          doctorName: mockDoctor.name,
          date: new Date(),
          time: selectedSlot ? formatTime(selectedSlot.startTime) : "10:30 AM",
          clinic: mockDoctor.clinic,
          fee: mockDoctor.fee,
        }}
        showCalendarDownload
        onDownloadCalendar={() => {
          toast({
            variant: "info",
            title: "Calendar Download",
            description: "Downloading .ics file...",
            duration: 3000,
          });
        }}
      />

      {/* Toast Notifications */}
      <ToastNotification
        isOpen={true}
        onClose={() => {}}
        variant="info"
        title=""
        description=""
      />
    </div>
  );
}