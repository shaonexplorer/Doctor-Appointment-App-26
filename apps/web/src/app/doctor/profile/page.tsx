'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import {
  ShieldCheck,
  Save,
  Check,
  AlertCircle,
  Stethoscope,
  Award,
  CalendarDays,
  MapPin,
  Clock,
  Shield,
  Bell,
  Mail,
  Smartphone,
} from 'lucide-react';
import { DoctorPortalShell } from '@/components/doctor-portal';
import { useDoctorProfile, useUpdateDoctorProfile } from '@/hooks/useDoctorDashboard';
import { Button } from '@/components/ui/button';

import {
  FormField,
  TextareaField,
  Section,
  ProfileHeader,
  ToggleSwitch,
} from '@/components/patient-profile';
export default function DoctorProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  // Form state - professional information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [designation, setDesignation] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [bio, setBio] = useState('');
  const [fee, setFee] = useState('');

  // Clinic information (display only for now)
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [consultationDuration, setConsultationDuration] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [visitOptions, setVisitOptions] = useState('');

  // Notification settings
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [prescriptionNotifications, setPrescriptionNotifications] = useState(true);
  const [cancellationNotifications, setCancellationNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Privacy settings
  const [dataVisibility, setDataVisibility] = useState('Patients you treat');
  const [sessionManagement, setSessionManagement] = useState('2 active sessions');

  const { data: profile, isLoading, error: profileError, refetch } = useDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();

  console.log('Doctor profile data:', profile);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile && !editing) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phone || '');
      setSpecialty(profile.specialty || '');
      setDesignation(profile.designation || '');
      setLicenseNo(profile.licenseNo || '');
      setBio(profile.bio || '');
      setFee(profile.fee?.toString() || '');

      // Clinic info (from profile or defaults)
      setClinicName('Heart & Vascular Center');
      setClinicAddress('240 Madison Avenue, New York, NY');
      setConsultationDuration('30 minutes per visit');
      setCancellationPolicy('Free cancellation up to 24 hours before');
      setVisitOptions('In-clinic or secure video visit');
    }
  }, [profile, editing]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    setNotice('');

    try {
      const updateData = {
        firstName,
        lastName,
        phone: phone || null,
        specialty: specialty || null,
        designation: designation || null,
        licenseNo: licenseNo || null,
        bio: bio || null,
        fee: fee ? parseInt(fee, 10) : null,
      };

      await updateProfile.mutateAsync(updateData);
      setEditing(false);
      setSaved(true);
      setNotice('Profile updated successfully');
      void refetch();

      // Hide saved message after 3 seconds
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // const handleCancel = () => {
  //   if (profile) {
  //     setFirstName(profile.firstName || '');
  //     setLastName(profile.lastName || '');
  //     setPhone(profile.phone || '');
  //     setSpecialty(profile.specialty || '');
  //     setDesignation(profile.designation || '');
  //     setLicenseNo(profile.licenseNo || '');
  //     setBio(profile.bio || '');
  //     setFee(profile.fee?.toString() || '');
  //   }
  //   setEditing(false);
  //   setError(null);
  //   setNotice('');
  // };

  const initials =
    `${profile?.firstName?.charAt(0) || ''}${profile?.lastName?.charAt(0) || ''}`.toUpperCase() ||
    'DR';
  const fullName = `Dr. ${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const designationText = profile?.designation || 'Consultant';
  const specialtyText = profile?.specialty || 'General Medicine';
  // const feeText = profile?.fee ? `$${profile.fee}/visit` : '$0/visit';

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
        <DoctorPortalShell active="Profile">
          <div className="flex animate-pulse flex-col gap-5">
            <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
              <div className="h-28 bg-gradient-to-r from-[#dce8ff] via-[#edf3ff] to-[#e9f8f3]" />
              <div className="-mt-12 flex min-w-0 flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
                <div className="flex min-w-0 flex-wrap items-end gap-4">
                  <div className="border-card text-primary grid size-24 shrink-0 place-items-center rounded-3xl border-4 bg-[#dce8ff] text-2xl font-black shadow-sm">
                    <div className="bg-muted h-10 w-10 rounded-full" />
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="bg-muted h-8 w-48 rounded" />
                    <div className="bg-muted mt-2 h-4 w-32 rounded" />
                    <div className="bg-muted mt-2 h-3 w-40 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col gap-6">
                <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
                  <div className="bg-muted mb-4 h-6 w-32 rounded" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted h-10 w-full rounded" />
                    <div className="bg-muted h-10 w-full rounded" />
                  </div>
                </section>
                <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
                  <div className="bg-muted mb-4 h-6 w-40 rounded" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted h-10 w-full rounded" />
                    <div className="bg-muted h-10 w-full rounded" />
                    <div className="bg-muted h-10 w-full rounded" />
                    <div className="bg-muted h-10 w-full rounded" />
                  </div>
                </section>
              </div>
              <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
                <div className="bg-muted mb-4 h-6 w-40 rounded" />
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-muted h-20 rounded-xl" />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  if (profileError || error) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
        <DoctorPortalShell active="Profile">
          <div className="flex flex-col gap-5">
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
                <AlertCircle className="size-5" aria-hidden="true" />
                <p>{error || 'Failed to load profile'}</p>
                <button
                  onClick={() => refetch()}
                  className="bg-primary text-primary-foreground ml-auto rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DoctorPortalShell active="Profile">
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

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle className="size-5" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-black">My profile</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Manage your professional information, clinic details, and preferences.
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
                onClick={() => (editing ? handleSave() : setEditing(true))}
                disabled={saving}
                className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black hover:opacity-90"
              >
                {saving ? (
                  'Saving...'
                ) : editing ? (
                  <>
                    <Save className="size-4" /> Save changes
                  </>
                ) : (
                  'Edit profile'
                )}
              </Button>
            </div>
          </div>

          {/* Profile Header */}
          <ProfileHeader
            name={fullName}
            initials={initials}
            subtitle={`${designationText} · ${specialtyText} · Member since ${new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
            editing={editing}
            helperText={
              editing
                ? 'Choose a clear photo for your patients and colleagues'
                : 'Your profile is visible to patients you treat'
            }
          />

          {/* Professional Information */}
          <Section
            title="Professional information"
            description="Your medical credentials and practice details."
          >
            <div className="my-5 grid gap-4 sm:grid-cols-2">
              <FormField
                label="First name"
                value={firstName}
                onChange={editing ? setFirstName : undefined}
                disabled={!editing}
                placeholder="John"
              />
              <FormField
                label="Last name"
                value={lastName}
                onChange={editing ? setLastName : undefined}
                disabled={!editing}
                placeholder="Anderson"
              />
              <FormField
                label="Phone"
                value={phone}
                onChange={editing ? setPhone : undefined}
                type="tel"
                disabled={!editing}
                placeholder="+1 (555) 000-0000"
              />
              <FormField
                label="Consultation fee ($)"
                value={fee}
                onChange={editing ? setFee : undefined}
                type="text"
                disabled={!editing}
                placeholder="85"
              />
              <FormField
                label="Specialty"
                value={specialty}
                onChange={editing ? setSpecialty : undefined}
                disabled={!editing}
                placeholder="Cardiology"
              />
              <FormField
                label="Designation"
                value={designation}
                onChange={editing ? setDesignation : undefined}
                disabled={!editing}
                placeholder="Senior Consultant"
              />
            </div>
            <FormField
              label="Medical license number"
              value={licenseNo}
              onChange={editing ? setLicenseNo : undefined}
              disabled={!editing}
              placeholder="MD123456"
              className="mt-4"
            />
            <TextareaField
              label="Professional bio / About your practice"
              value={bio}
              onChange={editing ? setBio : undefined}
              disabled={!editing}
              placeholder="Describe your approach, experience, and what patients can expect..."
              rows={4}
              className="mt-4"
            />

            {/* Display professional info when not editing */}
            {!editing && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ProfileInfo
                  icon={Award}
                  label="Qualifications"
                  value="MD, FACC · Harvard Medical School"
                />
                <ProfileInfo icon={Stethoscope} label="Specialties" value={specialtyText} />
                <ProfileInfo
                  icon={Check}
                  label="Conditions treated"
                  value="Chest pain · Hypertension · Palpitations · Arrhythmia"
                />
                <ProfileInfo icon={Award} label="Languages" value="English · Spanish · French" />
              </div>
            )}
          </Section>

          {/* Clinic Information */}
          <Section
            title="Clinic information"
            description="Your practice location and consultation settings."
            icon={<MapPin className="size-5" />}
          >
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileInfo
                icon={MapPin}
                label="Clinic name"
                value={clinicName || 'Not specified'}
              />
              <ProfileInfo icon={MapPin} label="Address" value={clinicAddress || 'Not specified'} />
              <ProfileInfo
                icon={Clock}
                label="Consultation duration"
                value={consultationDuration || 'Not specified'}
              />
              <ProfileInfo
                icon={Shield}
                label="Cancellation policy"
                value={cancellationPolicy || 'Not specified'}
              />
              <ProfileInfo
                icon={CalendarDays}
                label="Visit options"
                value={visitOptions || 'Not specified'}
              />
            </div>
          </Section>

          {/* Notification Settings */}
          <Section
            title="Notifications"
            description="Control how you receive updates about your practice."
            icon={<Bell className="size-5" />}
          >
            <div className="mt-5 grid gap-3">
              <ToggleSwitch
                label="Appointment reminders"
                description="Get notified before upcoming patient visits."
                value={appointmentReminders}
                onChange={setAppointmentReminders}
                disabled={!editing}
              />
              <ToggleSwitch
                label="Prescription notifications"
                description="Know when a prescription is ready for review."
                value={prescriptionNotifications}
                onChange={setPrescriptionNotifications}
                disabled={!editing}
              />
              <ToggleSwitch
                label="Cancellation notifications"
                description="Stay informed about appointment changes."
                value={cancellationNotifications}
                onChange={setCancellationNotifications}
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
            title="Privacy & Security"
            description="Manage your data visibility and account security."
            icon={<ShieldCheck className="size-5" />}
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
              MediBook uses encryption and role-based access to keep your health information
              protected.
            </div>
          </Section>

          {/* Account Actions */}
          <Section title="Account" description="Security and account management.">
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="border-border hover:bg-secondary flex h-11 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold"
              >
                <Smartphone className="text-primary size-4" />
                Change password
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-secondary flex h-11 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold"
              >
                <Mail className="text-primary size-4" />
                Update email
              </Button>
            </div>
          </Section>
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}

function ProfileInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Award;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-secondary text-primary grid size-9 shrink-0 place-items-center rounded-lg">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {label}
        </p>
        <p className="mt-1 text-xs leading-5 font-bold">{value}</p>
      </div>
    </div>
  );
}
