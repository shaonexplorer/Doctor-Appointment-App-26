'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import {
  useDoctorAppointments,
  useCancelAppointmentAsDoctor,
  useRescheduleAppointmentAsDoctor,
  transformDoctorAppointmentsToUI,
  getAppointmentTabByDate,
  type DoctorAppointmentUI,
} from '@/hooks/useDoctorAppointments';
import { useAvailableSlotsForReschedule } from '@/hooks/useSchedule';

type AppointmentTab = 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'No-show';

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AppointmentTab>('Today');
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState<'cancel' | 'reschedule' | null>(null);
  const [notice, setNotice] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentUI | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);

  // Fetch available slots for rescheduling when dialog opens
  // Use the selected date (or appointment's date as default) as startDate
  const effectiveStartDate =
    rescheduleDate || (selectedAppointment ? new Date(selectedAppointment.startTime) : undefined);
  const effectiveEndDate = effectiveStartDate
    ? new Date(effectiveStartDate.getTime() + 24 * 60 * 60 * 1000)
    : undefined;

  const { data: availableSlotsData, isLoading: isLoadingSlots } = useAvailableSlotsForReschedule(
    dialog === 'reschedule' && selectedAppointment ? selectedAppointment.doctorId : undefined,
    effectiveStartDate,
    effectiveEndDate
  );
  // console.log('Available slots for reschedule:', availableSlotsData, 'Loading:', isLoadingSlots);

  // Format available slots for the dropdown
  const availableSlots = availableSlotsData || [];

  // Handle date change in reschedule dialog
  const handleRescheduleDateChange = (date: Date) => {
    setRescheduleDate(date);
  };

  // Fetch ALL appointments once (without status filter) for stable tab counts
  // We only pass search and pagination filters, not status
  const {
    data: allAppointmentsData,
    isLoading,
    error,
    refetch,
  } = useDoctorAppointments({
    patientSearch: searchValue || undefined,
    page: 1,
    limit: 100, // Fetch more to cover all tabs
  });

  // Update search filter
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Note: search triggers refetch via the query key change in useDoctorAppointments
  };

  const handleTabChange = (newTab: AppointmentTab) => {
    setTab(newTab);
    // No need to update filters - we filter client-side
  };

  // Mutations
  const cancelMutation = useCancelAppointmentAsDoctor();
  const rescheduleMutation = useRescheduleAppointmentAsDoctor();

  // Transform and filter appointments by tab
  const allAppointments = allAppointmentsData
    ? transformDoctorAppointmentsToUI(allAppointmentsData.data)
    : [];

  // Filter appointments by tab based on date and status
  const appointmentsByTab = allAppointments.reduce(
    (acc, apt) => {
      const appointmentTab = getAppointmentTabByDate(apt);
      if (!acc[appointmentTab]) acc[appointmentTab] = [];
      acc[appointmentTab].push(apt);
      return acc;
    },
    {} as Record<AppointmentTab, DoctorAppointmentUI[]>
  );

  // Ensure all tabs exist
  const tabKeys: AppointmentTab[] = ['Today', 'Upcoming', 'Completed', 'Cancelled', 'No-show'];
  tabKeys.forEach((key) => {
    if (!appointmentsByTab[key]) appointmentsByTab[key] = [];
  });

  const appointments = appointmentsByTab[tab] || [];

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patient.toLowerCase().includes(searchValue.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchValue.toLowerCase())
  );

  const tabCounts = {
    Today: appointmentsByTab.Today.length,
    Upcoming: appointmentsByTab.Upcoming.length,
    Completed: appointmentsByTab.Completed.length,
    Cancelled: appointmentsByTab.Cancelled.length,
    'No-show': appointmentsByTab['No-show'].length,
  };

  const handleView = (appointment: DoctorAppointment) => {
    // Find the full appointment with additional fields from allAppointments
    const fullAppointment =
      allAppointments.find((a) => a.id === appointment.id) || (appointment as DoctorAppointmentUI);
    setSelectedAppointment(fullAppointment);
    setDrawer(true);
  };

  const handleStartConsultation = (appointment: DoctorAppointment) => {
    // Find the full appointment with additional fields from allAppointments
    const fullAppointment =
      allAppointments.find((a) => a.id === appointment.id) || (appointment as DoctorAppointmentUI);

    // Navigate to consultation page with appointment ID
    setDrawer(false);
    router.push(`/doctor/consultation/${fullAppointment.id}`);
  };

  const handleReschedule = (appointment: DoctorAppointment) => {
    const fullAppointment =
      allAppointments.find((a) => a.id === appointment.id) || (appointment as DoctorAppointmentUI);
    setSelectedAppointment(fullAppointment);
    setRescheduleDate(fullAppointment.startTime ? new Date(fullAppointment.startTime) : null);
    setDrawer(false);
    setDialog('reschedule');
  };

  const handleCancel = (appointment: DoctorAppointment) => {
    const fullAppointment =
      allAppointments.find((a) => a.id === appointment.id) || (appointment as DoctorAppointmentUI);
    setSelectedAppointment(fullAppointment);
    setDrawer(false);
    setDialog('cancel');
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      await cancelMutation.mutateAsync({
        id: selectedAppointment.id,
        reason: 'Cancelled by doctor',
        triggerRefund: true,
      });
      setDialog(null);
      setNotice('Appointment cancelled. Patient will receive a notification.');
      void refetch();
    } catch (_error) {
      setNotice('Failed to cancel appointment. Please try again.');
    }
  };

  const handleRescheduleConfirm = async (slotId: string, slotTime: string) => {
    if (!selectedAppointment || !slotId) return;

    try {
      await rescheduleMutation.mutateAsync({
        id: selectedAppointment.id,
        newSlotId: slotId,
      });
      setDialog(null);
      setNotice(`Appointment rescheduled to ${slotTime}. Patient will receive a notification.`);
      void refetch();
    } catch (_error) {
      setNotice('Failed to reschedule appointment. Please try again.');
    }
  };

  const dismissNotice = () => setNotice('');

  const reload = () => {
    setNotice('Refreshing...');
    void refetch();
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

            <AppointmentTabs activeTab={tab} onChange={handleTabChange} counts={tabCounts} />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <SearchFilter value={searchValue} onChange={handleSearchChange} />
              <p className="text-muted-foreground text-xs">
                <span className="text-primary font-bold">{filteredAppointments.length}</span>{' '}
                appointments
              </p>
            </div>
          </section>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : error ? (
            <div className="text-destructive py-12 text-center">
              Failed to load appointments.{' '}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <AppointmentTable
              appointments={filteredAppointments}
              onView={handleView}
              onStartConsultation={handleStartConsultation}
              onReschedule={handleReschedule}
            />
          ) : (
            <EmptyState
              tab={tab}
              onClearFilters={() => {
                setSearchValue('');
              }}
            />
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
            onClose={() => {
              setDialog(null);
              setRescheduleDate(null); // Reset date when closing
            }}
            onConfirm={handleRescheduleConfirm}
            onDateChange={handleRescheduleDateChange}
            appointment={selectedAppointment}
            availableSlots={availableSlots}
            isLoading={isLoadingSlots}
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
