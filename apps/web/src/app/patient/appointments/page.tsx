'use client';

import { useState } from 'react';
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
import {
  useAppointments,
  useDashboardStats,
  useUpcomingAppointments,
  useCompletedAppointments,
  useCancelAppointment,
  useRescheduleAppointment,
  transformAppointmentsToUI,
  type AppointmentUI,
  type AppointmentFilters,
} from '@/hooks/useAppointments';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';

export default function PatientAppointmentsPage() {
  const [tab, setTab] = useState<Tab>('Upcoming');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState<AppointmentUI | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentUI | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentUI | null>(null);
  const [notice, setNotice] = useState('');

  // Build filters for API
  const filters: AppointmentFilters = {
    status:
      tab === 'Upcoming'
        ? ['SCHEDULED']
        : tab === 'Completed'
          ? ['COMPLETED']
          : ['CANCELLED', 'NO_SHOW'],
    search: search || undefined,
    specialty: specialty !== 'All specialties' ? specialty : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  // Fetch data using hooks
  const { isLoading: statsLoading } = useDashboardStats();
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingAppointments(10);
  const { data: completedData, isLoading: completedLoading } = useCompletedAppointments(10);
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAppointments(filters);

  // Transform data to UI format
  const upcomingAppointments = upcomingData ? transformAppointmentsToUI(upcomingData) : [];
  const completedAppointments = completedData ? transformAppointmentsToUI(completedData) : [];
  const filteredAppointments = appointmentsData?.data
    ? transformAppointmentsToUI(appointmentsData.data)
    : [];

  // Get all appointments for specialty filter options
  const allAppointments = [...upcomingAppointments, ...completedAppointments];
  const specialties = [
    'All specialties',
    ...Array.from(new Set(allAppointments.map((item) => item.specialty))),
  ];

  // Counts for tabs
  const counts = {
    Upcoming: upcomingAppointments.length,
    Completed: completedAppointments.length,
    Cancelled: allAppointments.filter((a) => a.tab === 'Cancelled').length,
  };

  // Check if any data is loading
  const isLoading = statsLoading || upcomingLoading || completedLoading || appointmentsLoading;

  // Mutations
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  const hasActiveFilters =
    search !== '' || specialty !== 'All specialties' || dateFrom !== '' || dateTo !== '';

  const handleView = (appointment: AppointmentUI) => {
    setSelected(appointment);
  };

  const handleCancel = (appointment: AppointmentUI) => {
    setCancelTarget(appointment);
  };

  const handleReschedule = (appointment: AppointmentUI) => {
    setRescheduleTarget(appointment);
  };

  const handleDownloadPrescription = (appointment: AppointmentUI) => {
    setNotice(
      appointment.prescription
        ? `Downloading ${appointment.prescription}`
        : 'No prescription is attached.'
    );
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;

    cancelMutation.mutate(cancelTarget.id, {
      onSuccess: () => {
        setCancelTarget(null);
        setNotice('Appointment cancelled. Your refund will be processed within 5–7 business days.');
      },
      onError: () => {
        setNotice('Failed to cancel appointment. Please try again.');
      },
    });
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
              {isLoading ? (
                <div className="grid gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-20 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : filteredAppointments.length === 0 ? (
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
                  {filteredAppointments.map((item) => (
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
              isLoading={cancelMutation.isPending}
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
              isLoading={rescheduleMutation.isPending}
            />
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
