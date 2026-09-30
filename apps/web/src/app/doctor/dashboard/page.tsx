'use client';

import { useState } from 'react';
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

const volumeData = [
  { day: 'Mon', patients: 18 },
  { day: 'Tue', patients: 24 },
  { day: 'Wed', patients: 21 },
  { day: 'Thu', patients: 29 },
  { day: 'Fri', patients: 25 },
  { day: 'Sat', patients: 14 },
  { day: 'Sun', patients: 10 },
];

const utilizationData = [
  { name: 'Booked', value: 68, color: '#1E40AF' },
  { name: 'Available', value: 22, color: '#059669' },
  { name: 'Cancelled', value: 10, color: '#DC2626' },
];

const revenueData = [
  { day: 'Mon', follow: 420, new: 260, video: 180 },
  { day: 'Tue', follow: 560, new: 320, video: 220 },
  { day: 'Wed', follow: 480, new: 390, video: 150 },
  { day: 'Thu', follow: 620, new: 420, video: 260 },
  { day: 'Fri', follow: 520, new: 350, video: 200 },
];

const appointments = [
  {
    time: '09:00 AM',
    patient: 'Sarah Johnson',
    type: 'Follow-up',
    status: 'Confirmed' as const,
    payment: 'Paid' as const,
  },
  {
    time: '09:30 AM',
    patient: 'Robert Chen',
    type: 'New consultation',
    status: 'Waiting' as const,
    payment: 'Paid' as const,
  },
  {
    time: '10:30 AM',
    patient: 'Emily Davis',
    type: 'Video consultation',
    status: 'Confirmed' as const,
    payment: 'Pending' as const,
  },
  {
    time: '11:15 AM',
    patient: 'James Wilson',
    type: 'Follow-up',
    status: 'Confirmed' as const,
    payment: 'Paid' as const,
  },
];

const recentPatients = [
  {
    patient: 'Sarah Johnson',
    visit: 'Sep 14, 2026',
    diagnosis: 'Hypertension',
    appointment: 'Follow-up',
    initials: 'SJ',
  },
  {
    patient: 'Robert Chen',
    visit: 'Sep 11, 2026',
    diagnosis: 'Arrhythmia',
    appointment: 'Consultation',
    initials: 'RC',
  },
  {
    patient: 'Emily Davis',
    visit: 'Sep 08, 2026',
    diagnosis: 'Palpitations',
    appointment: 'Video visit',
    initials: 'ED',
  },
];

const quickActions = [
  { icon: CalendarDays, label: 'View Schedule' },
  { icon: Plus, label: 'New Appointment' },
  { icon: UsersRound, label: 'Patient List' },
  { icon: Pill, label: 'Prescriptions' },
];

export default function DoctorDashboardPage() {
  const [notice, setNotice] = useState('');
  const [range, setRange] = useState('Week');

  const action = (label: string, patient?: string) => {
    setNotice(`${label}${patient ? ` for ${patient}` : ''} is ready.`);
  };

  const reload = () => {
    setNotice('Refreshing...');
    setTimeout(() => setNotice('Data refreshed.'), 650);
  };

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
              value="12"
              detail="3 more than average"
              tone="bg-[#edf3ff] text-primary"
            />
            <DoctorMetric
              icon={CheckCircle2}
              label="Completed consultations"
              value="8"
              detail="67% of today's visits"
              tone="bg-[#e9f8f3] text-[#2b9d7e]"
            />
            <DoctorMetric
              icon={Clock3}
              label="Waiting patients"
              value="3"
              detail="Average wait 12 min"
              tone="bg-[#fff3e7] text-[#d68b42]"
            />
            <DoctorMetric
              icon={CircleDollarSign}
              label="Today's revenue"
              value="$1,240"
              detail="18% above last Monday"
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
              <VolumeChart data={volumeData} />
            </ChartCard>
            <ChartCard title="Slot utilization" subtitle="Today's appointment capacity">
              <UtilizationDonutChart data={utilizationData} />
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
            <ChartCard title="Revenue breakdown" subtitle="Consultation revenue by type">
              <RevenueStackedBarChart data={revenueData} />
            </ChartCard>
            <ScheduleTimeline appointments={appointments} />
          </div>

          {/* Upcoming Appointments */}
          <UpcomingAppointments
            appointments={appointments}
            onAction={action}
            onViewFullSchedule={() => action('View full schedule')}
          />

          {/* Recent Patients */}
          <RecentPatients
            patients={recentPatients}
            onAction={action}
            onViewAll={() => action('Patient directory')}
          />

          {/* Quick Actions */}
          <QuickActions
            actions={quickActions.map((a) => ({ ...a, onClick: () => action(a.label) }))}
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
