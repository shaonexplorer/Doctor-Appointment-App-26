'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Stethoscope,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';
import { SPECIALTIES, DESIGNATIONS, CLINICS } from '@doctor-appointment-app/shared';
import { DataTable } from './data-table';
import { type DataTableFeatures } from './data-table-features';

interface Doctor {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  clinic: string;
  today: number;
  next: string;
  availability: 'Available' | 'In consultation' | 'On break' | 'Available at 10:45' | 'Off today';
  status: 'ACTIVE' | 'OFFLINE';
  patients: number;
  utilization: number;
}

interface AddDoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  clinic: string;
  fee: string;
  bio: string;
}

const INITIAL_FORM_DATA: AddDoctorFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  specialty: '',
  designation: '',
  licenseNo: '',
  clinic: '',
  fee: '',
  bio: '',
};

const doctors: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Michael Anderson',
    initials: 'MA',
    specialty: 'Cardiology',
    clinic: 'MediBook Downtown',
    today: 8,
    next: '09:30 AM',
    availability: 'Available',
    status: 'ACTIVE',
    patients: 248,
    utilization: 88,
  },
  {
    id: 'DOC-002',
    name: 'Dr. Emily Carter',
    initials: 'EC',
    specialty: 'Internal Medicine',
    clinic: 'MediBook Westside',
    today: 6,
    next: '10:00 AM',
    availability: 'In consultation',
    status: 'ACTIVE',
    patients: 196,
    utilization: 82,
  },
  {
    id: 'DOC-003',
    name: 'Dr. James Wilson',
    initials: 'JW',
    specialty: 'Neurology',
    clinic: 'MediBook Downtown',
    today: 4,
    next: '11:00 AM',
    availability: 'Available at 10:45',
    status: 'ACTIVE',
    patients: 84,
    utilization: 54,
  },
  {
    id: 'DOC-004',
    name: 'Dr. Priya Shah',
    initials: 'PS',
    specialty: 'Dermatology',
    clinic: 'MediBook Westside',
    today: 3,
    next: '01:30 PM',
    availability: 'On break',
    status: 'ACTIVE',
    patients: 196,
    utilization: 76,
  },
  {
    id: 'DOC-005',
    name: 'Dr. Robert Kim',
    initials: 'RK',
    specialty: 'Orthopedics',
    clinic: 'MediBook East',
    today: 0,
    next: 'Tomorrow',
    availability: 'Off today',
    status: 'OFFLINE',
    patients: 68,
    utilization: 42,
  },
];

const statCards = [
  { label: 'Total doctors', value: '24', icon: Stethoscope, tone: 'blue' },
  { label: 'Available now', value: '12', icon: CheckCircle2, tone: 'green' },
  { label: 'In consultation', value: '8', icon: Clock3, tone: 'amber' },
  { label: 'Avg utilization', value: '74.8%', icon: Activity, tone: 'purple' },
] as const;

const toneStyles: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-violet-50 text-violet-600',
};

const availabilityVariant: Record<string, 'success' | 'warning' | 'default' | 'secondary'> = {
  Available: 'success',
  'In consultation': 'warning',
  'Available at 10:45': 'warning',
  'On break': 'default',
  'Off today': 'secondary',
};

const doctorColumnHelper = createColumnHelper<DataTableFeatures, Doctor>();

export function StaffDoctors() {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [notice, setNotice] = useState('');
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [formData, setFormData] = useState<AddDoctorFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Partial<AddDoctorFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const action = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const openDrawer = (doctor: Doctor) => {
    setSelected(doctor);
  };

  const closeDrawer = () => {
    setSelected(null);
  };

  // Column definitions for TanStack Table
  const doctorColumns = useMemo(
    () =>
      doctorColumnHelper.columns([
        doctorColumnHelper.accessor('name', {
          header: 'Doctor',
          cell: ({ row }) => {
            const doctor = row.original;
            return (
              <button
                onClick={() => openDrawer(doctor)}
                className="flex w-full items-center gap-3 text-left"
              >
                <Avatar initials={doctor.initials} />
                <span className="font-bold">{doctor.name}</span>
              </button>
            );
          },
        }),
        doctorColumnHelper.accessor('specialty', {
          header: 'Specialty & clinic',
          cell: ({ row }) => {
            const doctor = row.original;
            return (
              <div>
                <p className="font-semibold">{doctor.specialty}</p>
                <p className="text-muted-foreground text-xs">{doctor.clinic}</p>
              </div>
            );
          },
        }),
        doctorColumnHelper.accessor('today', {
          header: 'Today',
          cell: ({ getValue }) => (
            <span className="text-xs font-semibold">{getValue()} appointments</span>
          ),
        }),
        doctorColumnHelper.accessor('next', {
          header: 'Next appointment',
          cell: ({ getValue }) => <span className="text-xs font-semibold">{getValue()}</span>,
        }),
        doctorColumnHelper.accessor('availability', {
          header: 'Availability',
          cell: ({ getValue }) => <AvailabilityBadge value={getValue() as string} />,
          filterFn: 'includesString',
        }),
        doctorColumnHelper.accessor('utilization', {
          header: 'Utilization',
          cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
              <div className="bg-muted h-1.5 w-16 rounded-full">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${getValue()}%` }}
                />
              </div>
              <span className="text-xs">{getValue()}%</span>
            </div>
          ),
        }),
        doctorColumnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => {
            const doctor = row.original;
            return (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDrawer(doctor)}
                aria-label={`View schedule for ${doctor.name}`}
              >
                Schedule
              </Button>
            );
          },
          enableSorting: false,
          enableHiding: false,
        }),
      ]),
    [openDrawer, action]
  );

  const validateForm = (data: AddDoctorFormData): Partial<AddDoctorFormData> => {
    const errors: Partial<AddDoctorFormData> = {};

    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
    if (!data.phone.trim()) errors.phone = 'Phone number is required';
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(data.password))
      errors.password = 'Password must contain at least one uppercase letter';
    else if (!/[a-z]/.test(data.password))
      errors.password = 'Password must contain at least one lowercase letter';
    else if (!/[0-9]/.test(data.password))
      errors.password = 'Password must contain at least one number';
    else if (!/[^A-Za-z0-9]/.test(data.password))
      errors.password = 'Password must contain at least one special character';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!data.specialty) errors.specialty = 'Specialty is required';
    if (!data.designation) errors.designation = 'Designation is required';
    if (!data.licenseNo.trim()) errors.licenseNo = 'License number is required';
    if (!data.clinic) errors.clinic = 'Clinic is required';
    if (!data.fee.trim()) errors.fee = 'Consultation fee is required';
    else if (parseFloat(data.fee) <= 0) errors.fee = 'Fee must be greater than 0';

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const fullName = `Dr. ${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // Call the backend API to register the doctor
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          userType: 'DOCTOR',
          specialty: formData.specialty,
          designation: formData.designation,
          licenseNo: formData.licenseNo.trim(),
          bio: formData.bio.trim() || null,
          fee: parseFloat(formData.fee),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to register doctor');
      }

      action(`${fullName} registered successfully! Invitation sent to ${formData.email}`);

      // Reset form and close modal
      setFormData(INITIAL_FORM_DATA);
      setIsAddDoctorOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register doctor';
      setFormErrors({ email: message });
      action(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof AddDoctorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const openAddDoctorModal = () => {
    setIsAddDoctorOpen(true);
  };

  const closeAddDoctorModal = () => {
    setIsAddDoctorOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  return (
    <section className="mt-8 space-y-5" aria-label="Doctor management">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="p-5 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">{label}</p>
                <span className={`rounded-xl p-2 ${toneStyles[tone]}`}>
                  <Icon className="size-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-black tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctors Table */}
      <Card className="overflow-hidden p-5 shadow-sm">
        <div className="border-border mb-5 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Doctors on duty</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Coordinate availability and patient flow with the clinical team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={openAddDoctorModal}>
              <UserPlus className="mr-2 size-4" />
              Add doctor
            </Button>
          </div>
        </div>

        {/* DataTable with TanStack Table - handles filtering, sorting, pagination */}
        <DataTable
          columns={doctorColumns}
          data={doctors}
          searchPlaceholder="Search doctors, specialties, or clinics..."
          searchKey="name"
        />

        {/* Mobile Card View */}
        <div className="grid gap-3 p-4 md:hidden">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onView={() => openDrawer(doctor)} />
          ))}
        </div>
      </Card>

      {/* Notification Toast */}
      {notice && (
        <div
          role="status"
          className="bg-foreground text-background fixed right-5 bottom-24 z-40 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}

      {/* Doctor Profile Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && closeDrawer()}>
        <SheetContent side="right" className="w-full max-w-md">
          {selected && (
            <DoctorProfileDrawer doctor={selected} onClose={closeDrawer} onAction={action} />
          )}
        </SheetContent>
      </Sheet>

      {/* Add Doctor Modal */}
      <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Invite New Doctor</DialogTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill in the details below to send an invitation to a new doctor. They will receive an
              email to complete their profile setup.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="John"
                  aria-invalid={!!formErrors.firstName}
                  aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                />
                {formErrors.firstName && (
                  <p id="firstName-error" className="text-destructive text-xs" role="alert">
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Doe"
                  aria-invalid={!!formErrors.lastName}
                  aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                />
                {formErrors.lastName && (
                  <p id="lastName-error" className="text-destructive text-xs" role="alert">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="doctor@clinic.com"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                />
                {formErrors.email && (
                  <p id="email-error" className="text-destructive text-xs" role="alert">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                />
                {formErrors.phone && (
                  <p id="phone-error" className="text-destructive text-xs" role="alert">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? 'password-error' : undefined}
                />
                {formErrors.password && (
                  <p id="password-error" className="text-destructive text-xs" role="alert">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={!!formErrors.confirmPassword}
                  aria-describedby={
                    formErrors.confirmPassword ? 'confirmPassword-error' : undefined
                  }
                />
                {formErrors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-destructive text-xs" role="alert">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => handleChange('specialty', value)}
                  aria-invalid={!!formErrors.specialty}
                  aria-describedby={formErrors.specialty ? 'specialty-error' : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.specialty && (
                  <p id="specialty-error" className="text-destructive text-xs" role="alert">
                    {formErrors.specialty}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation">Designation *</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(value) => handleChange('designation', value)}
                  aria-invalid={!!formErrors.designation}
                  aria-describedby={formErrors.designation ? 'designation-error' : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.designation && (
                  <p id="designation-error" className="text-destructive text-xs" role="alert">
                    {formErrors.designation}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="licenseNo">License number *</Label>
                <Input
                  id="licenseNo"
                  value={formData.licenseNo}
                  onChange={(e) => handleChange('licenseNo', e.target.value)}
                  placeholder="MD-12345-STATE"
                  aria-invalid={!!formErrors.licenseNo}
                  aria-describedby={formErrors.licenseNo ? 'licenseNo-error' : undefined}
                />
                {formErrors.licenseNo && (
                  <p id="licenseNo-error" className="text-destructive text-xs" role="alert">
                    {formErrors.licenseNo}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clinic">Clinic *</Label>
                <Select
                  value={formData.clinic}
                  onValueChange={(value) => handleChange('clinic', value)}
                  aria-invalid={!!formErrors.clinic}
                  aria-describedby={formErrors.clinic ? 'clinic-error' : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLINICS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.clinic && (
                  <p id="clinic-error" className="text-destructive text-xs" role="alert">
                    {formErrors.clinic}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fee">Consultation fee ($) *</Label>
                <Input
                  id="fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fee}
                  onChange={(e) => handleChange('fee', e.target.value)}
                  placeholder="150.00"
                  aria-invalid={!!formErrors.fee}
                  aria-describedby={formErrors.fee ? 'fee-error' : undefined}
                />
                {formErrors.fee && (
                  <p id="fee-error" className="text-destructive text-xs" role="alert">
                    {formErrors.fee}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Professional bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Brief professional background, areas of expertise, and approach to patient care..."
                rows={4}
                className="resize-none"
              />
              <p className="text-muted-foreground text-xs">
                Optional — will be displayed on the doctor's public profile
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeAddDoctorModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending invitation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-4" />
                    Send invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function DoctorCard({ doctor, onView }: { doctor: Doctor; onView: () => void }) {
  return (
    <div className="border-border rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar initials={doctor.initials} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{doctor.name}</p>
            <p className="text-muted-foreground text-xs">{doctor.specialty}</p>
          </div>
        </div>
        <AvailabilityBadge value={doctor.availability} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Today" value={`${doctor.today} appointments`} />
        <Info label="Next" value={doctor.next} />
        <Info label="Clinic" value={doctor.clinic} />
        <Info label="Utilization" value={`${doctor.utilization}%`} />
      </div>
      <Button variant="outline" className="mt-4 w-full" onClick={onView}>
        View doctor
      </Button>
    </div>
  );
}

function DoctorProfileDrawer({
  doctor,
  onClose,
  onAction,
}: {
  doctor: Doctor;
  onClose: () => void;
  onAction: (message: string) => void;
}) {
  return (
    <div className="mt-4 flex h-screen flex-col space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-primary text-xs font-bold tracking-wider uppercase">Doctor profile</p>
          <h2 className="mt-2 text-2xl font-black">{doctor.name}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {doctor.specialty} · {doctor.clinic}
          </p>
        </div>
        {/* <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close doctor profile">
          <X className="size-5" />
        </Button> */}
      </div>
      <div className="bg-muted/30 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Avatar initials={doctor.initials} size="lg" />
          <div>
            <p className="text-sm font-bold">{doctor.availability}</p>
            <p className="text-muted-foreground text-xs">
              {doctor.today} appointments scheduled today
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Next appointment" value={doctor.next} />
        <Info label="Patients this month" value={`${doctor.patients}`} />
        <Info label="Slot utilization" value={`${doctor.utilization}%`} />
        <Info label="Current status" value={doctor.status} />
      </div>
      <div className="flex gap-3">
        <Button
          className="flex flex-1 items-center justify-start gap-2"
          onClick={() => onAction(`Schedule opened for ${doctor.name}`)}
        >
          <CalendarDays className="size-4" />
          View schedule
        </Button>
        <Button
          variant="outline"
          className="flex flex-1 items-center justify-start gap-2"
          onClick={() => onAction(`Message sent to ${doctor.name}`)}
        >
          <UserRound className="text-primary size-4" />
          Contact doctor
        </Button>
      </div>
    </div>
  );
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'size-8 text-[10px]',
    md: 'size-9 text-[10px]',
    lg: 'size-12 text-sm',
  };
  return (
    <div
      className={cn(
        'text-primary grid shrink-0 place-items-center rounded-full bg-blue-50 font-bold',
        sizeClasses[size]
      )}
    >
      {initials}
    </div>
  );
}

function AvailabilityBadge({ value }: { value: string }) {
  const variant = availabilityVariant[value] || 'default';
  return (
    <Badge variant={variant} className="text-[10px] font-bold">
      {value}
    </Badge>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

export default StaffDoctors;
