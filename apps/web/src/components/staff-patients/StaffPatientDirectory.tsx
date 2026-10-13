'use client';

import { useMemo, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StaffPatient, StaffPatientFilters } from './types';
import { Metric } from './Metric';
import { PatientTable } from './PatientTable';
import { PatientCard } from './PatientCard';
import { PatientDrawer } from './PatientDrawer';
import { EmptyState } from './EmptyState';
import { RegisterPatientDialog } from './RegisterPatientDialog';
import { useStaffPatients } from '@/hooks/useStaffPatients';
import type { DoctorPatientListItem } from '@/lib/api';

export function StaffPatientDirectory() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StaffPatientFilters['status']>('All statuses');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Fetch staff patients from API
  const {
    data: patientResponse,
    isLoading,
    error,
    refetch,
  } = useStaffPatients({
    page: 1,
    limit: 50,
    search,
    status: status === 'All statuses' ? undefined : (status.toLowerCase() as 'active' | 'inactive'),
  });

  // Transform API data to UI format
  const patients = useMemo(() => {
    if (!patientResponse?.data) return [];
    return transformPatientsToUI(patientResponse.data);
  }, [patientResponse?.data]);

  // Client-side search filtering (additional to server-side)
  const filteredPatients = useMemo(
    () =>
      patients.filter((p) =>
        `${p.name} ${p.id} ${p.phone} ${p.email} ${p.doctor}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [patients, search]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: StaffPatientFilters['status']) => {
    setStatus(value);
  };

  const handleViewPatient = (patient: StaffPatient) => {
    setSelectedPatientId(patient.id);
  };

  const handleCloseDrawer = () => {
    setSelectedPatientId(null);
  };

  const handleScheduleAppointment = (patient: StaffPatient) => {
    console.log('Schedule appointment for:', patient.name);
    handleCloseDrawer();
  };

  const handleViewFullRecord = (patient: StaffPatient) => {
    console.log('View full record for:', patient.name);
    handleCloseDrawer();
  };

  const handleRegisterPatient = () => {
    setIsRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setIsRegisterOpen(false);
  };

  const handleRegisterSuccess = () => {
    // Refetch patients after successful registration
    refetch();
  };

  // Get selected patient for drawer
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-8 space-y-5">
        <div className="animate-pulse space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-muted border-border h-20 rounded-2xl border p-4" />
            <div className="bg-muted border-border h-20 rounded-2xl border p-4" />
            <div className="bg-muted border-border h-20 rounded-2xl border p-4" />
            <div className="bg-muted border-border h-20 rounded-2xl border p-4" />
          </div>
          <div className="bg-muted border-border h-64 rounded-2xl border" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-8 space-y-5">
        <div className="border-border bg-destructive/10 text-destructive rounded-2xl border p-4">
          <p className="font-medium">Failed to load patients</p>
          <p className="mt-1 text-sm">
            {(error as Error).message || 'An error occurred while fetching patient data'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total patients',
      value: patientResponse?.meta?.total?.toLocaleString() || '1,248',
      tone: 'bg-[#edf3ff] text-primary',
    },
    {
      label: 'Active patients',
      value: patientResponse?.meta?.total?.toLocaleString() || '1,106',
      tone: 'bg-[#e9f8f3] text-[#258c70]',
    },
    { label: 'New this month', value: '86', tone: 'bg-[#f1edff] text-[#7864c8]' },
    { label: 'Appointments today', value: '24', tone: 'bg-[#fff3e7] text-[#d68b42]' },
  ];

  return (
    <div className="mt-8 space-y-5">
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <Metric key={index} label={metric.label} value={metric.value} tone={metric.tone} />
        ))}
      </div>

      {/* Patient Directory Section */}
      <section className="border-border bg-card rounded-2xl p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">Patient directory</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Search and manage patient records across the clinic.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegisterPatient}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <UserPlus className="size-3.5" />
            Register patient
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search patient records"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search name, patient ID, phone, or email"
              className={cn(
                'border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2',
                'transition-colors'
              )}
            />
          </label>
          <select
            aria-label="Patient status"
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value as StaffPatientFilters['status'])
            }
            className="border-border bg-background h-11 rounded-xl border px-3 text-sm font-semibold"
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          <span className="text-primary font-bold">{filteredPatients.length}</span> records shown
        </p>
      </section>

      {/* Patient Table/Card Section */}
      <section className="border-border bg-card overflow-hidden rounded-2xl p-5 shadow-sm sm:p-6">
        {filteredPatients.length ? (
          <>
            <PatientTable patients={filteredPatients} onViewPatient={handleViewPatient} />
            <div className="grid gap-3 p-4 md:hidden">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} onViewPatient={handleViewPatient} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Patient Detail Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={handleCloseDrawer}
        onScheduleAppointment={handleScheduleAppointment}
        onViewFullRecord={handleViewFullRecord}
      />

      {/* Register Patient Dialog */}
      <RegisterPatientDialog
        isOpen={isRegisterOpen}
        onClose={handleRegisterClose}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}

// Transform backend patient data to UI format
function transformPatientsToUI(patients: DoctorPatientListItem[]): StaffPatient[] {
  return patients.map((patient) => {
    // Calculate age from DOB
    let age = 0;
    if (patient.dob) {
      const dob = new Date(patient.dob);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
    }

    // Get initials
    const initials = `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase();

    // Format last visit
    const lastVisit = patient.lastVisit
      ? new Date(patient.lastVisit).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

    // Format next appointment
    const nextAppointment = patient.nextAppointment
      ? new Date(patient.nextAppointment).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : '—';

    // Determine status
    const status = patient.nextAppointment ? 'Active' : 'Inactive';

    // Determine payment status (mock for now)
    const payment = patient.totalAppointments > 10 ? 'Paid' : 'Pending';

    // For staff portal, we need to show the assigned doctor
    // This would come from a staff-specific API endpoint
    // For now, use a fallback since the current API is for doctor's own patients
    const doctor = 'Dr. Unknown';

    return {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      initials,
      phone: patient.phone || '+1 (555) 000-0000',
      email: patient.email,
      age,
      gender: patient.gender || 'Unknown',
      lastVisit,
      diagnosis: patient.conditions?.[0] || 'No diagnosis',
      nextAppointment,
      doctor,
      totalVisits: patient.totalAppointments || 0,
      status,
      payment,
    };
  });
}

export default StaffPatientDirectory;
