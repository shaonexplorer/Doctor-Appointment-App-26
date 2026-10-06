'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Languages,
  MapPin,
  ShieldCheck,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react';
import { DoctorPortalShell } from '@/components/doctor-portal';
import { useDoctorProfile, useUpdateDoctorProfile } from '@/hooks/useDoctorDashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const dates = ['Today', 'Tomorrow', 'Fri', 'Sat', 'Sun', 'Mon'];
const slots = {
  Morning: ['09:00 AM', '09:20 AM', '09:40 AM'],
  Afternoon: ['02:00 PM', '02:20 PM', '02:40 PM'],
  Evening: ['07:00 PM', '07:20 PM', '07:40 PM'],
};

export default function DoctorProfilePage() {
  const [date, setDate] = useState('Today');
  const [selected, setSelected] = useState('09:20 AM');
  const [notice, setNotice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    specialty: '',
    designation: '',
    licenseNo: '',
    bio: '',
    fee: '',
  });

  const { data: profile, isLoading, error, refetch } = useDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();

  // Initialize form data when profile loads
  if (profile && !isEditing) {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      specialty: profile.specialty || '',
      designation: profile.designation || '',
      licenseNo: profile.licenseNo || '',
      bio: profile.bio || '',
      fee: profile.fee?.toString() || '',
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setNotice('Profile updated successfully');
        void refetch();
      },
      onError: () => {
        setNotice('Failed to update profile');
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
        <DoctorPortalShell active="Profile">
          <div className="flex flex-col gap-5">
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
              <p className="text-destructive">Failed to load profile</p>
              <button
                onClick={() => refetch()}
                className="bg-primary text-primary-foreground mt-2 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  const initials =
    `${profile?.firstName?.charAt(0) || ''}${profile?.lastName?.charAt(0) || ''}`.toUpperCase() ||
    'DR';
  const fullName = `Dr. ${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const designation = profile?.designation || 'Consultant';
  const specialty = profile?.specialty || 'General Medicine';
  const fee = profile?.fee ? `$${profile.fee}/visit` : '$0/visit';

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DoctorPortalShell active="Profile">
        <div className="flex flex-col gap-6">
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

          {/* Profile Header */}
          <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
            <div className="h-28 bg-gradient-to-r from-[#dce8ff] via-[#edf3ff] to-[#e9f8f3]" />
            <div className="-mt-12 flex min-w-0 flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
              <div className="flex min-w-0 flex-wrap items-end gap-4">
                <div className="border-card text-primary grid size-24 shrink-0 place-items-center rounded-3xl border-4 bg-[#dce8ff] text-2xl font-black shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight">{fullName}</h2>
                    {profile?.isVerified && (
                      <BadgeCheck
                        className="fill-primary text-card size-5"
                        aria-label="Verified doctor"
                      />
                    )}
                  </div>
                  <p className="text-primary mt-1 font-semibold">
                    {designation} {specialty}
                  </p>
                  <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-[#c28a31]">
                      <Star className="size-3.5 fill-current" /> 4.9 (128 reviews)
                    </span>
                    <span>18 years experience</span>
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Consultation fee
                  </p>
                  <p className="text-2xl font-black">{fee}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-black shadow-sm hover:opacity-90"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col gap-6">
              {/* About Section */}
              <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-black">About</h2>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="fee"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          Consultation Fee ($)
                        </Label>
                        <Input
                          id="fee"
                          name="fee"
                          type="number"
                          value={formData.fee}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="specialty"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          Specialty
                        </Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="designation"
                          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                        >
                          Designation
                        </Label>
                        <Input
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="licenseNo"
                        className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                      >
                        License Number
                      </Label>
                      <Input
                        id="licenseNo"
                        name="licenseNo"
                        value={formData.licenseNo}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="bio"
                        className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                      >
                        Bio / Clinic Information
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-primary text-primary-foreground">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: profile?.firstName || '',
                            lastName: profile?.lastName || '',
                            phone: profile?.phone || '',
                            specialty: profile?.specialty || '',
                            designation: profile?.designation || '',
                            licenseNo: profile?.licenseNo || '',
                            bio: profile?.bio || '',
                            fee: profile?.fee?.toString() || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-muted-foreground mt-3 text-sm leading-7">
                      {profile?.bio ||
                        'Dr. Anderson is a board-certified cardiologist focused on thoughtful, evidence-based care for every stage of heart health. He combines clinical expertise with a calm, patient-first approach.'}
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <ProfileInfo
                        icon={Award}
                        label="Qualifications"
                        value="MD, FACC · Harvard Medical School"
                      />
                      <ProfileInfo icon={Stethoscope} label="Specialties" value={specialty} />
                      <ProfileInfo
                        icon={Check}
                        label="Symptoms handled"
                        value="Chest pain · Hypertension · Palpitations"
                      />
                      <ProfileInfo
                        icon={Languages}
                        label="Languages"
                        value="English · Spanish · French"
                      />
                    </div>
                  </>
                )}
              </section>

              {/* Clinic Information */}
              <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black">Clinic information</h2>
                    <p className="text-muted-foreground mt-1 text-xs">Heart & Vascular Center</p>
                  </div>
                  <div className="bg-secondary text-primary grid size-10 place-items-center rounded-xl">
                    <MapPin className="size-5" />
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ProfileInfo
                    icon={MapPin}
                    label="Address"
                    value="240 Madison Avenue, New York, NY"
                  />
                  <ProfileInfo
                    icon={Clock3}
                    label="Consultation duration"
                    value="30 minutes per visit"
                  />
                  <ProfileInfo
                    icon={ShieldCheck}
                    label="Cancellation policy"
                    value="Free cancellation up to 24 hours before"
                  />
                  <ProfileInfo
                    icon={Video}
                    label="Visit options"
                    value="In-clinic or secure video visit"
                  />
                </div>
              </section>
            </div>

            {/* Schedule Section */}
            <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">Choose a date & time</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Select one available slot to continue.
                  </p>
                </div>
                <CalendarDays className="text-primary size-5" />
              </div>
              <div className="mt-5 grid grid-cols-6 gap-2">
                {dates.map((item, i) => (
                  <button
                    key={item}
                    onClick={() => setDate(item)}
                    className={`rounded-xl border px-1 py-3 text-center transition ${date === item ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <span className="block text-[10px] font-bold uppercase">{item}</span>
                    <span className="mt-1 block text-sm font-black">{21 + i}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {Object.entries(slots).map(([period, times]) => (
                  <div key={period}>
                    <p className="text-muted-foreground mb-2 text-xs font-black tracking-wider uppercase">
                      {period}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {times.map((time, i) => {
                        const booked = period === 'Afternoon' && i === 1;
                        const unavailable = period === 'Evening' && i === 2;
                        const active = selected === time && !booked && !unavailable;
                        return (
                          <button
                            key={time}
                            disabled={booked || unavailable}
                            onClick={() => setSelected(time)}
                            className={`rounded-xl border py-3 text-xs font-black transition ${active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : booked ? 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through' : unavailable ? 'border-border bg-background text-muted-foreground/50 cursor-not-allowed' : 'border-border bg-background hover:border-primary hover:text-primary'}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-border text-muted-foreground mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5">
                  <i className="bg-primary size-2 rounded-full" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="border-border bg-background size-2 rounded-full border" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="bg-muted size-2 rounded-full" /> Booked
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="bg-background ring-border size-2 rounded-full ring-1" /> Unavailable
                </span>
              </div>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 mt-5 w-full"
                onClick={() => setNotice('More appointment dates will be available soon.')}
              >
                <CalendarDays className="mr-2 size-4" /> View more dates
              </Button>
              <Button
                className="bg-primary text-primary-foreground mt-3 w-full"
                onClick={() => setNotice(`Appointment request started for ${date}, ${selected}.`)}
              >
                <CalendarDays className="mr-2 size-4" /> Book Appointment
              </Button>
            </section>
          </div>

          {/* Patient Reviews */}
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">Patient reviews</h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  What patients say about their visits
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-black text-[#c28a31]">
                <Star className="size-4 fill-current" /> 4.9 overall
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Review
                text="Dr. Anderson took the time to explain everything clearly. I felt heard and cared for."
                name="Rachel M."
                date="2 weeks ago"
              />
              <Review
                text="The video visit was punctual, calm, and incredibly helpful. Highly recommend."
                name="David K."
                date="1 month ago"
              />
              <Review
                text="A thoughtful doctor and a wonderful clinic team. Booking was seamless."
                name="Priya S."
                date="2 months ago"
              />
            </div>
          </section>
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

function Review({ text, name, date }: { text: string; name: string; date: string }) {
  return (
    <div className="border-border rounded-xl border p-4">
      <div className="flex gap-1 text-[#c28a31]">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="size-3 fill-current" />
        ))}
      </div>
      <p className="text-muted-foreground mt-3 text-xs leading-5">"{text}"</p>
      <p className="mt-3 text-xs font-black">
        {name} <span className="text-muted-foreground font-medium">· {date}</span>
      </p>
    </div>
  );
}
