'use client';

import { useState } from 'react';
import { DoctorDashboard as DetailedDoctorDashboard } from '@/components/doctor-dashboard';
import { DoctorSchedule } from '@/components/doctor-schedule';
import { DoctorAppointments } from '@/components/doctor-appointments';
import { DoctorConsultation } from '@/components/doctor-consultation';
import { DoctorPrescription } from '@/components/doctor-prescription';
import { DoctorPatients } from '@/components/doctor-patients';
import { NotificationCenter } from '@/components/notification-center';
import { GlobalSearch } from '@/components/global-search';
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  Search,
  Settings,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const primaryNav = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Appointments', icon: CalendarDays },
  { label: 'Schedule', icon: Activity },
  { label: 'Patients', icon: UsersRound },
  { label: 'Prescriptions', icon: Pill },
  { label: 'Analytics', icon: FileText },
];
const accountNav = [
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
  { label: 'Notifications', icon: Bell },
];

export function DoctorPortalShell() {
  const [active, setActive] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const item = (entry: (typeof primaryNav)[number]) => {
    const Icon = entry.icon;
    const selected = active === entry.label;
    return (
      <button
        key={entry.label}
        onClick={() => {
          setActive(entry.label);
          setMobileOpen(false);
        }}
        aria-current={selected ? 'page' : undefined}
        title={collapsed ? entry.label : undefined}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'} ${collapsed ? 'justify-center px-0' : ''}`}
      >
        <Icon className="size-[18px] shrink-0" />
        {!collapsed && <span>{entry.label}</span>}
      </button>
    );
  };

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-40 hidden border-r transition-all lg:flex lg:flex-col ${collapsed ? 'w-[76px]' : 'w-[248px]'}`}
      >
        <Brand collapsed={collapsed} />
        <div className="flex flex-1 flex-col px-3">
          <p
            className={`text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase ${collapsed ? 'sr-only' : ''}`}
          >
            Doctor portal
          </p>
          <nav className="flex flex-col gap-1">{primaryNav.map(item)}</nav>
          <div className="border-border my-5 border-t" />
          <p
            className={`text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase ${collapsed ? 'sr-only' : ''}`}
          >
            Account
          </p>
          <nav className="flex flex-col gap-1">{accountNav.map(item)}</nav>
        </div>
        <div
          className={`bg-secondary m-3 rounded-2xl p-3 ${collapsed ? 'flex justify-center p-2' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              MA
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">Dr. Michael Anderson</p>
                <p className="text-muted-foreground truncate text-[11px]">
                  Senior Consultant Cardiologist
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="border-border text-muted-foreground hover:bg-secondary mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" /> Collapse
            </>
          )}
        </button>
      </aside>
      {mobileOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r shadow-xl transition-transform lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <Brand collapsed={false} />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="text-muted-foreground hover:bg-secondary mr-4 rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {primaryNav.map(item)}
          <div className="border-border my-5 border-t" />
          {accountNav.map(item)}
        </nav>
      </aside>
      <div
        className={`min-w-0 transition-[padding] duration-200 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]'}`}
      >
        <header className="border-border bg-background/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted-foreground hover:bg-secondary rounded-lg p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
              <span>Doctor portal</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">{active}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="doctor" onNavigate={setActive} />
            <button
              onClick={() => setActive('Notifications')}
              className="text-muted-foreground hover:bg-secondary relative rounded-xl p-2.5"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="border-background bg-primary absolute top-1.5 right-1.5 size-2 rounded-full border-2" />
            </button>
            <button
              className="text-muted-foreground hover:bg-secondary hidden rounded-xl p-2.5 sm:block"
              aria-label="Help"
            >
              <CircleHelp className="size-[18px]" />
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="hover:bg-secondary flex items-center gap-2 rounded-xl p-1.5"
              >
                <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                  MA
                </div>
                <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
              </button>
              {profileOpen && (
                <div className="border-border bg-card absolute top-12 right-0 w-48 rounded-xl border p-1.5 text-sm shadow-lg">
                  <p className="px-3 py-2 text-xs font-bold">Dr. Michael Anderson</p>
                  <button
                    onClick={() => {
                      setActive('Profile');
                      setProfileOpen(false);
                    }}
                    className="hover:bg-secondary w-full rounded-lg px-3 py-2 text-left font-semibold"
                  >
                    My profile
                  </button>
                  <button
                    onClick={() => {
                      setActive('Settings');
                      setProfileOpen(false);
                    }}
                    className="hover:bg-secondary w-full rounded-lg px-3 py-2 text-left font-semibold"
                  >
                    Settings
                  </button>
                  <button className="hover:bg-secondary w-full rounded-lg px-3 py-2 text-left font-semibold">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
          <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
            Monday, September 21, 2026
          </p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {active === 'Dashboard'
              ? 'Good morning, Dr. Anderson'
              : active === 'Schedule'
                ? 'My Schedule'
                : active === 'Appointments'
                  ? 'Appointments'
                  : active === 'Patients'
                    ? 'My Patients'
                    : active}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            {active === 'Dashboard'
              ? 'Here’s your clinical overview for today.'
              : `Manage your ${active.toLowerCase()} workflow in one secure place.`}
          </p>
          {active === 'Dashboard' ? (
            <DetailedDoctorDashboard />
          ) : active === 'Schedule' ? (
            <DoctorSchedule />
          ) : active === 'Appointments' ? (
            <DoctorAppointments onConsult={() => setActive('Consultation')} />
          ) : active === 'Consultation' ? (
            <DoctorConsultation onBack={() => setActive('Appointments')} />
          ) : active === 'Prescriptions' ? (
            <DoctorPrescription />
          ) : active === 'Patients' ? (
            <DoctorPatients />
          ) : active === 'Notifications' ? (
            <NotificationCenter role="doctor" />
          ) : (
            <Placeholder title={active} />
          )}
        </main>
        <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {[primaryNav[0], primaryNav[1], primaryNav[2], primaryNav[3], primaryNav[4]].map(
            (entry) => {
              const Icon = entry.icon;
              return (
                <button
                  key={entry.label}
                  onClick={() => setActive(entry.label)}
                  className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${active === entry.label ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <Icon className="size-[18px]" />
                  <span>{entry.label === 'Appointments' ? 'Visits' : entry.label}</span>
                </button>
              );
            }
          )}
        </nav>
      </div>
    </div>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center px-0' : ''}`}>
      <div className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      {!collapsed && (
        <span className="text-lg font-black tracking-tight">
          Medi<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}

function DoctorDashboard() {
  return (
    <div className="mt-8 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Today’s clinical overview</h2>
            <p className="text-muted-foreground mt-1 text-xs">Monday, September 21, 2026</p>
          </div>
          <span className="rounded-full bg-[#e9f8f3] px-3 py-1.5 text-[11px] font-bold text-[#258c70]">
            Clinic open
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Today’s appointments" value="12" tone="bg-[#edf3ff] text-primary" />
          <Metric label="Waiting room" value="3" tone="bg-[#fff3e7] text-[#d68b42]" />
          <Metric label="Follow-ups due" value="8" tone="bg-[#e9f8f3] text-[#2b9d7e]" />
        </div>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Next appointment
            </p>
            <h2 className="mt-2 font-bold">Sarah Johnson</h2>
            <p className="text-muted-foreground mt-1 text-xs">Follow-up · Cardiology</p>
          </div>
          <div className="text-primary grid size-11 place-items-center rounded-full bg-[#edf3ff]">
            <CalendarDays className="size-5" />
          </div>
        </div>
        <div className="bg-secondary mt-5 flex items-center gap-3 rounded-xl p-3">
          <div className="bg-card text-primary grid size-10 place-items-center rounded-lg text-xs font-black">
            09:30
          </div>
          <div>
            <p className="text-sm font-bold">Today, 9:30 AM</p>
            <p className="text-muted-foreground text-xs">In-person · Room 204</p>
          </div>
        </div>
        <button className="bg-primary text-primary-foreground mt-4 w-full rounded-xl py-2.5 text-xs font-bold hover:opacity-90">
          Open appointment
        </button>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6 xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Today’s schedule</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your next patient appointments.</p>
          </div>
          <button className="text-primary text-xs font-bold hover:underline">
            View full schedule
          </button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <Appointment
            time="09:30 AM"
            name="Sarah Johnson"
            type="Follow-up consultation"
            status="Checked in"
          />
          <Appointment
            time="10:15 AM"
            name="Robert Williams"
            type="New patient consultation"
            status="Confirmed"
          />
          <Appointment
            time="11:00 AM"
            name="Emily Davis"
            type="Test results review"
            status="Telehealth"
          />
        </div>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent patients</h2>
          <button className="text-primary text-xs font-bold hover:underline">View all</button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Patient name="Sarah Johnson" detail="Follow-up · Today" initials="SJ" />
          <Patient name="Robert Williams" detail="New patient · Today" initials="RW" />
          <Patient name="Emily Davis" detail="Results review · Yesterday" initials="ED" />
        </div>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <h2 className="font-bold">Quick actions</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Action label="Add prescription" icon={Pill} />
          <Action label="View patient records" icon={FileText} />
          <Action label="Manage schedule" icon={CalendarDays} />
          <Action label="Write clinical note" icon={Stethoscope} />
        </div>
      </section>
    </div>
  );
}
function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border-border rounded-xl border p-4">
      <div className={`mb-3 grid size-9 place-items-center rounded-lg text-sm font-black ${tone}`}>
        {value}
      </div>
      <p className="text-muted-foreground text-[11px]">{label}</p>
    </div>
  );
}
function Appointment({
  time,
  name,
  type,
  status,
}: {
  time: string;
  name: string;
  type: string;
  status: string;
}) {
  return (
    <div className="border-border flex items-center justify-between rounded-xl border p-4">
      <div>
        <p className="text-primary text-xs font-bold">{time}</p>
        <p className="mt-2 text-sm font-bold">{name}</p>
        <p className="text-muted-foreground mt-1 text-xs">{type}</p>
      </div>
      <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold">
        {status}
      </span>
    </div>
  );
}
function Patient({ name, detail, initials }: { name: string; detail: string; initials: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold">{name}</p>
        <p className="text-muted-foreground text-xs">{detail}</p>
      </div>
      <ChevronRight className="text-muted-foreground ml-auto size-4" />
    </div>
  );
}
function Action({ label, icon: Icon }: { label: string; icon: typeof Pill }) {
  return (
    <button className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-bold">
      <Icon className="text-primary size-4" />
      {label}
    </button>
  );
}
function Placeholder({ title }: { title: string }) {
  return (
    <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-12 text-center">
      <Stethoscope className="text-primary/60 mx-auto size-8" />
      <h2 className="mt-4 font-bold">{title} workspace</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Clinical workflow tools for {title.toLowerCase()} are ready to be connected here.
      </p>
    </div>
  );
}
