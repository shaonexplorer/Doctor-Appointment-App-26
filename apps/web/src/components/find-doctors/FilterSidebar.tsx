"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SelectFilter } from "./SelectFilter";

export interface FilterSidebarProps {
  specialty: string;
  onSpecialtyChange: (value: string) => void;
  availableToday: boolean;
  onAvailableTodayChange: (value: boolean) => void;
  consultation: string;
  onConsultationChange: (value: string) => void;
  designation: string;
  onDesignationChange: (value: string) => void;
  feeRange: number;
  onFeeRangeChange: (value: number) => void;
  availableThisWeek: boolean;
  onAvailableThisWeekChange: (value: boolean) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  clinic: string;
  onClinicChange: (value: string) => void;
  onClearAll: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const specialties = [
  "All specialties",
  "Cardiology",
  "Dermatology",
  "Internal Medicine",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
];

const designations = [
  "Any designation",
  "Consultant",
  "Senior Consultant",
  "Specialist",
  "Surgeon",
];

const consultationTypes = [
  "Any consultation type",
  "In-clinic",
  "Video consultation",
];

const genders = ["Any", "Female", "Male"];

const clinics = [
  "All clinics",
  "Heart & Vascular Center",
  "ClearSkin Clinic",
  "MediBook Family Clinic",
];

export function FilterSidebar({
  specialty,
  onSpecialtyChange,
  availableToday,
  onAvailableTodayChange,
  consultation,
  onConsultationChange,
  designation,
  onDesignationChange,
  feeRange,
  onFeeRangeChange,
  availableThisWeek,
  onAvailableThisWeekChange,
  gender,
  onGenderChange,
  clinic,
  onClinicChange,
  onClearAll,
  isOpen,
  onClose,
  className,
}: FilterSidebarProps) {
  const filters = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black">Filters</h2>
        <button onClick={onClearAll} className="text-xs font-bold text-primary hover:underline">
          Clear all
        </button>
      </div>
      <FilterSection title="Specialty">
        <div className="flex flex-col gap-2">
          {specialties.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input
                type="radio"
                name="specialty"
                checked={specialty === item}
                onChange={() => onSpecialtyChange(item)}
                className="accent-[var(--primary)]"
              />
              {item}
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Designation">
        <SelectFilter label={designation} options={designations} onChange={onDesignationChange} />
      </FilterSection>
      <FilterSection title="Consultation fee">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>$0</span>
          <span>$150+</span>
        </div>
        <input
          type="range"
          min="0"
          max="150"
          value={feeRange}
          onChange={(e) => onFeeRangeChange(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--primary)]"
        />
      </FilterSection>
      <FilterSection title="Availability">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
          <input
            type="checkbox"
            checked={availableToday}
            onChange={(e) => onAvailableTodayChange(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Available today
        </label>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
          <input
            type="checkbox"
            checked={availableThisWeek}
            onChange={(e) => onAvailableThisWeekChange(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Available this week
        </label>
      </FilterSection>
      <FilterSection title="Consultation type">
        <SelectFilter label={consultation} options={consultationTypes} onChange={onConsultationChange} />
      </FilterSection>
      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {genders.map((item) => (
            <button
              key={item}
              onClick={() => onGenderChange(item)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-bold",
                gender === item
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Clinic">
        <SelectFilter label={clinic} options={clinics} onChange={onClinicChange} />
      </FilterSection>
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
        <div className="absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto bg-card p-5 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black">Filter doctors</h2>
            <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary" aria-label="Close filters">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          {filters}
          <button onClick={onClose} className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
            Show results
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className={cn("hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:block", className)}>
      {filters}
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5 last:border-0">
      <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-foreground">{title}</h3>
      {children}
    </div>
  );
}