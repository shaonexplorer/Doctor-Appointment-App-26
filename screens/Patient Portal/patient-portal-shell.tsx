"use client"

import { useState } from "react"
import { PatientDashboard } from "@/components/patient-dashboard"
import { FindDoctors } from "@/components/find-doctors"
import { DoctorProfile } from "@/components/doctor-profile"
import { BookingFlow } from "@/components/booking-flow"
import { PatientAppointments } from "@/components/patient-appointments"
import { PatientRecords } from "@/components/patient-records"
import { PatientProfileSettings } from "@/components/patient-profile-settings"
import { NotificationCenter } from "@/components/notification-center"
import { GlobalSearch } from "@/components/global-search"
import {
  Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, FileText,
  LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, Pill, Search, Settings,
  Stethoscope, UserRound, UsersRound, X,
} from "lucide-react"

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Find Doctors", icon: Stethoscope },
  { label: "Doctor Profile", icon: UserRound },
  { label: "Book Appointment", icon: CalendarDays },
  { label: "Appointments", icon: CalendarDays },
  { label: "Prescriptions", icon: Pill },
  { label: "Medical Records", icon: FileText },
]
const secondary = [
  { label: "Profile", icon: UserRound },
  { label: "Settings", icon: Settings },
  { label: "Notifications", icon: Bell },
]

function Brand({ collapsed }: { collapsed: boolean }) {
  return <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? "justify-center px-0" : ""}`}><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><PlusMark /></div>{!collapsed && <span className="text-lg font-black tracking-tight text-foreground">Medi<span className="text-primary">Book</span></span>}</div>
}
function PlusMark() { return <span className="relative block size-4"><span className="absolute left-1/2 top-0 h-4 w-1 -translate-x-1/2 rounded-full bg-current" /><span className="absolute left-0 top-1/2 h-1 w-4 -translate-y-1/2 rounded-full bg-current" /></span> }

export function PatientPortalShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("Dashboard")
  const [query, setQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)

  const navItem = (item: typeof navigation[number]) => {
    const Icon = item.icon
    const selected = active === item.label
    return <button key={item.label} onClick={() => { setActive(item.label); setMobileOpen(false) }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"} ${collapsed ? "justify-center px-0" : ""}`} aria-current={selected ? "page" : undefined} title={collapsed ? item.label : undefined}><Icon className="size-[18px] shrink-0" />{!collapsed && <span>{item.label}</span>}</button>
  }

  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-all duration-200 lg:flex lg:flex-col ${collapsed ? "w-[76px]" : "w-[248px]"}`}>
      <Brand collapsed={collapsed} />
      <div className="flex flex-1 flex-col px-3">
        {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Patient portal</p>}
        <nav className="flex flex-col gap-1">{navigation.map(navItem)}</nav>
        <div className="my-5 border-t border-border" />
        {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Account</p>}
        <nav className="flex flex-col gap-1">{secondary.map(navItem)}</nav>
      </div>
      <div className={`m-3 rounded-2xl bg-secondary p-3 ${collapsed ? "flex justify-center p-2" : ""}`}><div className="flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">SJ</div>{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-bold">Sarah Johnson</p><p className="truncate text-[11px] text-muted-foreground">Patient account</p></div>}</div></div>
      <button onClick={() => setCollapsed(!collapsed)} className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen className="size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}</button>
    </aside>

    {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-border bg-card shadow-xl transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between"><Brand collapsed={false} /><button onClick={() => setMobileOpen(false)} className="mr-4 rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Close navigation"><X className="size-5" /></button></div>
      <nav className="flex flex-col gap-1 px-3">{navigation.map(navItem)}<div className="my-5 border-t border-border" />{secondary.map(navItem)}</nav>
    </aside>

    <div className={`min-w-0 transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]"}`}>
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-8">
        <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Patient portal</span><ChevronRight className="size-3" /><span className="font-semibold text-foreground">{active}</span></div></div>
        <div className="flex items-center gap-2 sm:gap-4"><GlobalSearch role="patient" onNavigate={setActive} /><button onClick={() => setActive("Notifications")} className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-secondary" aria-label="Notifications"><Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-background bg-primary" /></button><button className="hidden rounded-xl p-2.5 text-muted-foreground hover:bg-secondary sm:block" aria-label="Help"><CircleHelp className="size-[18px]" /></button><div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-secondary" aria-expanded={profileOpen}><div className="grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">SJ</div><ChevronDown className="hidden size-4 text-muted-foreground sm:block" /></button>{profileOpen && <div className="absolute right-0 top-12 w-44 rounded-xl border border-border bg-card p-1.5 text-sm shadow-lg"><button onClick={() => { setActive("Profile"); setProfileOpen(false) }} className="w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary">My profile</button><button onClick={() => { setActive("Settings"); setProfileOpen(false) }} className="w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary">Settings</button><button className="w-full rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary">Sign out</button></div>}</div></div>
      </header>
      <main className="mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10"><div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">{active === "Dashboard" ? "Monday, September 21, 2026" : "Patient portal"}</p><h1 className="text-2xl font-black tracking-tight sm:text-3xl">{active === "Dashboard" ? "Good morning, Sarah" : active}</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">{active === "Dashboard" ? "Here’s what’s happening with your health today." : `Manage your ${active.toLowerCase()} in one secure place.`}</p></div>{active === "Dashboard" ? <PatientDashboard /> : active === "Find Doctors" ? <FindDoctors onOpenProfile={() => setActive("Doctor Profile")} /> : active === "Doctor Profile" ? <DoctorProfile onBack={() => setActive("Find Doctors")} onBook={() => setActive("Book Appointment")} /> : active === "Book Appointment" ? <BookingFlow onBack={() => setActive("Doctor Profile")} onDashboard={() => setActive("Dashboard")} /> : active === "Appointments" ? <PatientAppointments /> : active === "Prescriptions" || active === "Medical Records" ? <PatientRecords /> : active === "Profile" ? <PatientProfileSettings mode="profile" /> : active === "Settings" ? <PatientProfileSettings mode="settings" /> : active === "Notifications" ? <NotificationCenter role="patient" /> : <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><UsersRound className="mx-auto size-8 text-primary/60" /><h2 className="mt-4 font-bold">{active} workspace</h2><p className="mt-2 text-sm text-muted-foreground">This shared portal shell is ready for the {active.toLowerCase()} workflow.</p></div>}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">{[navigation[0], navigation[1], navigation[3], navigation[4], navigation[5]].map((item) => { const Icon = item.icon; const selected = active === item.label; return <button key={item.label} onClick={() => setActive(item.label)} className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${selected ? "text-primary" : "text-muted-foreground"}`}><Icon className="size-[18px]" /><span>{item.label === "Find Doctors" ? "Doctors" : item.label === "Book Appointment" ? "Book" : item.label}</span></button> })}</nav>
    </div>
  </div>
}

function DashboardContent() { return <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Your health at a glance</h2><p className="mt-1 text-xs text-muted-foreground">Keep track of what matters most.</p></div><button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="More health options"><ChevronDown className="size-4" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric label="Upcoming visits" value="2" icon={CalendarDays} tone="bg-[#edf3ff] text-primary" /><Metric label="Active prescriptions" value="4" icon={Pill} tone="bg-[#e9f8f3] text-[#2b9d7e]" /><Metric label="Health records" value="12" icon={FileText} tone="bg-[#fff3e7] text-[#d68b42]" /></div></section><section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Next appointment</p><h2 className="mt-2 font-bold">Dr. Michael Chen</h2><p className="mt-1 text-xs text-muted-foreground">Cardiology · Video visit</p></div><div className="grid size-11 place-items-center rounded-full bg-[#e9f8f3] text-[#2b9d7e]"><CalendarDays className="size-5" /></div></div><div className="mt-5 flex items-center gap-3 rounded-xl bg-secondary p-3"><div className="grid size-10 place-items-center rounded-lg bg-card text-xs font-black text-primary">24<br /><span className="text-[8px]">SEP</span></div><div><p className="text-sm font-bold">Thursday, 10:30 AM</p><p className="text-xs text-muted-foreground">In 3 days</p></div></div><button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90">View appointment</button></section><section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-bold">Recent activity</h2><p className="mt-1 text-xs text-muted-foreground">Your latest care updates.</p></div><button className="text-xs font-bold text-primary hover:underline">View all</button></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Activity icon={FileText} title="Lab results available" detail="Blood panel · Today" /><Activity icon={Pill} title="Prescription renewed" detail="Atorvastatin · Yesterday" /><Activity icon={Stethoscope} title="Visit summary added" detail="Dr. Chen · Sep 12" /></div></section></div> }
function Metric({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof CalendarDays; tone: string }) { return <div className="flex items-center gap-3 rounded-xl border border-border p-4"><div className={`grid size-10 place-items-center rounded-lg ${tone}`}><Icon className="size-5" /></div><div><p className="text-xl font-black">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div></div> }
function Activity({ icon: Icon, title, detail }: { icon: typeof FileText; title: string; detail: string }) { return <div className="flex items-center gap-3 rounded-xl border border-border p-4"><div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></div><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div></div> }
