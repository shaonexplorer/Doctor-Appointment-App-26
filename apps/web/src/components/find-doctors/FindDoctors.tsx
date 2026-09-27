"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, ChevronDown, Clock3, Filter, Grid2X2, List, MapPin, Search, SlidersHorizontal, Star, Video, X } from "lucide-react";
import {
  DoctorCard,
  type DoctorCardData,
  FilterSidebar,
  SelectFilter,
  EmptyState,
} from "./index";

export interface FindDoctorsProps {
  doctors?: DoctorCardData[];
  specialties?: string[];
  onOpenProfile?: () => void;
  className?: string;
}

const defaultDoctors: DoctorCardData[] = [
  { name: "Dr. Michael Anderson", initials: "MA", designation: "Senior Consultant Cardiologist", specialties: ["Cardiology", "Heart & Vascular"], symptoms: ["Chest pain", "High blood pressure"], experience: "18 years", qualifications: "MD, FACC", fee: "$85", clinic: "Heart & Vascular Center", next: "Today, 4:30 PM", availability: "Available today", color: "bg-[#dce8ff] text-primary" },
  { name: "Dr. Emily Carter", initials: "EC", designation: "Consultant Dermatologist", specialties: ["Dermatology", "Cosmetic Skin"], symptoms: ["Acne", "Skin rash"], experience: "12 years", qualifications: "MD, FAAD", fee: "$70", clinic: "ClearSkin Clinic", next: "Tomorrow, 9:00 AM", availability: "Available this week", color: "bg-[#fce4f0] text-[#bd5d8c]" },
  { name: "Dr. James Wilson", initials: "JW", designation: "Internal Medicine Specialist", specialties: ["Internal Medicine", "Primary Care"], symptoms: ["Fatigue", "Diabetes care"], experience: "15 years", qualifications: "MD, FACP", fee: "$60", clinic: "MediBook Family Clinic", next: "Wed, Sep 23, 11:00 AM", availability: "Available this week", color: "bg-[#e6f7ef] text-[#278e70]" },
  { name: "Dr. Olivia Bennett", initials: "OB", designation: "Consultant Pediatrician", specialties: ["Pediatrics", "Child Wellness"], symptoms: ["Fever", "Child nutrition"], experience: "10 years", qualifications: "MD, FAAP", fee: "$65", clinic: "Little Steps Pediatrics", next: "No appointments today", availability: "Next week", color: "bg-[#fff1d9] text-[#b97932]" },
  { name: "Dr. Sophia Patel", initials: "SP", designation: "Consultant Neurologist", specialties: ["Neurology", "Sleep Medicine"], symptoms: ["Headaches", "Sleep issues"], experience: "16 years", qualifications: "MD, FAAN", fee: "$90", clinic: "NeuroCare Institute", next: "Thu, Sep 24, 2:00 PM", availability: "Available this week", color: "bg-[#eee8ff] text-[#8062c7]" },
  { name: "Dr. Daniel Lee", initials: "DL", designation: "Orthopedic Surgeon", specialties: ["Orthopedics", "Sports Medicine"], symptoms: ["Joint pain", "Sports injuries"], experience: "20 years", qualifications: "MD, FAAOS", fee: "$95", clinic: "Motion & Joint Center", next: "Fri, Sep 25, 10:30 AM", availability: "Available this week", color: "bg-[#e2f3f6] text-[#398a99]" },
];

const defaultSpecialties = ["All specialties", "Cardiology", "Dermatology", "Internal Medicine", "Pediatrics", "Neurology", "Orthopedics"];

export function FindDoctors({ doctors = defaultDoctors, specialties = defaultSpecialties, onOpenProfile, className }: FindDoctorsProps) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [availableToday, setAvailableToday] = useState(false);
  const [consultation, setConsultation] = useState("Any type");
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => doctors.filter((doctor) => {
    const haystack = [doctor.name, doctor.designation, ...doctor.specialties, ...doctor.symptoms, doctor.clinic].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase()) && (specialty === "All specialties" || doctor.specialties.includes(specialty)) && (!availableToday || doctor.availability === "Available today");
  }), [query, specialty, availableToday]);

  const action = (label: string) => setNotice(`${label} is ready to open.`);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X className="size-4" /></button></div>}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-xl font-black tracking-tight sm:text-2xl">Find the right doctor for your needs</h2><p className="mt-1 text-sm text-muted-foreground">Search trusted specialists and book care that works for you.</p></div><button onClick={() => setMobileFilters(true)} className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold lg:hidden"><SlidersHorizontal className="size-4" /> Filters</button></div><div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]"><label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by doctor, specialty, or symptom" className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><SelectFilter label="All specialties" options={specialties} onChange={setSpecialty} /><SelectFilter label="Any consultation type" options={["Any consultation type", "In-clinic", "Video consultation"]} onChange={setConsultation} /></div></div>
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]"><aside className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:block"><FilterSidebar
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        availableToday={availableToday}
        onAvailableTodayChange={setAvailableToday}
        consultation={consultation}
        onConsultationChange={setConsultation}
        designation="Any designation"
        onDesignationChange={() => {}}
        feeRange={150}
        onFeeRangeChange={() => {}}
        availableThisWeek={false}
        onAvailableThisWeekChange={() => {}}
        gender="Any"
        onGenderChange={() => {}}
        clinic="All clinics"
        onClinicChange={() => {}}
        onClearAll={() => { setSpecialty("All specialties"); setAvailableToday(false); setConsultation("Any type"); }}
      /></aside><section className="min-w-0"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold"><span className="text-primary">{filtered.length}</span> doctors found</p><div className="flex items-center gap-2"><label className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-border bg-card px-2 py-2 font-bold text-foreground outline-none"><option>Recommended</option><option>Experience</option><option>Fee: low to high</option></select></label><div className="flex rounded-lg border border-border bg-card p-1"><button onClick={() => setView("grid")} className={cn("rounded-md p-1.5", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground")} aria-label="Grid view"><Grid2X2 className="size-4" /></button><button onClick={() => setView("list")} className={cn("rounded-md p-1.5", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground")} aria-label="List view"><List className="size-4" /></button></div></div></div>{filtered.length === 0 ? <EmptyState onClear={() => { setQuery(""); setSpecialty("All specialties"); setAvailableToday(false) }} /> : <div className={view === "grid" ? "grid gap-4 xl:grid-cols-2" : "flex flex-col gap-4"}>{filtered.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} list={view === "list"} onAction={action} onOpenProfile={onOpenProfile} />)}</div>}<div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">Showing 1&ndash;{filtered.length} of 48 doctors</p><div className="flex items-center gap-1"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">1</button><button className="rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary">2</button><button className="rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary">3</button><button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><ChevronDown className="size-4 -rotate-90" /></button></div></div></section></div>
      {mobileFilters && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileFilters(false)} /><div className="absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto bg-card p-5 shadow-xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-black">Filter doctors</h2><button onClick={() => setMobileFilters(false)} className="rounded-lg p-2 hover:bg-secondary" aria-label="Close filters"><X className="size-5" /></button></div><FilterSidebar
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        availableToday={availableToday}
        onAvailableTodayChange={setAvailableToday}
        consultation={consultation}
        onConsultationChange={setConsultation}
        designation="Any designation"
        onDesignationChange={() => {}}
        feeRange={150}
        onFeeRangeChange={() => {}}
        availableThisWeek={false}
        onAvailableThisWeekChange={() => {}}
        gender="Any"
        onGenderChange={() => {}}
        clinic="All clinics"
        onClinicChange={() => {}}
        onClearAll={() => { setSpecialty("All specialties"); setAvailableToday(false); setConsultation("Any type"); }}
        isOpen={true}
      /><button onClick={() => setMobileFilters(false)} className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Show results</button></div></div>}
    </div>
  );
}