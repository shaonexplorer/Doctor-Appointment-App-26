'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
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
} from '@/components/patient-dashboard';

const specialtyData = [
  { name: 'Cardiology', value: 42, color: '#4f6ef7' },
  { name: 'Dermatology', value: 25, color: '#67c7b6' },
  { name: 'Internal Medicine', value: 20, color: '#f4b36a' },
  { name: 'Pediatrics', value: 13, color: '#b596ef' },
];

const expenseData = [
  { month: 'Apr', amount: 280 },
  { month: 'May', amount: 420 },
  { month: 'Jun', amount: 360 },
  { month: 'Jul', amount: 580 },
  { month: 'Aug', amount: 440 },
  { month: 'Sep', amount: 690 },
];

const timeline = [
  {
    date: 'Sep 24',
    title: 'Cardiology follow-up',
    doctor: 'Dr. Michael Anderson',
    status: 'Upcoming',
    icon: <CalendarDays />,
  },
  {
    date: 'Sep 12',
    title: 'Annual skin screening',
    doctor: 'Dr. Olivia Bennett',
    status: 'Completed',
    icon: <Check />,
  },
  {
    date: 'Aug 28',
    title: 'Primary care visit',
    doctor: 'Dr. James Wilson',
    status: 'Completed',
    icon: <Stethoscope />,
  },
];

const prescriptions = [
  {
    name: 'Atorvastatin 20mg',
    doctor: 'Dr. Michael Anderson',
    date: 'Sep 12, 2026',
    status: 'Active',
  },
  { name: 'Lisinopril 10mg', doctor: 'Dr. James Wilson', date: 'Aug 28, 2026', status: 'Active' },
  {
    name: 'Vitamin D3 1000 IU',
    doctor: 'Dr. Olivia Bennett',
    date: 'Aug 14, 2026',
    status: 'Refill due',
  },
];

const quickActions = [
  { icon: <Stethoscope />, label: 'Find a doctor' },
  { icon: <Plus />, label: 'Book appointment' },
  { icon: <Pill />, label: 'View prescriptions' },
  { icon: <FileText />, label: 'Medical records' },
];

export default function PatientDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const reload = () => {
    setLoading(true);
    setNotice('');
    window.setTimeout(() => setLoading(false), 650);
  };

  const action = (label: string) => {
    switch (label) {
      case 'Find a doctor':
        router.push('/doctors/search');
        break;
      case 'Book appointment':
        router.push('/doctors/search');
        break;
      case 'View prescriptions':
        router.push('/patient/records');
        break;
      case 'Medical records':
        router.push('/patient/records');
        break;
      default:
        setNotice(`${label} is ready to open.`);
        break;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border-border bg-card h-44 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
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
              <button onClick={() => setNotice('')} aria-label="Dismiss notification">
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
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary text-xs font-bold tracking-[0.14em] uppercase">
                    Next appointment
                  </p>
                  <h2 className="mt-2 text-xl font-black">Dr. Michael Anderson</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Cardiology &middot; Heart & Vascular Center
                  </p>
                </div>
                <div className="text-primary grid size-12 place-items-center rounded-full bg-[#dce8ff] text-sm font-black">
                  MA
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Detail icon={<CalendarDays />} label="Date" value="Thursday, Sep 24" />
                <Detail icon={<Clock3 />} label="Time" value="10:30 AM" />
                <Detail icon={<Video />} label="Visit type" value="Video visit" />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#e6f7ef] px-3 py-1 text-xs font-bold text-[#278e70]">
                  Confirmed
                </span>
                <span className="text-muted-foreground text-xs">Starts in 3 days</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => action('Appointment details')}
                  className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
                >
                  View appointment
                </button>
                <button
                  onClick={() => action('Reschedule')}
                  className="border-border hover:bg-secondary rounded-xl border px-4 py-2.5 text-xs font-bold"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => action('Cancellation')}
                  className="text-muted-foreground hover:bg-secondary rounded-xl px-4 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
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
                <Reminder
                  icon={<CalendarDays />}
                  title="Prepare for your video visit"
                  detail="Check your camera and connection."
                />
                <Reminder
                  icon={<Pill />}
                  title="Refill Lisinopril"
                  detail="Your refill is due in 8 days."
                />
                <Reminder
                  icon={<FileText />}
                  title="Review recent results"
                  detail="Two new documents are available."
                />
              </div>
            </Panel>
          </section>

          {/* KPI Metrics */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Upcoming appointments"
              value="2"
              icon={<CalendarDays />}
              tone="bg-[#edf3ff] text-primary"
            />
            <Metric
              label="Completed visits"
              value="12"
              icon={<Check />}
              tone="bg-[#e9f8f3] text-[#2b9d7e]"
            />
            <Metric
              label="Active prescriptions"
              value="4"
              icon={<Pill />}
              tone="bg-[#fff3e7] text-[#d68b42]"
            />
            <Metric
              label="Medical expenses"
              value="$2,840"
              icon={<Activity />}
              tone="bg-[#f2ecff] text-[#8e68dc]"
            />
          </section>

          {/* Charts */}
          <section className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
            <Panel
              title="Appointment timeline"
              action="View all"
              onAction={() => action('All appointments')}
            >
              <div className="flex flex-col gap-4">
                {timeline.map((item) => (
                  <div key={item.date} className="flex gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center">
                      <span className="text-foreground text-xs font-black">{item.date}</span>
                      <span className="bg-border mt-2 h-full w-px" />
                    </div>
                    <div className="border-border hover:border-primary/30 hover:bg-primary/[0.02] relative -mt-1 flex-1 rounded-xl border p-3 transition">
                      <span
                        className={`absolute top-3 right-3 rounded-full px-2 py-1 text-[10px] font-bold ${item.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}
                      >
                        {item.status}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-muted-foreground mt-1 text-xs">{item.doctor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Appointments by specialty" action="This year">
              <SpecialtyPieChart data={specialtyData} total="24" totalLabel="visits" />
            </Panel>
          </section>

          {/* Prescriptions & Expenses */}
          <section className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
            <Panel
              title="Recent prescriptions"
              action="View all"
              onAction={() => action('All prescriptions')}
            >
              <div className="flex flex-col gap-2">
                {prescriptions.map((item) => (
                  <div
                    key={item.name}
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
                    <span
                      className={`hidden rounded-full px-2 py-1 text-[10px] font-bold sm:block ${item.status === 'Active' ? 'bg-[#e6f7ef] text-[#278e70]' : 'bg-[#fff3e7] text-[#b97932]'}`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => action(`Download for ${item.name}`)}
                      className="text-muted-foreground hover:bg-card hover:text-primary rounded-lg p-2"
                      aria-label={`Download ${item.name}`}
                    >
                      <Download className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Monthly medical expenses" action="2026">
              <MonthlyExpensesBarChart data={expenseData} />
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
              {quickActions.map((actionItem) => (
                <Action
                  key={actionItem.label}
                  icon={actionItem.icon}
                  label={actionItem.label}
                  onClick={() => action(actionItem.label)}
                />
              ))}
            </div>
          </section>

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
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
