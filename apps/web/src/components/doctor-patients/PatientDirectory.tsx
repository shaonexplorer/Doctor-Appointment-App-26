'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Patient } from './types';
import { PatientTable } from './PatientTable';
import { PatientCard } from './PatientCard';
import { PatientDrawer } from './PatientDrawer';
import { EmptyState } from './EmptyState';
import {
  useDoctorPatients,
  useDoctorPatientDetail,
  transformPatientsToUI,
} from '@/hooks/useDoctorPatients';

export function PatientDirectory() {
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Fetch doctor's patients from API
  const {
    data: patientResponse,
    isLoading,
    error,
    refetch,
  } = useDoctorPatients({
    page: 1,
    limit: 50,
  });

  // Transform API data to UI format
  const patients = useMemo(() => {
    if (!patientResponse?.data) return [];
    return transformPatientsToUI(patientResponse.data);
  }, [patientResponse?.data]);

  // Client-side search filtering
  const filteredPatients = useMemo(
    () =>
      patients.filter((p) =>
        `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(search.toLowerCase())
      ),
    [patients, search]
  );

  // Fetch detailed patient data when one is selected
  const { data: patientDetail } = useDoctorPatientDetail(selectedPatientId || undefined);

  // Get the basic patient data for the selected patient
  const selectedPatientBasic = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Combine basic and detailed data for the drawer
  const selectedPatient = useMemo(() => {
    if (!selectedPatientBasic) return null;

    if (patientDetail) {
      return {
        ...selectedPatientBasic,
      };
    }

    return selectedPatientBasic;
  }, [selectedPatientBasic, patientDetail]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
  };

  const handleCloseDrawer = () => {
    setSelectedPatientId(null);
  };

  const handleScheduleAppointment = (patient: Patient) => {
    console.log('Schedule appointment for:', patient.name);
    handleCloseDrawer();
  };

  const handleViewFullRecord = (patient: Patient) => {
    console.log('View full record for:', patient.name);
    handleCloseDrawer();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-8 space-y-5">
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-12 w-1/3 rounded-lg" />
          <div className="bg-muted h-64 rounded-2xl" />
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

  return (
    <div className="mt-8 space-y-5">
      {/* Search bar */}
      <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="relative max-w-[450px] min-w-[240px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search patients"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Patient name, ID, or condition"
              className={cn(
                'border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none',
                'transition-colors'
              )}
            />
          </label>
          <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold">
            Add patient
          </button>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          <span className="text-primary font-bold">{filteredPatients.length}</span> patients in your
          care panel
        </p>
      </div>

      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        {filteredPatients.length ? (
          <>
            <PatientTable patients={filteredPatients} onViewPatient={handleViewPatient} />
            <div className="grid gap-3 p-4 md:hidden">
              {filteredPatients.map((p) => (
                <PatientCard key={p.id} patient={p} onViewPatient={handleViewPatient} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>
      <PatientDrawer
        patient={selectedPatient}
        onClose={handleCloseDrawer}
        onScheduleAppointment={handleScheduleAppointment}
        onViewFullRecord={handleViewFullRecord}
      />
    </div>
  );
}

export default PatientDirectory;
