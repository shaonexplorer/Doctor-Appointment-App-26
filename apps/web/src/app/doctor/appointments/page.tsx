'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { CalendarDays, RefreshCw } from 'lucide-react';
import {
  AppointmentTabs,
  AppointmentTable,
  AppointmentDrawer,
  CancelDialog,
  RescheduleDialog,
  EmptyState,
  SearchFilter,
  Notice,
} from '@/components/doctor-appointments';
import type { DoctorAppointment } from '@/components/doctor-appointments';
import { DoctorPortalShell } from '@/components/doctor-portal';

type AppointmentTab = 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'No-show';

const mockAppointments: Record<AppointmentTab, DoctorAppointment[]> = {
  Today: [
    {
      id: 'APT-001',
      patient: 'Sarah Johnson',
      initials: 'SJ',
      time: '07:20 PM',
      symptoms: 'Chest discomfort and shortness of breath.',
      status: 'Confirmed' as const,
      payment: 'Paid' as const,
      date: 'Sep 18, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Cardiology',
      clinic: 'Cardiology clinic',
    },
    {
      id: 'APT-002',
      patient: 'Robert Chen',
      initials: 'RC',
      time: '08:00 PM',
      symptoms: 'Follow-up for hypertension.',
      status: 'Confirmed' as const,
      payment: 'Pending' as const,
      date: 'Sep 18, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Cardiology',
      clinic: 'Cardiology clinic',
    },
    {
      id: 'APT-003',
      patient: 'Emily Davis',
      initials: 'ED',
      time: '08:40 PM',
      symptoms: 'Recurring migraine episodes.',
      status: 'Checked in' as const,
      payment: 'Paid' as const,
      date: 'Sep 18, 2026',
      consultationType: 'VIDEO' as const,
      specialty: 'Neurology',
      clinic: 'Neurology center',
    },
  ],
  Upcoming: [
    {
      id: 'APT-004',
      patient: 'Michael Brown',
      initials: 'MB',
      time: '09:00 AM',
      symptoms: 'Annual checkup.',
      status: 'Confirmed' as const,
      payment: 'Paid' as const,
      date: 'Sep 19, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Internal Medicine',
      clinic: 'General clinic',
    },
    {
      id: 'APT-005',
      patient: 'Lisa Wilson',
      initials: 'LW',
      time: '10:30 AM',
      symptoms: 'Skin rash evaluation.',
      status: 'Confirmed' as const,
      payment: 'Pending' as const,
      date: 'Sep 20, 2026',
      consultationType: 'VIDEO' as const,
      specialty: 'Dermatology',
      clinic: 'Dermatology clinic',
    },
    {
      id: 'APT-006',
      patient: 'David Lee',
      initials: 'DL',
      time: '02:00 PM',
      symptoms: 'Knee pain follow-up.',
      status: 'Confirmed' as const,
      payment: 'Paid' as const,
      date: 'Sep 21, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Orthopedics',
      clinic: 'Orthopedics center',
    },
  ],
  Completed: [
    {
      id: 'APT-007',
      patient: 'Jennifer Adams',
      initials: 'JA',
      time: '09:30 AM',
      symptoms: 'Diabetes management.',
      status: 'Completed' as const,
      payment: 'Paid' as const,
      date: 'Sep 15, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Endocrinology',
      clinic: 'Endocrinology clinic',
    },
    {
      id: 'APT-008',
      patient: 'Christopher Taylor',
      initials: 'CT',
      time: '11:00 AM',
      symptoms: 'Blood pressure check.',
      status: 'Completed' as const,
      payment: 'Paid' as const,
      date: 'Sep 14, 2026',
      consultationType: 'VIDEO' as const,
      specialty: 'Cardiology',
      clinic: 'Cardiology clinic',
    },
  ],
  Cancelled: [
    {
      id: 'APT-009',
      patient: 'Amanda White',
      initials: 'AW',
      time: '03:00 PM',
      symptoms: 'Migraine consultation.',
      status: 'Cancelled' as const,
      payment: 'Refunded' as const,
      date: 'Sep 10, 2026',
      consultationType: 'VIDEO' as const,
      specialty: 'Neurology',
      clinic: 'Neurology center',
    },
  ],
  'No-show': [
    {
      id: 'APT-010',
      patient: 'James Martin',
      initials: 'JM',
      time: '04:00 PM',
      symptoms: 'Follow-up appointment.',
      status: 'No-show' as const,
      payment: 'Pending' as const,
      date: 'Sep 12, 2026',
      consultationType: 'IN_PERSON' as const,
      specialty: 'Internal Medicine',
      clinic: 'General clinic',
    },
  ],
};

const tabCounts = {
  Today: mockAppointments.Today.length,
  Upcoming: mockAppointments.Upcoming.length,
  Completed: mockAppointments.Completed.length,
  Cancelled: mockAppointments.Cancelled.length,
  'No-show': mockAppointments['No-show'].length,
};

const availableSlots = [
  { id: 'slot-1', time: '08:00 PM' },
  { id: 'slot-2', time: '08:40 PM' },
  { id: 'slot-3', time: '09:20 PM' },
];

export default function DoctorAppointmentsPage() {
  const [tab, setTab] = useState<AppointmentTab>('Today');
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState<'cancel' | 'reschedule' | null>(null);
  const [notice, setNotice] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);

  const appointments = mockAppointments[tab] || [];
  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patient.toLowerCase().includes(searchValue.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleView = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setDrawer(true);
  };

  const handleStartConsultation = (appointment: DoctorAppointment) => {
    setNotice(`Consultation started for ${appointment.patient}.`);
    setDrawer(false);
  };

  const handleReschedule = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setDrawer(false);
    setDialog('reschedule');
  };

  const handleCancel = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setDrawer(false);
    setDialog('cancel');
  };

  const handleCancelConfirm = () => {
    setDialog(null);
    setNotice('Appointment cancelled. Patient will receive a notification.');
  };

  const handleRescheduleConfirm = () => {
    setDialog(null);
    setNotice('Appointment rescheduled. Patient will receive a notification.');
  };

  const dismissNotice = () => setNotice('');

  const reload = () => {
    setNotice('Refreshing...');
    setTimeout(() => setNotice('Data refreshed.'), 650);
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <DoctorPortalShell active="Appointments">
        <div className="flex flex-col gap-5">
          <Notice message={notice} onDismiss={dismissNotice} />

          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">Appointment management</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Review your patient schedule and care actions.
                </p>
              </div>
              <button className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold">
                <CalendarDays className="size-4" />
                Set availability
              </button>
            </div>

            <AppointmentTabs activeTab={tab} onChange={setTab} counts={tabCounts} />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <SearchFilter value={searchValue} onChange={setSearchValue} />
              <p className="text-muted-foreground text-xs">
                <span className="text-primary font-bold">{filteredAppointments.length}</span>{' '}
                appointments
              </p>
            </div>
          </section>

          {filteredAppointments.length > 0 ? (
            <AppointmentTable
              appointments={filteredAppointments}
              onView={handleView}
              onStartConsultation={handleStartConsultation}
              onReschedule={handleReschedule}
            />
          ) : (
            <EmptyState tab={tab} onClearFilters={() => setSearchValue('')} />
          )}

          <AppointmentDrawer
            isOpen={drawer}
            onClose={() => setDrawer(false)}
            appointment={selectedAppointment}
            onStartConsultation={() => {
              if (selectedAppointment) {
                handleStartConsultation(selectedAppointment);
              }
            }}
            onReschedule={() => {
              if (selectedAppointment) {
                handleReschedule(selectedAppointment);
              }
            }}
            onCancel={() => {
              if (selectedAppointment) {
                handleCancel(selectedAppointment);
              }
            }}
          />

          <CancelDialog
            isOpen={dialog === 'cancel'}
            onClose={() => setDialog(null)}
            onConfirm={handleCancelConfirm}
            appointment={selectedAppointment}
          />

          <RescheduleDialog
            isOpen={dialog === 'reschedule'}
            onClose={() => setDialog(null)}
            onConfirm={handleRescheduleConfirm}
            appointment={selectedAppointment}
            availableSlots={availableSlots}
          />

          <div className="flex justify-end">
            <button
              onClick={reload}
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Refresh appointments
            </button>
          </div>
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
