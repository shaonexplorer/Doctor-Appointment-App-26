'use client';

import { useState } from 'react';
import { AdminUsers } from '@/components/admin-users';
import { AdminDoctors } from '@/components/admin-doctors';
import { AdminFacilities } from '@/components/admin-facilities';
import { AdminAnalytics } from '@/components/admin-analytics';
import { NotificationCenter } from '@/components/notification-center';
import { GlobalSearch } from '@/components/admin-global-search';
import { UXStateLibrary } from '@/components/admin-ux-state-library';
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  UserRound,
  X,
} from 'lucide-react';

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Users', Users],
  ['Doctors', Stethoscope],
  ['Patients', UserRound],
  ['Staff', ShieldCheck],
  ['Appointments', CalendarDays],
  ['Clinics', Building2],
  ['Departments', PanelLeft],
  ['Analytics', Activity],
  ['Payments', CreditCard],
  ['Reports', FileText],
  ['Settings', Settings],
] as const;

export function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const go = (item: string) => {
    setActive(item);
    setMobileOpen(false);
    if (item !== 'Dashboard') setNotice(`${item} workspace selected`);
  };
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#17233d]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#17233d]/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-[#e5e9f2] bg-white transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-3">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.17em] text-slate-400 uppercase">
            Admin console
          </p>
          <nav className="flex flex-col gap-1">
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => go(label)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${active === label ? 'bg-[#eaf0ff] text-[#4f72c9]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#17233d]'}`}
              >
                <Icon className="size-[17px]" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="m-3 mt-auto rounded-2xl bg-[#f1f4fa] p-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#dce7ff] text-xs font-bold text-[#4f72c9]">
              AM
            </div>
            <div>
              <p className="text-xs font-bold">Alex Morgan</p>
              <p className="text-[11px] text-slate-500">System Administrator</p>
            </div>
            <MoreHorizontal className="ml-auto size-4 text-slate-400" />
          </div>
        </div>
      </aside>
      <div className="min-w-0 lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e5e9f2] bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden text-xs text-slate-400 sm:block">
              Admin console <span className="mx-2">/</span>
              <span className="font-semibold text-[#17233d]">{active}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="admin" onNavigate={go} />
            <button
              onClick={() => setActive('Notifications')}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#d47778]" />
            </button>
            <button
              className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 sm:block"
              aria-label="Help"
            >
              <CircleHelp className="size-[18px]" />
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-[#dce7ff] text-xs font-bold text-[#4f72c9]">
              AM
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 pb-24 sm:p-8 lg:p-10">
          <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#6b8bd6] uppercase">
            Monday, September 21, 2026
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                {active === 'Dashboard' ? 'Good morning, Alex' : active}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {active === 'Dashboard'
                  ? "Here's what's happening across your healthcare network."
                  : `System-wide ${active.toLowerCase()} overview and operations.`}
              </p>
            </div>
            <button
              onClick={() => setNotice('Report export started')}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-[#dce2ee] bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <FileText className="size-4" /> Export report
            </button>
          </div>
          {active === 'Dashboard' ? (
            <Dashboard />
          ) : active === 'Users' ? (
            <AdminUsers />
          ) : active === 'Doctors' ? (
            <AdminDoctors />
          ) : active === 'Clinics' ? (
            <AdminFacilities kind="Clinics" />
          ) : active === 'Departments' ? (
            <AdminFacilities kind="Departments" />
          ) : active === 'Analytics' ? (
            <AdminAnalytics />
          ) : active === 'Notifications' ? (
            <NotificationCenter role="admin" />
          ) : active === 'Settings' ? (
            <UXStateLibrary />
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#dce2ee] bg-white p-12 text-center">
              <ClipboardList className="mx-auto size-8 text-[#6b8bd6]" />
              <h2 className="mt-4 font-bold">{active} workspace</h2>
              <p className="mt-2 text-sm text-slate-500">
                System-wide tools for {active.toLowerCase()} are ready to connect here.
              </p>
            </div>
          )}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t border-[#e5e9f2] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {[
            ['Dashboard', LayoutDashboard],
            ['Users', Users],
            ['Doctors', Stethoscope],
            ['Analytics', Activity],
            ['Appointments', CalendarDays],
          ].map(([label, Icon]) => (
            <button
              key={label as string}
              onClick={() => go(label as string)}
              className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${active === label ? 'text-[#4f72c9]' : 'text-slate-400'}`}
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        {notice && (
          <div
            role="status"
            className="fixed right-5 bottom-6 z-50 flex items-center gap-2 rounded-xl border border-[#dce2ee] bg-white px-4 py-3 text-sm font-semibold shadow-lg"
          >
            <ShieldCheck className="size-4 text-[#43ae91]" />
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}
function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 place-items-center rounded-xl bg-[#5d83d8] text-white shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      <span className="text-lg font-black tracking-tight text-[#17233d]">
        Medi<span className="text-[#5d83d8]">Book</span>
      </span>
    </div>
  );
}
