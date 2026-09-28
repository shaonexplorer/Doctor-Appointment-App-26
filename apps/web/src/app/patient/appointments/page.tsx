'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import {
  AppointmentTabs,
  AppointmentSearchFilter,
  AppointmentCard,
  AppointmentDrawer,
  CancelModal,
  RescheduleFlow,
} from '@/components/appointments';
import { CalendarDays, Check, X } from 'lucide-react';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Scheduled';
  payment: 'Pending' | 'Paid' | 'Refunded';
  symptoms: string;
  prescription?: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  tab: Tab;
}

const mockAppointments: Appointment[] = [
  {
    id: 'APT-2026-004821',
    doctor: 'Dr. Michael Anderson',
    specialty: 'Cardiology',
    date: 'Thu, Sep 24, 2026',
    time: '10:30 AM',
    clinic: 'Heart & Vascular Center',
    status: 'Confirmed',
    payment: 'Pending',
    tab: 'Upcoming',
    symptoms: 'Routine consultation and follow-up for chest discomfort.',
    consultationType: 'VIDEO',
  },
  {
    id: 'APT-2026-004739',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    date: 'Mon, Sep 28, 2026',
    time: '02:00 PM',
    clinic: 'MediBook Downtown Clinic',
    status: 'Confirmed',
    payment: 'Paid',
    tab: 'Upcoming',
    symptoms: 'Skin consultation.',
    consultationType: 'IN_PERSON',
  },
  {
    id: 'APT-2026-003988',
    doctor: 'Dr. Sarah Williams',
    specialty: 'General Medicine',
    date: 'Tue, Aug 18, 2026',
    time: '09:00 AM',
    clinic: 'MediBook Midtown Clinic',
    status: 'Completed',
    payment: 'Paid',
    tab: 'Completed',
    symptoms: 'Annual wellness check-up.',
    prescription: 'Prescription_2026-003988.pdf',
    consultationType: 'IN_PERSON',
  },
  {
    id: 'APT-2026-003741',
    doctor: 'Dr. James Patel',
    specialty: 'Neurology',
    date: 'Fri, Jul 31, 2026',
    time: '11:30 AM',
    clinic: 'NeuroCare Center',
    status: 'Completed',
    payment: 'Paid',
    tab: 'Completed',
    symptoms: 'Recurring headaches and fatigue.',
    prescription: 'Prescription_2026-003741.pdf',
    consultationType: 'VIDEO',
  },
  {
    id: 'APT-2026-003502',
    doctor: 'Dr. Lisa Chen',
    specialty: 'Pediatrics',
    date: 'Wed, Jul 15, 2026',
    time: '03:00 PM',
    clinic: 'MediBook West Clinic',
    status: 'Cancelled',
    payment: 'Refunded',
    tab: 'Cancelled',
    symptoms: 'Routine consultation.',
    consultationType: 'IN_PERSON',
  },
];

export default function PatientAppointmentsPage() {
  const [tab, setTab] = useState<Tab>('Upcoming');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [notice, setNotice] = useState('');

  const specialties = [
    'All specialties',
    ...Array.from(new Set(mockAppointments.map((item) => item.specialty))),
  ];

  const filtered = useMemo(
    () =>
      mockAppointments.filter(
        (item) =>
          item.tab === tab &&
          (!search ||
            `${item.doctor} ${item.specialty} ${item.clinic}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (specialty === 'All specialties' || item.specialty === specialty) &&
          (!dateFrom || new Date(item.date) >= new Date(dateFrom)) &&
          (!dateTo || new Date(item.date) <= new Date(dateTo))
      ),
    [tab, search, specialty, dateFrom, dateTo]
  );

  const counts = useMemo(
    () => ({
      Upcoming: mockAppointments.filter((a) => a.tab === 'Upcoming').length,
      Completed: mockAppointments.filter((a) => a.tab === 'Completed').length,
      Cancelled: mockAppointments.filter((a) => a.tab === 'Cancelled').length,
    }),
    []
  );

  const hasActiveFilters =
    search !== '' || specialty !== 'All specialties' || dateFrom !== '' || dateTo !== '';

  const handleView = (appointment: Appointment) => {
    setSelected(appointment);
  };

  const handleCancel = (appointment: Appointment) => {
    setCancelTarget(appointment);
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
  };

  const handleDownloadPrescription = (appointment: Appointment) => {
    setNotice(
      appointment.prescription
        ? `Downloading ${appointment.prescription}`
        : 'No prescription is attached.'
    );
  };

  const handleCancelConfirm = () => {
    setCancelTarget(null);
    setNotice('Appointment cancelled. Your refund will be processed within 5–7 business days.');
  };

  const handleRescheduleComplete = (newAppointmentId: string) => {
    setRescheduleTarget(null);
    setNotice(`Appointment rescheduled successfully. New appointment ID: ${newAppointmentId}`);
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Appointments">
        <div className="relative">
          {/* Notice Toast */}
          {notice && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-xl border border-[#bfe4d5] bg-[#f0fbf6] px-4 py-3 text-sm font-bold text-[#218765]"
            >
              <Check className="size-4" aria-hidden="true" />
              {notice}
              <button className="ml-auto" onClick={() => setNotice('')} aria-label="Dismiss notice">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="border-border bg-card rounded-2xl border shadow-sm">
            {/* Header */}
            <div className="border-border border-b p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-black">Appointments</h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Keep track of your visits and care history.
                </p>
              </div>

              {/* Search & Filters */}
              <AppointmentSearchFilter
                searchValue={search}
                onSearchChange={setSearch}
                specialtyValue={specialty}
                onSpecialtyChange={setSpecialty}
                specialties={specialties}
                dateFrom={dateFrom}
                onDateFromChange={setDateFrom}
                dateTo={dateTo}
                onDateToChange={setDateTo}
                onClearFilters={() => {
                  setSearch('');
                  setSpecialty('All specialties');
                  setDateFrom('');
                  setDateTo('');
                }}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Tabs */}
              <AppointmentTabs activeTab={tab} onChange={setTab} counts={counts} />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              {filtered.length === 0 ? (
                <div className="border-border rounded-2xl border border-dashed p-12 text-center">
                  <CalendarDays className="text-primary/50 mx-auto size-8" aria-hidden="true" />
                  <h3 className="mt-4 font-black">No {tab.toLowerCase()} appointments</h3>
                  <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
                    {tab === 'Upcoming'
                      ? 'When you book a visit, it will appear here.'
                      : `Your ${tab.toLowerCase()} appointment history will appear here.`}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filtered.map((item) => (
                    <AppointmentCard
                      key={item.id}
                      appointment={item}
                      onView={() => handleView(item)}
                      onCancel={() => handleCancel(item)}
                      onReschedule={() => handleReschedule(item)}
                      onDownloadPrescription={() => handleDownloadPrescription(item)}
                      onNotice={setNotice}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Appointment Drawer */}
          {selected && (
            <AppointmentDrawer
              isOpen={!!selected}
              onClose={() => setSelected(null)}
              appointment={selected}
              onNotice={setNotice}
            />
          )}

          {/* Cancel Modal */}
          {cancelTarget && (
            <CancelModal
              isOpen={!!cancelTarget}
              onClose={() => setCancelTarget(null)}
              onConfirm={handleCancelConfirm}
              appointment={{
                id: cancelTarget.id,
                doctor: cancelTarget.doctor,
                date: cancelTarget.date,
                time: cancelTarget.time,
                clinic: cancelTarget.clinic,
                status: cancelTarget.status,
                payment: cancelTarget.payment,
                refundEligible: cancelTarget.payment !== 'Refunded',
              }}
            />
          )}

          {/* Reschedule Flow */}
          {rescheduleTarget && (
            <RescheduleFlow
              isOpen={!!rescheduleTarget}
              onClose={() => setRescheduleTarget(null)}
              originalAppointment={{
                id: rescheduleTarget.id,
                doctor: rescheduleTarget.doctor,
                specialty: rescheduleTarget.specialty,
                date: rescheduleTarget.date,
                time: rescheduleTarget.time,
              }}
              onRescheduleComplete={handleRescheduleComplete}
            />
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
