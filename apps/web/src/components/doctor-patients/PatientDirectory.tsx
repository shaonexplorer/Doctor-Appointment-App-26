'use client';

import { useMemo, useState } from 'react';
import type { Patient, PatientFilters } from './types';
import { PatientFilters as PatientFiltersComponent } from './PatientFilters';
import { PatientTable } from './PatientTable';
import { PatientCard } from './PatientCard';
import { PatientDrawer } from './PatientDrawer';
import { EmptyState } from './EmptyState';

const mockPatients: Patient[] = [
  {
    id: 'MB-10482',
    name: 'Sarah Johnson',
    initials: 'SJ',
    age: 38,
    lastVisit: 'Sep 18, 2026',
    diagnosis: 'Hypertension',
    nextAppointment: 'Sep 28 · 09:30 AM',
    totalVisits: 12,
    condition: 'Hypertension',
    status: 'Confirmed',
  },
  {
    id: 'MB-10217',
    name: 'Robert Chen',
    initials: 'RC',
    age: 52,
    lastVisit: 'Sep 15, 2026',
    diagnosis: 'Type 2 diabetes',
    nextAppointment: 'Oct 02 · 10:00 AM',
    totalVisits: 8,
    condition: 'Diabetes',
    status: 'Pending',
  },
  {
    id: 'MB-10931',
    name: 'Emily Davis',
    initials: 'ED',
    age: 29,
    lastVisit: 'Sep 12, 2026',
    diagnosis: 'Chronic migraine',
    nextAppointment: '—',
    totalVisits: 5,
    condition: 'Migraine',
    status: 'Completed',
  },
  {
    id: 'MB-09844',
    name: 'Michael Brown',
    initials: 'MB',
    age: 64,
    lastVisit: 'Aug 29, 2026',
    diagnosis: 'Coronary artery disease',
    nextAppointment: 'Sep 25 · 02:00 PM',
    totalVisits: 21,
    condition: 'Cardiac',
    status: 'Confirmed',
  },
];

const allConditions = ['Hypertension', 'Diabetes', 'Migraine', 'Cardiac'];
const allStatuses = ['Confirmed', 'Pending', 'Completed'];

export function PatientDirectory() {
  const [filters, setFilters] = useState<PatientFilters>({
    search: '',
    condition: 'All conditions',
    status: 'All statuses',
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = useMemo(
    () =>
      mockPatients.filter(
        (p) =>
          `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.condition === 'All conditions' || p.condition === filters.condition) &&
          (filters.status === 'All statuses' || p.status === filters.status)
      ),
    [filters]
  );

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleConditionChange = (condition: string) => {
    setFilters((prev) => ({ ...prev, condition }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDrawer = () => {
    setSelectedPatient(null);
  };

  const handleScheduleAppointment = (patient: Patient) => {
    console.log('Schedule appointment for:', patient.name);
    handleCloseDrawer();
  };

  const handleViewFullRecord = (patient: Patient) => {
    console.log('View full record for:', patient.name);
    handleCloseDrawer();
  };

  return (
    <div className="mt-8 space-y-5">
      <PatientFiltersComponent
        filters={filters}
        onSearchChange={handleSearchChange}
        onConditionChange={handleConditionChange}
        onStatusChange={handleStatusChange}
        conditions={allConditions}
        statuses={allStatuses}
        resultCount={filteredPatients.length}
      />
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
