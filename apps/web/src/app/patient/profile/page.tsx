'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import { ShieldCheck, Save, Check, AlertCircle } from 'lucide-react';
import { FormField, TextareaField, ProfileHeader, Section } from '@/components/patient-profile';
import { userApi, type UserProfile, type UpdateProfileInput } from '@/lib/api';

export default function PatientProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form state - initialized from profile data
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);

        // Initialize form fields from profile data
        setEmail(data.email);
        setPhone(data.phone || '');
        setFullName(`${data.firstName} ${data.lastName}`);
        setDob(
          data.patientProfile?.dob
            ? new Date(data.patientProfile.dob).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : ''
        );
        setBloodGroup(''); // Not stored in DB currently
        setEmergencyContact(data.patientProfile?.emergencyContact || '');
        setMedicalHistory(''); // Not stored in DB currently
        setAllergies(''); // Not stored in DB currently
        setExistingConditions(''); // Not stored in DB currently
        setCurrentMedications(''); // Not stored in DB currently
      } catch (err) {
        setError('Failed to load profile. Please try again.');
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
      // Prepare update data based on user type
      const updateData: UpdateProfileInput = {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: phone || null,
        // Patient fields
        dob: dob ? new Date(dob).toISOString().split('T')[0] : null,
        emergencyContact: emergencyContact || null,
      };

      // Only include patient-specific fields for patients
      if (profile?.userType === 'PATIENT') {
        updateData.gender = null; // Not in form
        updateData.address = null; // Not in form
      }

      await userApi.updateProfile(updateData);
      setEditing(false);
      setSaved(true);

      // Refetch profile to get updated data
      const updatedProfile = await userApi.getProfile();
      setProfile(updatedProfile);

      // Hide saved message after 3 seconds
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Profile">
        <div className="space-y-5">
          {/* Loading state */}
          {profile === null && !error && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
                <p className="text-muted-foreground">Loading profile...</p>
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
                  <h2 className="text-lg font-black">My profile</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Keep your personal and medical information up to date.
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
                      'Edit profile'
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Header */}
              <ProfileHeader
                name={`${profile.firstName} ${profile.lastName}`}
                initials={`${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()}
                subtitle={`Patient account · Member since ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                editing={editing}
                helperText={
                  editing
                    ? 'Choose a clear photo for your care team'
                    : 'Your profile is visible to doctors you book with'
                }
              />

              {/* Personal Information */}
              <Section title="Personal information">
                <div className="my-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full name"
                    value={editing ? fullName : `${profile.firstName} ${profile.lastName}`}
                    onChange={editing ? setFullName : undefined}
                    disabled={!editing}
                  />
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
                  <FormField
                    label="Date of birth"
                    value={dob}
                    onChange={editing ? setDob : undefined}
                    disabled={!editing}
                    placeholder="MM/DD/YYYY"
                  />
                  <FormField
                    label="Blood group"
                    value={bloodGroup || 'Not specified'}
                    onChange={editing ? setBloodGroup : undefined}
                    disabled={!editing}
                  />
                  <FormField
                    label="Emergency contact"
                    value={emergencyContact}
                    onChange={editing ? setEmergencyContact : undefined}
                    disabled={!editing}
                    placeholder="Name · Phone"
                  />
                </div>
                <TextareaField
                  label="Medical history summary"
                  value={medicalHistory}
                  onChange={editing ? setMedicalHistory : undefined}
                  disabled={!editing}
                  placeholder="Add relevant medical history..."
                />
              </Section>

              {/* Medical Information */}
              <Section
                title="Medical information"
                description="This information helps your care team prepare for visits."
                icon={<ShieldCheck className="size-5" />}
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Blood group"
                    value={bloodGroup || 'Not specified'}
                    onChange={editing ? setBloodGroup : undefined}
                    disabled={!editing}
                  />
                  <FormField
                    label="Allergies"
                    value={allergies}
                    onChange={editing ? setAllergies : undefined}
                    disabled={!editing}
                    placeholder="e.g., Penicillin, pollen"
                  />
                  <FormField
                    label="Existing conditions"
                    value={existingConditions}
                    onChange={editing ? setExistingConditions : undefined}
                    disabled={!editing}
                    placeholder="e.g., Seasonal allergies"
                  />
                  <FormField
                    label="Current medications"
                    value={currentMedications}
                    onChange={editing ? setCurrentMedications : undefined}
                    disabled={!editing}
                    placeholder="e.g., Cetirizine 10 mg as needed"
                  />
                  <FormField
                    label="Emergency contact"
                    value={emergencyContact}
                    onChange={editing ? setEmergencyContact : undefined}
                    disabled={!editing}
                    placeholder="Name · Phone"
                  />
                </div>
              </Section>
            </>
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
