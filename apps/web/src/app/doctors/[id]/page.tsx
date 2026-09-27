"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import {
  DoctorHeader,
  AboutSection,
  ClinicInfoSection,
  ScheduleCalendar,
  Reviews,
  ProfileInfo,
} from "@/components/doctor-profile";
import { ArrowLeft, CalendarDays, ChevronLeft, MapPin, ShieldCheck, Stethoscope, Video } from "lucide-react";
import { Award, BadgeCheck, Check, Clock3, Globe2, Languages, Star } from "lucide-react";

const dates = ["Today", "Tomorrow", "Fri", "Sat", "Sun", "Mon"];

const slots = {
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

const reviewData = [
  { text: "Dr. Anderson took the time to explain everything clearly. I felt heard and cared for.", name: "Rachel M.", date: "2 weeks ago" },
  { text: "The video visit was punctual, calm, and incredibly helpful. Highly recommend.", name: "David K.", date: "1 month ago" },
  { text: "A thoughtful doctor and a wonderful clinic team. Booking was seamless.", name: "Priya S.", date: "2 months ago" },
];

export default function DoctorProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState("Today");
  const [selected, setSelected] = useState("09:20 AM");
  const [notice, setNotice] = useState("");

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Doctor Profile">
        <div className="flex flex-col gap-6">
          {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
          <button onClick={() => router.back()} className="flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"><ChevronLeft className="size-4" /> Back to doctors</button>
          <DoctorHeader
            doctor={{
              name: "Dr. Michael Anderson",
              initials: "MA",
              designation: "Senior Consultant Cardiologist",
              specialties: ["Cardiology"],
              experience: "18 years",
              qualifications: "MD, FACC · Harvard Medical School",
              clinic: "Heart & Vascular Center",
              fee: "$85",
              rating: 4.9,
              reviews: 128,
              avatarColor: "bg-[#dce8ff]",
            }}
            onBack={() => router.back()}
            onBook={() => setNotice(`Appointment request started for ${date}, ${selected}.`)}
            selectedTime={selected}
            onNotice={setNotice}
          />
          <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col gap-6">
              <AboutSection
                title="About Dr. Anderson"
                description="Dr. Anderson is a board-certified cardiologist focused on thoughtful, evidence-based care for every stage of heart health. He combines clinical expertise with a calm, patient-first approach."
                infoItems={[
                  { icon: Award, label: "Qualifications", value: "MD, FACC · Harvard Medical School" },
                  { icon: Stethoscope, label: "Specialties", value: "Cardiology · Heart & Vascular" },
                  { icon: Check, label: "Symptoms handled", value: "Chest pain · Hypertension · Palpitations" },
                  { icon: Languages, label: "Languages", value: "English · Spanish · French" },
                ]}
              />
              <ClinicInfoSection
                clinicName="Heart & Vascular Center"
                infoItems={[
                  { icon: MapPin, label: "Address", value: "240 Madison Avenue, New York, NY" },
                  { icon: Clock3, label: "Consultation duration", value: "30 minutes per visit" },
                  { icon: ShieldCheck, label: "Cancellation policy", value: "Free cancellation up to 24 hours before" },
                  { icon: Video, label: "Visit options", value: "In-clinic or secure video visit" },
                ]}
              />
            </div>
            <ScheduleCalendar
              selectedDate={date}
              onDateChange={setDate}
              selectedTime={selected}
              onTimeChange={setSelected}
              dates={dates.map((item, i) => ({ label: item, day: 21 + i, value: item }))}
              slots={slots}
              onBook={() => setNotice(`Appointment request started for ${date}, ${selected}.`)}
              onViewMoreDates={() => setNotice("More appointment dates will be available soon.")}
              onNotice={setNotice}
            />
          </div>
          <Reviews reviews={reviewData} overallRating={4.9} />
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}