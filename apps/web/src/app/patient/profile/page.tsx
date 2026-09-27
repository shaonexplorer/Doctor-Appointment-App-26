"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import { ShieldCheck, Save, Check } from "lucide-react";
import {
  FormField,
  TextareaField,
  ProfileHeader,
  Section,
} from "@/components/patient-profile";

export default function PatientProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("sarah.johnson@example.com");
  const [phone, setPhone] = useState("+1 (415) 555-0198");

  const save = () => {
    setSaving(true);
    setSaved(false);
    window.setTimeout(() => {
      setSaving(false);
      setEditing(false);
      setSaved(true);
    }, 650);
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Profile">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-black">My profile</h2>
              <p className="mt-1 text-xs text-muted-foreground">Keep your personal and medical information up to date.</p>
            </div>
            <div className="flex gap-2">
              {saved && (
                <span className="flex items-center gap-1 rounded-xl bg-[#e9f8f3] px-3 py-2 text-xs font-bold text-[#218765]">
                  <Check className="size-4" aria-hidden="true" />
                  Saved
                </span>
              )}
              <button
                onClick={() => (editing ? save() : setEditing(true))}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-primary-foreground hover:opacity-90"
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? <> <Save className="size-4" /> Save changes </> : "Edit profile" }
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <ProfileHeader
            name="Sarah Johnson"
            initials="SJ"
            subtitle="Patient account · Member since January 2024"
            editing={editing}
            helperText={editing ? "Choose a clear photo for your care team" : "Your profile is visible to doctors you book with"}
          />

          {/* Personal Information */}
          <Section title="Personal information">
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" value="Sarah Johnson" disabled={!editing} />
              <FormField label="Email" value={email} onChange={setEmail} type="email" disabled={!editing} />
              <FormField label="Phone" value={phone} onChange={setPhone} type="tel" disabled={!editing} />
              <FormField label="Date of birth" value="June 14, 1992" disabled={!editing} />
              <FormField label="Blood group" value="O+" disabled={!editing} />
              <FormField label="Emergency contact" value="David Johnson · +1 (415) 555-0172" disabled={!editing} />
            </div>
            <TextareaField
              label="Medical history summary"
              value="Seasonal allergies. No major surgeries or hospitalizations."
              disabled={!editing}
              placeholder="Add relevant medical history..."
            />
          </Section>

          {/* Medical Information */}
          <Section title="Medical information" description="This information helps your care team prepare for visits." icon={<ShieldCheck className="size-5" />}>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Blood group" value="O+" disabled={!editing} />
              <FormField label="Allergies" value="Penicillin, pollen" disabled={!editing} />
              <FormField label="Existing conditions" value="Seasonal allergies" disabled={!editing} />
              <FormField label="Current medications" value="Cetirizine 10 mg as needed" disabled={!editing} />
              <FormField label="Emergency contact" value="David Johnson · +1 (415) 555-0172" disabled={!editing} />
            </div>
          </Section>
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}