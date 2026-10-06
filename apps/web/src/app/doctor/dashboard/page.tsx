'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  UsersRound,
  RefreshCw,
  Plus,
  Pill,
} from 'lucide-react';
import {
  DoctorMetric,
  ChartCard,
  UpcomingAppointments,
  ScheduleTimeline,
  RecentPatients,
  VolumeChart,
  UtilizationDonutChart,
  RevenueStackedBarChart,
  QuickActions,
} from '@/components/doctor-dashboard';
import { DoctorPortalShell } from '@/components/doctor-portal';
import {
  useDoctorDashboardStats,
  useDoctorAppointments,
  useVolumeData,
  useUtilizationData,
  useRevenueData,
  useRecentPatients,
  type VolumeDataPoint,
} from '@/hooks/useDoctorDashboard';

const quickActions = [
  { icon: CalendarDays, label: 'View Schedule', href: '/doctor/schedule' },
  { icon: Plus, label: 'New Appointment', href: '/doctor/appointments' },
  { icon: UsersRound, label: 'Patient List', href: '/doctor/patients' },
  { icon: Pill, label: 'Prescriptions', href: '/doctor/prescriptions' },
];

export default function DoctorDashboardPage() {
  const [notice, setNotice] = useState('');
  const [range, setRange] = useState('Week');
  const router = useRouter();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDoctorDashboardStats();

  const { data: appointmentsData, isLoading: appointmentsLoading } = useDoctorAppointments({
    status: 'SCHEDULED',
    sortBy: 'slot.startTime',
    sortOrder: 'asc',
    limit: 20,
  });

  const { data: volumeData, isLoading: volumeLoading } = useVolumeData(7);

  const { data: utilizationData, isLoading: utilizationLoading } = useUtilizationData();

  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();

  const { data: recentPatients, isLoading: patientsLoading } = useRecentPatients();

  const isLoading =
    statsLoading ||
    appointmentsLoading ||
    volumeLoading ||
    utilizationLoading ||
    revenueLoading ||
    patientsLoading;

  const action = (label: string, patient?: string) => {
    setNotice(`${label}${patient ? ` for ${patient}` : ''} is ready.`);
  };

  const reload = () => {
    setNotice('Refreshing...');
    void refetchStats();
    setTimeout(() => setNotice('Data refreshed.'), 650);
  };

  // Transform appointments for components
  const transformedAppointments =
    appointmentsData?.data.map((appt) => ({
      time: new Date(appt.slot.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      patient: `${appt.patient.firstName} ${appt.patient.lastName}`,
      type: appt.consultationType === 'VIDEO' ? 'Video consultation' : 'Follow-up',
      status:
        appt.status === 'SCHEDULED'
          ? ('Confirmed' as const)
          : appt.status === 'COMPLETED'
            ? ('Confirmed' as const)
            : ('Waiting' as const),
      payment: appt.paymentStatus === 'PAID' ? ('Paid' as const) : ('Pending' as const),
    })) || [];

  // Format utilization data for donut chart
  // Hook now returns data in the correct format for the chart
  const formattedUtilization = utilizationData || [];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
        <DoctorPortalShell active="Dashboard">
          <div className="flex animate-pulse flex-col gap-5">
            {/* KPI Metrics Skeleton */}
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-border bg-card rounded-2xl border p-5 shadow-sm">
                  <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                  <div className="bg-muted h-8 w-1/2 rounded" />
                  <div className="bg-muted mt-1 h-3 w-2/3 rounded" />
                </div>
              ))}
            </section>

            {/* Charts Skeleton */}
            <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
              <div className="border-border bg-card h-64 rounded-2xl border p-5 shadow-sm" />
              <div className="border-border bg-card h-64 rounded-2xl border p-5 shadow-sm" />
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
              <div className="border-border bg-card h-64 rounded-2xl border p-5 shadow-sm" />
              <div className="border-border bg-card h-64 rounded-2xl border p-5 shadow-sm" />
            </div>

            {/* Upcoming Appointments Skeleton */}
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
              <div className="bg-muted mb-4 h-4 w-1/4 rounded" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted mb-2 h-12 rounded" />
              ))}
            </div>

            {/* Recent Patients Skeleton */}
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
              <div className="bg-muted mb-4 h-4 w-1/4 rounded" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted mb-2 h-16 rounded" />
              ))}
            </div>
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  if (statsError) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
        <DoctorPortalShell active="Dashboard">
          <div className="flex flex-col gap-5">
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
              <p className="text-destructive">Failed to load dashboard data</p>
              <button
                onClick={() => refetchStats()}
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

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DoctorPortalShell active="Dashboard">
        <div className="flex flex-col gap-5">
          {notice && (
            <div
              role="status"
              className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
            >
              <span>{notice}</span>
              <button onClick={() => setNotice('')} aria-label="Dismiss notification">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* KPI Metrics */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DoctorMetric
              icon={CalendarDays}
              label="Today's appointments"
              value={stats?.todayAppointments?.toString() || '0'}
              detail={`${stats?.weeklyAppointments || 0} this week`}
              tone="bg-[#edf3ff] text-primary"
            />
            <DoctorMetric
              icon={CheckCircle2}
              label="Completed consultations"
              value={String(stats?.totalAppointments || 0)}
              detail={`${stats?.totalPatients || 0} unique patients`}
              tone="bg-[#e9f8f3] text-[#2b9d7e]"
            />
            <DoctorMetric
              icon={Clock3}
              label="Slot utilization"
              value={`${stats?.slotUtilization || 0}%`}
              detail="This week's capacity"
              tone="bg-[#fff3e7] text-[#d68b42]"
            />
            <DoctorMetric
              icon={CircleDollarSign}
              label="Total revenue"
              value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
              detail="All-time earnings"
              tone="bg-[#f2edff] text-[#8767d8]"
            />
          </section>

          {/* Charts Row 1 */}
          <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
            <ChartCard
              title="Patient volume"
              subtitle="Daily patient visits"
              action={
                <div className="bg-secondary flex rounded-lg p-0.5">
                  {['Day', 'Week', 'Month'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setRange(item)}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
                        range === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              }
            >
              <VolumeChart data={(volumeData || []) as VolumeDataPoint[]} />
            </ChartCard>
            <ChartCard title="Slot utilization" subtitle="This week's appointment capacity">
              <UtilizationDonutChart data={formattedUtilization} />
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
            <ChartCard title="Revenue breakdown" subtitle="Consultation revenue by type">
              <RevenueStackedBarChart data={revenueData || []} />
            </ChartCard>
            <ScheduleTimeline appointments={transformedAppointments} />
          </div>

          {/* Upcoming Appointments */}
          <UpcomingAppointments
            appointments={transformedAppointments}
            onAction={action}
            onViewFullSchedule={() => router.push('/doctor/schedule')}
          />

          {/* Recent Patients */}
          <RecentPatients
            patients={recentPatients || []}
            onAction={action}
            onViewAll={() => router.push('/doctor/patients')}
          />

          {/* Quick Actions */}
          <QuickActions
            actions={quickActions.map((a) => ({
              ...a,
              onClick: () => a.href && router.push(a.href),
            }))}
          />

          <div className="flex justify-end">
            <button
              onClick={reload}
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Refresh overview
            </button>
          </div>
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
