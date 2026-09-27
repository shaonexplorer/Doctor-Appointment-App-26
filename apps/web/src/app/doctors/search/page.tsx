"use client";

import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import { FindDoctors } from "@/components/find-doctors";
import { Search, X } from "lucide-react";

const doctors = [
  { name: "Dr. Michael Anderson", initials: "MA", designation: "Senior Consultant Cardiologist", specialties: ["Cardiology", "Heart & Vascular"], symptoms: ["Chest pain", "High blood pressure"], experience: "18 years", qualifications: "MD, FACC", fee: "$85", clinic: "Heart & Vascular Center", next: "Today, 4:30 PM", availability: "Available today", color: "bg-[#dce8ff] text-primary" },
  { name: "Dr. Emily Carter", initials: "EC", designation: "Consultant Dermatologist", specialties: ["Dermatology", "Cosmetic Skin"], symptoms: ["Acne", "Skin rash"], experience: "12 years", qualifications: "MD, FAAD", fee: "$70", clinic: "ClearSkin Clinic", next: "Tomorrow, 9:00 AM", availability: "Available this week", color: "bg-[#fce4f0] text-[#bd5d8c]" },
  { name: "Dr. James Wilson", initials: "JW", designation: "Internal Medicine Specialist", specialties: ["Internal Medicine", "Primary Care"], symptoms: ["Fatigue", "Diabetes care"], experience: "15 years", qualifications: "MD, FACP", fee: "$60", clinic: "MediBook Family Clinic", next: "Wed, Sep 23, 11:00 AM", availability: "Available this week", color: "bg-[#e6f7ef] text-[#278e70]" },
  { name: "Dr. Olivia Bennett", initials: "OB", designation: "Consultant Pediatrician", specialties: ["Pediatrics", "Child Wellness"], symptoms: ["Fever", "Child nutrition"], experience: "10 years", qualifications: "MD, FAAP", fee: "$65", clinic: "Little Steps Pediatrics", next: "No appointments today", availability: "Next week", color: "bg-[#fff1d9] text-[#b97932]" },
  { name: "Dr. Sophia Patel", initials: "SP", designation: "Consultant Neurologist", specialties: ["Neurology", "Sleep Medicine"], symptoms: ["Headaches", "Sleep issues"], experience: "16 years", qualifications: "MD, FAAN", fee: "$90", clinic: "NeuroCare Institute", next: "Thu, Sep 24, 2:00 PM", availability: "Available this week", color: "bg-[#eee8ff] text-[#8062c7]" },
  { name: "Dr. Daniel Lee", initials: "DL", designation: "Orthopedic Surgeon", specialties: ["Orthopedics", "Sports Medicine"], symptoms: ["Joint pain", "Sports injuries"], experience: "20 years", qualifications: "MD, FAAOS", fee: "$95", clinic: "Motion & Joint Center", next: "Fri, Sep 25, 10:30 AM", availability: "Available this week", color: "bg-[#e2f3f6] text-[#398a99]" },
];
const specialties = ["All specialties", "Cardiology", "Dermatology", "Internal Medicine", "Pediatrics", "Neurology", "Orthopedics"];

export default function DoctorSearchPage() {
  const [notice, setNotice] = useState("");

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Find Doctors">
        <FindDoctors
          onOpenProfile={() => {} }
        />
      </PatientPortalShell>
    </ProtectedRoute>
  );
}