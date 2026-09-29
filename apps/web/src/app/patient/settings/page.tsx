'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import { LockKeyhole, Save, Check, AlertCircle } from 'lucide-react';
import { FormField, ToggleSwitch, Section } from '@/components/patient-profile';
import { userApi, type UserProfile } from '@/lib/api';

export default function PatientSettingsPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form state - initialized from profile data
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reminders, setReminders] = useState(true);
  const [prescriptions, setPrescriptions] = useState(true);
  const [cancellations, setCancellations] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
        setEmail(data.email);
        setPhone(data.phone || '');
      } catch (err) {
        setError('Failed to load settings. Please try again.');
        console.error('Failed to fetch profile:', err);
      }
    };

    void fetchProfile();
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      // Update email and phone via user API
      await userApi.updateProfile({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: phone || null,
      });

      setEditing(false);
      setSaved(true);

      // Refetch profile to get updated data
      const updatedProfile = await userApi.getProfile();
      setProfile(updatedProfile);

      // Hide saved message after 3 seconds
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Settings">
        <div className="space-y-5">
          {/* Loading state */}
          {profile === null && !error && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
                <p className="text-muted-foreground">Loading settings...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle className="size-5" aria-hidden="true" />
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto text-sm underline hover:text-red-800"
              >
                Retry
              </button>
            </div>
          )}

          {profile && (
            <>
              {/* Header */}
              <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h2 className="text-lg font-black">Settings</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Control your account, notifications, and privacy preferences.
                  </p>
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
                    className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black hover:opacity-90"
                    disabled={saving}
                  >
                    {saving ? (
                      'Saving...'
                    ) : editing ? (
                      <>
                        {' '}
                        <Save className="size-4" /> Save changes{' '}
                      </>
                    ) : (
                      'Edit settings'
                    )}
                  </button>
                </div>
              </div>

              {/* Account */}
              <Section title="Account">
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    disabled={!editing}
                  />
                  <FormField
                    label="Phone"
                    value={phone}
                    onChange={setPhone}
                    type="tel"
                    disabled={!editing}
                  />
                  <button
                    type="button"
                    className="border-border hover:bg-secondary flex h-11 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold"
                    disabled={!editing}
                  >
                    <LockKeyhole className="text-primary size-4" aria-hidden="true" />
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
                <div className="bg-secondary text-muted-foreground mt-4 rounded-xl p-4 text-xs">
                  MediBook uses encryption and role-based access to keep your health information
                  protected.
                </div>
              </Section>
            </>
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
