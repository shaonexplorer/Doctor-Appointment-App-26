'use client';

import { useState } from 'react';
import { PatientDashboard } from '@/components/patient-dashboard';
import { FindDoctors } from '@/components/find-doctors';
import { DoctorProfile } from '@/components/doctor-profile';
import { BookingFlow } from '@/components/booking-flow';
import { PatientAppointments } from '@/components/patient-appointments';
import { PatientRecords } from '@/components/patient-records';
import { PatientProfileSettings } from '@/components/patient-profile-settings';
import { NotificationCenter } from '@/components/notification-center';
import { GlobalSearch } from '@/components/global-search';
import { AssistantWorkspace } from '@/components/ai-assistant/assistant-workspace';
import { AssistantLauncher } from '@/components/ai-assistant/assistant-launcher';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
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
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Find Doctors', icon: Stethoscope },
  { label: 'Doctor Profile', icon: UserRound },
  { label: 'Book Appointment', icon: CalendarDays },
  { label: 'Appointments', icon: CalendarDays },
  { label: 'Prescriptions', icon: Pill },
  { label: 'Medical Records', icon: FileText },
  { label: 'AI Assistant', icon: Sparkles },
];
const secondary = [
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
  { label: 'Notifications', icon: Bell },
];

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center px-0' : ''}`}>
      <div className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl shadow-sm">
        <PlusMark />
      </div>
      {!collapsed && (
        <span className="text-foreground text-lg font-black tracking-tight">
          Medi<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}
function PlusMark() {
  return (
    <span className="relative block size-4">
      <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
    </span>
  );
}

export function PatientPortalShell({ initialSection = 'Dashboard' }: { initialSection?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(initialSection);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const navItem = (item: (typeof navigation)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label;
    return (
      <button
        key={item.label}
        onClick={() => {
          setActive(item.label);
          setMobileOpen(false);
        }}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'} ${collapsed ? 'justify-center px-0' : ''}`}
        aria-current={selected ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="size-[18px] shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-40 hidden border-r transition-all duration-200 lg:flex lg:flex-col ${collapsed ? 'w-[76px]' : 'w-[248px]'}`}
      >
        <Brand collapsed={collapsed} />
        <div className="flex flex-1 flex-col px-3">
          {!collapsed && (
            <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
              Patient portal
            </p>
          )}
          <nav className="flex flex-col gap-1">{navigation.map(navItem)}</nav>
          <div className="border-border my-5 border-t" />
          {!collapsed && (
            <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
              Account
            </p>
          )}
          <nav className="flex flex-col gap-1">{secondary.map(navItem)}</nav>
        </div>
        <div
          className={`bg-secondary m-3 rounded-2xl p-3 ${collapsed ? 'flex justify-center p-2' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              SJ
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">Sarah Johnson</p>
                <p className="text-muted-foreground truncate text-[11px]">Patient account</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="border-border text-muted-foreground hover:bg-secondary mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
            className="text-muted-foreground hover:bg-secondary mr-4 rounded-lg p-2"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navigation.map(navItem)}
          <div className="border-border my-5 border-t" />
          {secondary.map(navItem)}
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
              <span>Patient portal</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">{active}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="patient" onNavigate={setActive} />
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
                className="hover:bg-secondary flex items-center gap-2 rounded-xl p-1.5"
                aria-expanded={profileOpen}
              >
                <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                  SJ
                </div>
                <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
              </button>
              {profileOpen && (
                <div className="border-border bg-card absolute top-12 right-0 w-44 rounded-xl border p-1.5 text-sm shadow-lg">
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
        <main
          className={
            active === 'AI Assistant'
              ? 'mx-auto max-w-none min-w-0 p-0 sm:p-0 lg:p-0'
              : 'mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10'
          }
        >
          {active === 'AI Assistant' ? (
            <AssistantWorkspace />
          ) : (
            <>
              <div className="mb-8">
                <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
                  {active === 'Dashboard' ? 'Monday, September 21, 2026' : 'Patient portal'}
                </p>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {active === 'Dashboard' ? 'Good morning, Sarah' : active}
                </h1>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                  {active === 'Dashboard'
                    ? 'Here’s what’s happening with your health today.'
                    : `Manage your ${active.toLowerCase()} in one secure place.`}
                </p>
              </div>
              {active === 'Dashboard' ? (
                <PatientDashboard onOpenAssistant={() => setActive('AI Assistant')} />
              ) : active === 'Find Doctors' ? (
                <FindDoctors onOpenProfile={() => setActive('Doctor Profile')} />
              ) : active === 'Doctor Profile' ? (
                <DoctorProfile
                  onBack={() => setActive('Find Doctors')}
                  onBook={() => setActive('Book Appointment')}
                />
              ) : active === 'Book Appointment' ? (
                <BookingFlow
                  onBack={() => setActive('Doctor Profile')}
                  onDashboard={() => setActive('Dashboard')}
                />
              ) : active === 'Appointments' ? (
                <PatientAppointments />
              ) : active === 'Prescriptions' || active === 'Medical Records' ? (
                <PatientRecords />
              ) : active === 'Profile' ? (
                <PatientProfileSettings mode="profile" />
              ) : active === 'Settings' ? (
                <PatientProfileSettings mode="settings" />
              ) : active === 'Notifications' ? (
                <NotificationCenter role="patient" />
              ) : (
                <div className="border-border bg-card rounded-2xl border border-dashed p-12 text-center">
                  <UsersRound className="text-primary/60 mx-auto size-8" />
                  <h2 className="mt-4 font-bold">{active} workspace</h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    This shared portal shell is ready for the {active.toLowerCase()} workflow.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
        {active !== 'AI Assistant' && (
          <AssistantLauncher onExpand={() => setActive('AI Assistant')} />
        )}
        {active !== 'AI Assistant' && (
          <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
            {[navigation[0], navigation[1], navigation[3], navigation[4], navigation[5]].map(
              (item) => {
                const Icon = item.icon;
                const selected = active === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActive(item.label)}
                    className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${selected ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <Icon className="size-[18px]" />
                    <span>
                      {item.label === 'Find Doctors'
                        ? 'Doctors'
                        : item.label === 'Book Appointment'
                          ? 'Book'
                          : item.label}
                    </span>
                  </button>
                );
              }
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Your health at a glance</h2>
            <p className="text-muted-foreground mt-1 text-xs">Keep track of what matters most.</p>
          </div>
          <button
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
            aria-label="More health options"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Upcoming visits"
            value="2"
            icon={CalendarDays}
            tone="bg-[#edf3ff] text-primary"
          />
          <Metric
            label="Active prescriptions"
            value="4"
            icon={Pill}
            tone="bg-[#e9f8f3] text-[#2b9d7e]"
          />
          <Metric
            label="Health records"
            value="12"
            icon={FileText}
            tone="bg-[#fff3e7] text-[#d68b42]"
          />
        </div>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Next appointment
            </p>
            <h2 className="mt-2 font-bold">Dr. Michael Chen</h2>
            <p className="text-muted-foreground mt-1 text-xs">Cardiology · Video visit</p>
          </div>
          <div className="grid size-11 place-items-center rounded-full bg-[#e9f8f3] text-[#2b9d7e]">
            <CalendarDays className="size-5" />
          </div>
        </div>
        <div className="bg-secondary mt-5 flex items-center gap-3 rounded-xl p-3">
          <div className="bg-card text-primary grid size-10 place-items-center rounded-lg text-xs font-black">
            24
            <br />
            <span className="text-[8px]">SEP</span>
          </div>
          <div>
            <p className="text-sm font-bold">Thursday, 10:30 AM</p>
            <p className="text-muted-foreground text-xs">In 3 days</p>
          </div>
        </div>
        <button className="bg-primary text-primary-foreground mt-4 w-full rounded-xl py-2.5 text-xs font-bold hover:opacity-90">
          View appointment
        </button>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6 xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Recent activity</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your latest care updates.</p>
          </div>
          <button className="text-primary text-xs font-bold hover:underline">View all</button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Activity icon={FileText} title="Lab results available" detail="Blood panel · Today" />
          <Activity icon={Pill} title="Prescription renewed" detail="Atorvastatin · Yesterday" />
          <Activity icon={Stethoscope} title="Visit summary added" detail="Dr. Chen · Sep 12" />
        </div>
      </section>
    </div>
  );
}
function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
  tone: string;
}) {
  return (
    <div className="border-border flex items-center gap-3 rounded-xl border p-4">
      <div className={`grid size-10 place-items-center rounded-lg ${tone}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-muted-foreground text-[11px]">{label}</p>
      </div>
    </div>
  );
}
function Activity({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof FileText;
  title: string;
  detail: string;
}) {
  return (
    <div className="border-border flex items-center gap-3 rounded-xl border p-4">
      <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
      </div>
    </div>
  );
}
