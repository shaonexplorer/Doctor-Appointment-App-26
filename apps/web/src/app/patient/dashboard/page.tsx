'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Check,
  Pill,
  Activity,
  HeartPulse,
  FileText,
  Video,
  Clock3,
  Stethoscope,
  Download,
  Plus,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  Metric,
  Panel,
  Detail,
  Reminder,
  Action,
  SpecialtyPieChart,
  MonthlyExpensesBarChart,
  EmptyDashboardState,
  DashboardErrorState,
} from '@/components/patient-dashboard';
import { AppointmentDrawer, CancelModal, RescheduleFlow } from '@/components/appointments';
import {
  useDashboardStats,
  useUpcomingAppointments,
  useCompletedAppointments,
  useCancelAppointment,
  useRescheduleAppointment,
  transformAppointmentToUI,
  type AppointmentUI,
} from '@/hooks/useAppointments';
import { prescriptionApi } from '@/lib/api';

const drawerStatusMap: Record<string, AppointmentUI['status']> = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'Cancelled',
};

const consultationTypeMap: Record<string, AppointmentUI['consultationType']> = {
  IN_PERSON: 'IN_PERSON',
  VIDEO: 'VIDEO',
  PHONE: 'PHONE',
};

const pieColors = ['#0284c7', '#0d9488', '#2563eb', '#16a34a', '#d97706', '#dc2626'];

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysUntil(isoString: string): number {
  const start = new Date(isoString).getTime();
  const now = new Date().getTime();
  return Math.ceil((start - now) / (1000 * 60 * 60 * 24));
}

function initialsFromName(name?: string | null): string {
  if (!name || !name.trim()) return '??';
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function statusColor(status: string): string {
  switch (status) {
    case 'Upcoming':
      return 'bg-primary/10 text-primary';
    case 'Completed':
      return 'bg-[#e6f7ef] text-[#278e70]';
    case 'Cancelled':
      return 'bg-[#fff2ef] text-[#b86f63]';
    default:
      return 'bg-secondary text-muted-foreground';
  }
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAppointment, setDrawerAppointment] = useState<AppointmentUI | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState<AppointmentUI | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentUI | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);

  const statsQuery = useDashboardStats();
  const upcomingQuery = useUpcomingAppointments(5);
  const completedQuery = useCompletedAppointments(5);
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  const stats = statsQuery.data;
  const isLoading = statsQuery.isPending || upcomingQuery.isPending || completedQuery.isPending;
  const statsError = statsQuery.error;
  const nextAppointment = stats?.nextAppointment ?? null;

  const upcomingAppointments: AppointmentUI[] = (upcomingQuery.data ?? []).map(
    transformAppointmentToUI
  );
  const completedAppointments: AppointmentUI[] = (completedQuery.data ?? []).map(
    transformAppointmentToUI
  );

  const allAppointments = [...upcomingAppointments, ...completedAppointments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const upcomingCount = stats?.upcomingAppointments ?? 0;
  const completedCount = stats?.appointmentsByStatus?.COMPLETED ?? 0;
  const activePrescriptions = completedAppointments.filter((a) => Boolean(a.prescription)).length;
  const totalExpenses = stats?.totalExpenses ?? 0;

  const refreshAll = useCallback(async () => {
    await statsQuery.refetch();
    await upcomingQuery.refetch();
    await completedQuery.refetch();
    setNotice('Overview refreshed.');
  }, [statsQuery, upcomingQuery, completedQuery]);

  const dismissNotice = () => setNotice('');

  const handleViewAppointment = (appt: AppointmentUI) => {
    setDrawerAppointment(appt);
    setDrawerOpen(true);
  };

  const handleCancel = (appt: AppointmentUI) => {
    setCancelAppointment(appt);
    setCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelAppointment) return;
    try {
      await cancelMutation.mutateAsync(cancelAppointment.id);
      setCancelOpen(false);
      setCancelAppointment(null);
      setNotice('Appointment cancelled.');
      await refreshAll();
    } catch {
      setNotice('Failed to cancel appointment. Please try again.');
    }
  };

  const handleReschedule = (appt: AppointmentUI) => {
    setRescheduleAppointment(appt);
    setRescheduleOpen(true);
  };

  const handleConfirmReschedule = () => {
    setRescheduleOpen(false);
    setRescheduleAppointment(null);
    setNotice('Appointment rescheduled.');
    void refreshAll();
  };

  const handleDownloadPrescription = async (prescriptionId: string, name: string) => {
    setDownloadLoading(prescriptionId);
    try {
      const blob = await prescriptionApi.downloadPrescriptionPDF(prescriptionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setNotice(`Downloaded ${name}.pdf`);
    } catch {
      setNotice('Failed to download prescription. Please try again.');
    } finally {
      setDownloadLoading(null);
    }
  };

  const nextAppointmentUI: AppointmentUI | null = nextAppointment
    ? (upcomingAppointments.find((a) => a.id === nextAppointment.id) ?? {
        id: nextAppointment.id,
        doctor: nextAppointment.doctorName,
        specialty: nextAppointment.doctorSpecialty,
        date: formatShortDate(nextAppointment.startTime),
        time: formatTime(nextAppointment.startTime),
        clinic: nextAppointment.clinic,
        status: drawerStatusMap[nextAppointment.status] ?? 'Scheduled',
        payment: 'Pending',
        symptoms: 'No symptoms recorded',
        consultationType: consultationTypeMap[nextAppointment.consultationType] ?? 'IN_PERSON',
        tab: 'Upcoming',
        slotId: '',
        doctorId: '',
        notes: null,
        createdAt: nextAppointment.startTime,
      })
    : null;

  // console.log(nextAppointment);

  const specialtyTotal =
    stats?.appointmentsBySpecialty?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const pieDataWithColors =
    stats?.appointmentsBySpecialty?.map((item, i) => ({
      name: item.specialty,
      value: specialtyTotal > 0 ? Math.round((item.count / specialtyTotal) * 100) : 0,
      color: pieColors[i % pieColors.length],
    })) ?? [];

  const reminders: Array<{ icon: ReactNode; title: string; detail: string }> = [];
  if (nextAppointment) {
    if (nextAppointment.consultationType === 'VIDEO') {
      reminders.push({
        icon: <Video className="size-5" aria-hidden="true" />,
        title: 'Prepare for your video visit',
        detail: 'Check your camera and connection before the appointment.',
      });
    } else {
      reminders.push({
        icon: <CalendarDays className="size-5" aria-hidden="true" />,
        title: 'Prepare for your visit',
        detail: `Your appointment with ${nextAppointment.doctorName} is coming up.`,
      });
    }
  }
  const latestPrescription = completedAppointments.find((a) => Boolean(a.prescription));
  if (latestPrescription) {
    reminders.push({
      icon: <FileText className="size-5" aria-hidden="true" />,
      title: 'Review your latest prescription',
      detail: `Prescription from ${latestPrescription.doctor} is available.`,
    });
  }
  if (completedAppointments.length > 0) {
    reminders.push({
      icon: <Stethoscope className="size-5" aria-hidden="true" />,
      title: 'Review recent visit results',
      detail: `${completedAppointments.length} completed visit(s) on record.`,
    });
  }
  if (reminders.length === 0) {
    reminders.push({
      icon: <Check className="size-5" aria-hidden="true" />,
      title: 'All caught up',
      detail: 'No pending actions at the moment.',
    });
  }

  const prescriptionList = completedAppointments
    .filter((a) => Boolean(a.prescription))
    .map((a) => ({
      id: a.id,
      name: `Prescription_${a.id}.pdf`,
      doctor: a.doctor,
      date: a.date,
      prescriptionId: a.id,
    }));

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="border-border bg-card h-44 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      </ProtectedRoute>
    );
  }

  if (statsError) {
    return (
      <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
        <DashboardErrorState message="We couldn't load your health overview. Please check your connection and try again." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Dashboard">
        <div className="flex flex-col gap-5">
          {notice && (
            <div
              role="status"
              className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
            >
              <span>{notice}</span>
              <button onClick={dismissNotice} aria-label="Dismiss notification">
                <Check className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Next Appointment & Reminders */}
          <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <Panel
              title="Next appointment"
              className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6"
            >
              {nextAppointmentUI ? (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-primary text-xs font-bold tracking-[0.14em] uppercase">
                        Next appointment
                      </p>
                      <h2 className="mt-2 text-xl font-black">{nextAppointmentUI.doctor}</h2>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {nextAppointmentUI.specialty} &middot; {nextAppointmentUI.clinic}
                      </p>
                    </div>
                    <div className="text-primary grid size-12 place-items-center rounded-full bg-[#dce8ff] text-sm font-black">
                      {initialsFromName(nextAppointmentUI.doctor)}
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Detail icon={<CalendarDays />} label="Date" value={nextAppointmentUI.date} />
                    <Detail icon={<Clock3 />} label="Time" value={nextAppointmentUI.time} />
                    <Detail
                      icon={<Video />}
                      label="Visit type"
                      value={nextAppointmentUI.consultationType}
                    />
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-bold',
                        nextAppointmentUI.status === 'Confirmed'
                          ? 'bg-[#e6f7ef] text-[#278e70]'
                          : 'bg-[#fff2ef] text-[#b86f63]'
                      )}
                    >
                      {nextAppointmentUI.status}
                    </span>
                    {daysUntil(nextAppointmentUI.createdAt) > 0 && (
                      <span className="text-muted-foreground text-xs">
                        Starts in {daysUntil(nextAppointmentUI.createdAt)} days
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewAppointment(nextAppointmentUI)}
                      className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
                    >
                      View appointment
                    </button>
                    <button
                      onClick={() => handleReschedule(nextAppointmentUI)}
                      className="border-border hover:bg-secondary rounded-xl border px-4 py-2.5 text-xs font-bold"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(nextAppointmentUI)}
                      className="text-muted-foreground hover:bg-secondary rounded-xl px-4 py-2.5 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <EmptyDashboardState />
                  <button
                    onClick={() => router.push('/doctors/search')}
                    className="bg-primary text-primary-foreground mt-6 rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
                  >
                    Book a visit
                  </button>
                </div>
              )}
            </Panel>

            <Panel
              title="What to do next"
              className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">What to do next</h2>
                  <p className="text-muted-foreground mt-1 text-xs">A few helpful reminders.</p>
                </div>
                <HeartPulse className="size-5 text-[#67c7b6]" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {reminders.map((reminder, i) => (
                  <Reminder
                    key={i}
                    icon={reminder.icon}
                    title={reminder.title}
                    detail={reminder.detail}
                  />
                ))}
              </div>
            </Panel>
          </section>

          {/* KPI Metrics */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Upcoming appointments"
              value={upcomingCount}
              icon={<CalendarDays />}
              tone="bg-[#edf3ff] text-primary"
            />
            <Metric
              label="Completed visits"
              value={completedCount}
              icon={<Check />}
              tone="bg-[#e9f8f3] text-[#2b9d7e]"
            />
            <Metric
              label="Active prescriptions"
              value={activePrescriptions}
              icon={<Pill />}
              tone="bg-[#fff3e7] text-[#d68b42]"
            />
            <Metric
              label="Medical expenses"
              value={`$${totalExpenses.toLocaleString()}`}
              icon={<Activity />}
              tone="bg-[#f2ecff] text-[#8e68dc]"
            />
          </section>

          {/* Charts */}
          <section className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
            <Panel
              title="Appointment timeline"
              action="View all"
              onAction={() => router.push('/patient/appointments')}
            >
              <div className="flex flex-col gap-4">
                {allAppointments.length > 0 ? (
                  allAppointments.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex w-14 shrink-0 flex-col items-center">
                        <span className="text-foreground text-xs font-black">{item.date}</span>
                        <span className="bg-border mt-2 h-full w-px" />
                      </div>
                      <div className="border-border hover:border-primary/30 hover:bg-primary/[0.02] relative -mt-1 flex-1 rounded-xl border p-3 transition">
                        <span
                          className={`absolute top-3 right-3 rounded-full px-2 py-1 text-[10px] font-bold ${statusColor(
                            item.tab
                          )}`}
                        >
                          {item.tab}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
                            <CalendarDays className="size-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold">{item.doctor}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {item.specialty} &middot; {item.clinic}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    No appointments yet. Book your first visit.
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Appointments by specialty" action="This year">
              {pieDataWithColors.length > 0 ? (
                <SpecialtyPieChart
                  data={pieDataWithColors}
                  total={specialtyTotal}
                  totalLabel="visits"
                />
              ) : (
                <div className="text-muted-foreground flex h-44 items-center justify-center text-sm">
                  No specialty data available.
                </div>
              )}
            </Panel>
          </section>

          {/* Prescriptions & Expenses */}
          <section className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
            <Panel
              title="Recent prescriptions"
              action="View all"
              onAction={() => router.push('/patient/records')}
            >
              <div className="flex flex-col gap-2">
                {prescriptionList.length > 0 ? (
                  prescriptionList.map((item) => (
                    <div
                      key={item.id}
                      className="hover:bg-secondary flex items-center gap-3 rounded-xl p-2 transition"
                    >
                      <div className="grid size-9 place-items-center rounded-lg bg-[#fff3e7] text-[#d68b42]">
                        <Pill className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{item.name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {item.doctor} &middot; {item.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadPrescription(item.prescriptionId, item.name)}
                        disabled={downloadLoading === item.id}
                        className="text-muted-foreground hover:bg-card hover:text-primary rounded-lg p-2 disabled:opacity-50"
                        aria-label={`Download ${item.name}`}
                      >
                        {downloadLoading === item.id ? (
                          <Download className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Download className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    No prescriptions yet.
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Monthly medical expenses" action="2026">
              {stats?.monthlyExpenses?.length ? (
                <MonthlyExpensesBarChart data={stats.monthlyExpenses} />
              ) : (
                <div className="text-muted-foreground flex h-56 items-center justify-center text-sm">
                  No expense data available.
                </div>
              )}
            </Panel>
          </section>

          {/* Quick Actions */}
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Quick actions</h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Get where you need to go faster.
                </p>
              </div>
              <MoreHorizontal className="text-muted-foreground size-5" aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Action
                icon={<Stethoscope />}
                label="Find a doctor"
                onClick={() => router.push('/doctors/search')}
              />
              <Action
                icon={<Plus />}
                label="Book appointment"
                onClick={() => router.push('/doctors/search')}
              />
              <Action
                icon={<Pill />}
                label="View prescriptions"
                onClick={() => router.push('/patient/records')}
              />
              <Action
                icon={<FileText />}
                label="Medical records"
                onClick={() => router.push('/patient/records')}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              onClick={refreshAll}
              disabled={isLoading}
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-bold disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-3.5" aria-hidden="true" />
              )}
              Refresh overview
            </button>
          </div>
        </div>

        {/* Appointment Drawer */}
        {drawerOpen && drawerAppointment && (
          <AppointmentDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            appointment={drawerAppointment}
            onNotice={setNotice}
          />
        )}

        {/* Cancel Modal */}
        {cancelOpen && cancelAppointment && (
          <CancelModal
            isOpen={cancelOpen}
            onClose={() => setCancelOpen(false)}
            onConfirm={handleConfirmCancel}
            appointment={{
              id: cancelAppointment.id,
              doctor: cancelAppointment.doctor,
              date: cancelAppointment.date,
              time: cancelAppointment.time,
              clinic: cancelAppointment.clinic,
              status: cancelAppointment.status,
              payment: cancelAppointment.payment,
              hoursUntilAppointment: daysUntil(cancelAppointment.createdAt) * 24,
            }}
            isLoading={cancelMutation.isPending}
          />
        )}

        {/* Reschedule Flow */}
        {rescheduleOpen && rescheduleAppointment && (
          <RescheduleFlow
            isOpen={rescheduleOpen}
            onClose={() => setRescheduleOpen(false)}
            originalAppointment={{
              id: rescheduleAppointment.id,
              doctor: rescheduleAppointment.doctor,
              specialty: rescheduleAppointment.specialty,
              date: rescheduleAppointment.date,
              time: rescheduleAppointment.time,
            }}
            onRescheduleComplete={handleConfirmReschedule}
            isLoading={rescheduleMutation.isPending}
          />
        )}
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
