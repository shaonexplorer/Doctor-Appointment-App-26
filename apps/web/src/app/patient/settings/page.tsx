"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import { LockKeyhole, Save, ShieldCheck, Check } from "lucide-react";
import {
  FormField,
  ToggleSwitch,
  Section,
} from "@/components/patient-profile";

export default function PatientSettingsPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("sarah.johnson@example.com");
  const [phone, setPhone] = useState("+1 (415) 555-0198");
  const [reminders, setReminders] = useState(true);
  const [prescriptions, setPrescriptions] = useState(true);
  const [cancellations, setCancellations] = useState(true);

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
      <PatientPortalShell active="Settings">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-black">Settings</h2>
              <p className="mt-1 text-xs text-muted-foreground">Control your account, notifications, and privacy preferences.</p>
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
                {saving ? "Saving..." : editing ? <> <Save className="size-4" /> Save changes </> : "Edit settings" }
              </button>
            </div>
          </div>

          {/* Account */}
          <Section title="Account">
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Email" value={email} onChange={setEmail} type="email" disabled={!editing} />
              <FormField label="Phone" value={phone} onChange={setPhone} type="tel" disabled={!editing} />
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl border border-border px-3 text-left text-xs font-bold hover:bg-secondary"
                disabled={!editing}
              >
                <LockKeyhole className="size-4 text-primary" aria-hidden="true" />
                Change password
              </button>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications">
            <div className="mt-5 grid gap-3">
              <ToggleSwitch
                label="Appointment reminders"
                description="Get notified before upcoming visits."
                value={reminders}
                onChange={setReminders}
                disabled={!editing}
              />
              <ToggleSwitch
                label="Prescription notifications"
                description="Know when a prescription is ready to view."
                value={prescriptions}
                onChange={setPrescriptions}
                disabled={!editing}
              />
              <ToggleSwitch
                label="Cancellation notifications"
                description="Stay informed about appointment changes."
                value={cancellations}
                onChange={setCancellations}
                disabled={!editing}
              />
              <ToggleSwitch
                label="Email notifications"
                description="Receive important updates by email."
                value={true}
                onChange={() => {}}
                disabled={true}
              />
              <ToggleSwitch
                label="SMS notifications"
                description="Receive reminders and updates by text."
                value={false}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </Section>

          {/* Privacy */}
          <Section title="Privacy">
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Data visibility" value="Doctors you book with" disabled />
              <FormField label="Session management" value="2 active sessions" disabled />
            </div>
            <div className="mt-4 rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
              MediBook uses encryption and role-based access to keep your health information protected.
            </div>
          </Section>
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}