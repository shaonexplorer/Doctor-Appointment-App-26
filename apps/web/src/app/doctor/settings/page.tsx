'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { DoctorPortalShell } from '@/components/doctor-portal';
import { LockKeyhole, Save, Check, AlertCircle, Bell, Shield } from 'lucide-react';
import { FormField, ToggleSwitch, Section } from '@/components/patient-profile';
import { useDoctorProfile, useUpdateDoctorProfile } from '@/hooks/useDoctorDashboard';
import { Button } from '@/components/ui/button';

export default function DoctorSettingsPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  // Form state - initialized from profile data
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Notification settings
  const [reminders, setReminders] = useState(true);
  const [prescriptions, setPrescriptions] = useState(true);
  const [cancellations, setCancellations] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Privacy settings
  const [dataVisibility, setDataVisibility] = useState('Patients you treat');
  const [sessionManagement, setSessionManagement] = useState('2 active sessions');

  const { data: profile, isLoading, error: profileError, refetch } = useDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();

  // Initialize form state when profile loads
  useEffect(() => {
    if (profile && !editing) {
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile, editing]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    setNotice('');

    try {
      // Update phone via doctor profile update (or user API)
      await updateProfile.mutateAsync({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: phone || null,
      });

      setEditing(false);
      setSaved(true);
      setNotice('Settings updated successfully');

      // Refetch profile to get updated data
      void refetch();

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
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DoctorPortalShell active="Settings">
        <div className="space-y-5">
          {notice && (
            <div
              role="status"
              className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
            >
              <span>{notice}</span>
              <button onClick={() => setNotice('')} aria-label="Dismiss">
                ×
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && !profile && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
                <p className="text-muted-foreground">Loading settings...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {(profileError || error) && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle className="size-5" aria-hidden="true" />
              <p>{error || 'Failed to load settings'}</p>
              <button
                onClick={() => refetch()}
                className="ml-auto text-sm underline hover:text-red-800"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && (
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
                  <Button
                    onClick={() => (editing ? save() : setEditing(true))}
                    className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black hover:opacity-90"
                    disabled={saving}
                  >
                    {saving ? (
                      'Saving...'
                    ) : editing ? (
                      <>
                        <Save className="size-4" /> Save changes
                      </>
                    ) : (
                      'Edit settings'
                    )}
                  </Button>
                </div>
              </div>

              {/* Account */}
              <Section
                title="Account"
                description="Manage your contact details and security credentials."
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Email"
                    value={email}
                    onChange={editing ? setEmail : undefined}
                    type="email"
                    disabled={true} // Email typically managed via auth
                    placeholder="doctor@example.com"
                  />
                  <FormField
                    label="Phone"
                    value={phone}
                    onChange={editing ? setPhone : undefined}
                    type="tel"
                    disabled={!editing}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Button
                    variant="outline"
                    className="border-border hover:bg-secondary flex h-11 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold"
                    disabled={!editing}
                  >
                    <LockKeyhole className="text-primary size-4" aria-hidden="true" />
                    Change password
                  </Button>
                </div>
              </Section>

              {/* Notifications */}
              <Section
                title="Notifications"
                description="Configure alerts for patient appointments and updates."
                icon={<Bell className="size-5" />}
              >
                <div className="mt-5 grid gap-3">
                  <ToggleSwitch
                    label="Appointment reminders"
                    description="Get notified before upcoming patient visits."
                    value={reminders}
                    onChange={setReminders}
                    disabled={!editing}
                  />
                  <ToggleSwitch
                    label="Prescription notifications"
                    description="Know when a prescription is ready for review."
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
                    value={emailNotifications}
                    onChange={setEmailNotifications}
                    disabled={!editing}
                  />
                  <ToggleSwitch
                    label="SMS notifications"
                    description="Receive reminders and updates by text."
                    value={smsNotifications}
                    onChange={setSmsNotifications}
                    disabled={!editing}
                  />
                </div>
              </Section>

              {/* Privacy & Security */}
              <Section
                title="Privacy"
                description="Manage data visibility and active sessions."
                icon={<Shield className="size-5" />}
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Data visibility"
                    value={dataVisibility}
                    onChange={editing ? setDataVisibility : undefined}
                    disabled={!editing}
                    placeholder="Patients you treat"
                  />
                  <FormField
                    label="Session management"
                    value={sessionManagement}
                    onChange={editing ? setSessionManagement : undefined}
                    disabled={!editing}
                    placeholder="2 active sessions"
                  />
                </div>
                <div className="bg-secondary text-muted-foreground mt-4 rounded-xl p-4 text-xs">
                  MediBook uses HIPAA-compliant encryption and role-based access to keep patient
                  records and medical communications secure.
                </div>
              </Section>
            </>
          )}
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
