"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, CalendarDays, Clock, Star, Shield, Stethoscope, GraduationCap, Languages, MapPin as MapPinIcon, Check, X, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DoctorCard,
  SpecialtyChip,
  AvailabilityIndicator,
  FeeDisplay,
  LoadingSkeleton,
  EmptyState,
  type DoctorCardProps,
} from "@/components/doctors";

interface DoctorDetail {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  photo?: string;
  rating: number;
  reviewCount: number;
  fee: number;
  bio?: string;
  experience: number;
  education: string[];
  languages: string[];
  clinic: string;
  clinicAddress: string;
  isVerified: boolean;
  nextAvailableSlot?: string;
  schedules: Array<{
    id: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
}

interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "schedule" | "reviews">("about");
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(now.setDate(diff));
  });

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/doctors/${doctorId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error("Doctor not found");
        }

        setDoctor(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Fetch doctor schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setSlotsLoading(true);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const response = await fetch(
          `${API_URL}/api/doctors/${doctorId}/schedule?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
        );
        const data = await response.json();

        if (data.success) {
          setSlots(data.data);
        }
      } catch (err) {
        console.error("Failed to load schedule:", err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId, weekStart]);

  if (loading) {
    return <DoctorDetailSkeleton />;
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={<X className="size-14 text-destructive/50" />}
          title="Doctor not found"
          description={error || "The doctor you're looking for doesn't exist or has been removed."}
          action={{ label: "Back to search", onClick: () => window.history.back(), variant: "primary" }}
        />
      </div>
    );
  }

  // Group slots by day
  const slotsByDay = groupSlotsByDay(slots, weekStart);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="relative shrink-0">
              <div className="size-32 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center">
                {doctor.photo ? (
                  <img src={doctor.photo} alt={doctor.name} className="size-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-primary">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                )}
              </div>
              {doctor.isVerified && (
                <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-secondary text-primary shadow-lg" aria-label="Verified doctor">
                  <Shield className="size-4" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black truncate">{doctor.name}</h1>
                    {doctor.isVerified && (
                      <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary" aria-label="Verified doctor">
                        <Shield className="size-4" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-lg font-semibold text-primary">{doctor.specialty}</p>
                  <p className="mt-1 text-muted-foreground">{doctor.designation}</p>
                </div>

                <FeeDisplay
                  amount={doctor.fee}
                  consultationType="in_person"
                  size="lg"
                  showLabel={false}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{doctor.rating.toFixed(1)}</span>
                  <span>({doctor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  <span>{doctor.clinic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="size-4" />
                  <span>{doctor.experience}+ years experience</span>
                </div>
              </div>

              {doctor.nextAvailableSlot && (
                <AvailabilityIndicator
                  status="available"
                  size="md"
                  label={`Next available: ${formatDateTime(new Date(doctor.nextAvailableSlot))}`}
                  pulse
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#e6f7ef] px-4 py-2"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
          <div className="flex gap-1 overflow-x-auto pb-px" role="tablist" aria-label="Doctor profile sections">
            {[
              { id: "about", label: "About", icon: <Stethoscope className="size-4" /> },
              { id: "schedule", label: "Schedule", icon: <CalendarDays className="size-4" /> },
              { id: "reviews", label: "Reviews", icon: <Star className="size-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-semibold transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Panels */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-10">
        {/* About Tab */}
        <div
          role="tabpanel"
          id="about-panel"
          aria-labelledby="about-tab"
          className={cn("space-y-6", activeTab !== "about" && "hidden")}
        >
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              {/* Bio */}
              {doctor.bio && (
                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-bold">About</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{doctor.bio}</p>
                </section>
              )}

              {/* Experience & Education */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold">Experience & Education</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Experience</p>
                      <p className="mt-1 text-muted-foreground">{doctor.experience}+ years of practice</p>
                    </div>
                  </div>
                  {doctor.education.length > 0 && (
                    <div>
                      <p className="font-semibold">Education</p>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        {doctor.education.map((edu, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 size-1.5 rounded-full bg-primary" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {doctor.languages.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                        <Languages className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Languages</p>
                        <p className="mt-1 text-muted-foreground">{doctor.languages.join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Clinic Info */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold">Clinic Information</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                      <MapPinIcon className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{doctor.clinic}</p>
                      <p className="mt-1 text-muted-foreground">{doctor.clinicAddress}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold">Quick Info</h3>
                <div className="mt-4 space-y-4">
                  <InfoRow label="Consultation Fee" value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(doctor.fee)} />
                  <InfoRow label="Specialty" value={doctor.specialty} />
                  <InfoRow label="Designation" value={doctor.designation} />
                  <InfoRow label="Experience" value={`${doctor.experience}+ years`} />
                  <InfoRow label="Rating" value={`${doctor.rating.toFixed(1)} (${doctor.reviewCount} reviews)`} />
                  <InfoRow label="Verified" value={doctor.isVerified ? "Yes" : "No"} />
                </div>
              </div>

              {/* Book Appointment CTA */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold">Book Appointment</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a time slot from the Schedule tab to book your appointment.
                </p>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
                >
                  View Available Slots
                  <ChevronRight className="ml-2 inline size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Tab */}
        <div
          role="tabpanel"
          id="schedule-panel"
          aria-labelledby="schedule-tab"
          className={cn("space-y-6", activeTab !== "schedule" && "hidden")}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Available Slots</h2>
              <p className="text-sm text-muted-foreground">Select a time slot to book your appointment</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary"
                aria-label="Previous week"
              >
                <ChevronRight className="size-5 rotate-180" />
              </button>
              <span className="text-sm font-semibold text-nowrap">
                {formatWeekRange(weekStart)}
              </span>
              <button
                onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary"
                aria-label="Next week"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          {slotsLoading ? (
            <LoadingSkeleton count={7} variant="slot-grid" />
          ) : Object.keys(slotsByDay).length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-14 text-muted-foreground/50" />}
              title="No available slots this week"
              description="This doctor doesn't have any available slots for the selected week. Try another week or contact the clinic directly."
            />
          ) : (
            <div className="space-y-6">
              {Object.entries(slotsByDay).map(([day, daySlots]) => (
                <div key={day} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="border-b border-border bg-secondary/50 px-4 py-3">
                    <h3 className="font-semibold">{day}</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {daySlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.id}
                          slot={slot}
                          selected={selectedSlot?.id === slot.id}
                          onSelect={setSelectedSlot}
                          disabled={slot.status !== "AVAILABLE"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {selectedSlot && (
                <div className="rounded-2xl border border-primary bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary">Slot Selected</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(new Date(selectedSlot.startTime))} - {formatTime(new Date(selectedSlot.endTime))}
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = `/doctors/${doctorId}/book?slotId=${selectedSlot.id}`}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
                    >
                      Continue to Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reviews Tab */}
        <div
          role="tabpanel"
          id="reviews-panel"
          aria-labelledby="reviews-tab"
          className={cn("space-y-6", activeTab !== "reviews" && "hidden")}
        >
          <EmptyState
            icon={<Star className="size-14 text-muted-foreground/50" />}
            title="No reviews yet"
            description="Be the first to review this doctor after your appointment."
          />
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function TimeSlotButton({
  slot,
  selected,
  onSelect,
  disabled,
}: {
  slot: ScheduleSlot;
  selected: boolean;
  onSelect: (slot: ScheduleSlot) => void;
  disabled: boolean;
}) {
  const isBooked = slot.status === "BOOKED";
  const isCancelled = slot.status === "CANCELLED";

  return (
    <button
      onClick={() => !disabled && onSelect(slot)}
      disabled={disabled}
      className={cn(
        "relative h-20 rounded-xl border transition-all text-left",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30 hover:bg-primary/[0.02]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {isBooked && (
        <span className="absolute -top-2 -right-2 rounded-full bg-[#b86f63] px-2 py-0.5 text-[10px] font-bold text-white">
          Booked
        </span>
      )}
      {isCancelled && (
        <span className="absolute -top-2 -right-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          Cancelled
        </span>
      )}
      <div className="flex flex-col justify-center h-full px-4 py-3">
        <p className="text-lg font-bold">{formatTime(new Date(slot.startTime))}</p>
        <p className="text-xs text-muted-foreground">{formatTime(new Date(slot.endTime))}</p>
      </div>
      {selected && <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-primary" />}
    </button>
  );
}

function groupSlotsByDay(slots: ScheduleSlot[], weekStart: Date): Record<string, ScheduleSlot[]> {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const grouped: Record<string, ScheduleSlot[]> = {};

  days.forEach((day, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    grouped[day] = [];
  });

  slots.forEach((slot) => {
    const slotDate = new Date(slot.startTime);
    const dayName = days[slotDate.getDay() === 0 ? 6 : slotDate.getDay() - 1];
    if (grouped[dayName]) {
      grouped[dayName].push(slot);
    }
  });

  // Sort slots within each day by time
  Object.keys(grouped).forEach((day) => {
    grouped[day].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  });

  return grouped;
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function DoctorDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10">
          <div className="animate-pulse flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="size-32 rounded-2xl bg-secondary shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-1/2 bg-secondary rounded" />
              <div className="h-6 w-1/3 bg-secondary rounded" />
              <div className="h-5 w-1/4 bg-secondary rounded" />
              <div className="flex gap-4">
                <div className="h-6 w-24 bg-secondary rounded-full" />
                <div className="h-6 w-28 bg-secondary rounded-full" />
                <div className="h-6 w-32 bg-secondary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <nav className="border-b border-border bg-background/90">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="animate-pulse flex gap-1 overflow-x-auto pb-px">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-12 w-32 shrink-0 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-10">
        <LoadingSkeleton variant="text" lines={4} className="mb-6" />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="h-6 w-1/4 bg-secondary rounded" />
                <div className="h-20 bg-secondary rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="h-6 w-1/4 bg-secondary rounded" />
                <div className="h-24 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}