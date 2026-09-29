"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Clock3, FileText, Search, Stethoscope, UsersRound, X } from "lucide-react"

type Role = "patient" | "doctor" | "staff" | "admin"
type Result = { title: string; detail: string; category: string; icon: typeof UsersRound; destination: string }

const roleResults: Record<Role, Result[]> = {
  patient: [
    { title: "Dr. Michael Chen", detail: "Cardiology · Video visits available", category: "Doctors", icon: Stethoscope, destination: "Find Doctors" },
    { title: "Appointment with Dr. Chen", detail: "Thursday, Sep 24 · 10:30 AM", category: "Appointments", icon: CalendarDays, destination: "Appointments" },
    { title: "Atorvastatin 20mg", detail: "Active prescription · Refill due Oct 12", category: "Prescriptions", icon: FileText, destination: "Prescriptions" },
    { title: "Blood panel results", detail: "Added Sep 18, 2026", category: "Medical records", icon: FileText, destination: "Medical Records" },
  ],
  doctor: [
    { title: "Sarah Johnson", detail: "PAT-10482 · Cardiology follow-up", category: "Patients", icon: UsersRound, destination: "Patients" },
    { title: "Today’s appointment queue", detail: "12 appointments · 3 waiting", category: "Appointments", icon: CalendarDays, destination: "Appointments" },
    { title: "Prescription history", detail: "Recent medications and issued prescriptions", category: "Prescriptions", icon: FileText, destination: "Prescriptions" },
  ],
  staff: [
    { title: "Sarah Johnson", detail: "PAT-10482 · Checked in today", category: "Patients", icon: UsersRound, destination: "Patients" },
    { title: "Dr. Michael Anderson", detail: "Cardiology · Room 204", category: "Doctors", icon: Stethoscope, destination: "Doctors" },
    { title: "APT-2026-004821", detail: "Today · 10:30 AM · Paid", category: "Appointments", icon: CalendarDays, destination: "Appointments" },
    { title: "Payment #PAY-88421", detail: "$120.00 · Paid today", category: "Payments", icon: FileText, destination: "Billing" },
  ],
  admin: [
    { title: "Sarah Johnson", detail: "Patient · Active · PAT-10482", category: "Users", icon: UsersRound, destination: "Users" },
    { title: "Dr. Michael Anderson", detail: "Cardiologist · Approved", category: "Doctors", icon: Stethoscope, destination: "Doctors" },
    { title: "September appointment volume", detail: "328 appointments today", category: "Appointments", icon: CalendarDays, destination: "Appointments" },
    { title: "MediBook Central Clinic", detail: "12 departments · Active", category: "Clinics", icon: FileText, destination: "Clinics" },
    { title: "Cardiology", detail: "24 doctors · 1,284 appointments", category: "Departments", icon: FileText, destination: "Departments" },
  ],
}

export function GlobalSearch({ role, onNavigate }: { role: Role; onNavigate: (destination: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState(["Sarah Johnson", "Dr. Michael Anderson"])
  const results = useMemo(() => roleResults[role].filter((item) => `${item.title} ${item.detail} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [role, query])
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true) } if (event.key === "Escape") setOpen(false) }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler) }, [])
  const select = (result: Result) => { setRecent((items) => [result.title, ...items.filter((item) => item !== result.title)].slice(0, 3)); setOpen(false); setQuery(""); onNavigate(result.destination) }
  return <>
    <button onClick={() => setOpen(true)} className="relative hidden h-10 w-[250px] items-center gap-2 rounded-xl border border-border bg-card px-3 text-left text-xs text-muted-foreground md:flex lg:w-[285px]" aria-label="Open global search"><Search className="size-4" /><span className="flex-1">Search anything...</span><kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px]">⌘K</kbd></button>
    {open && <div className="fixed inset-0 z-[80] bg-foreground/35 p-4 sm:p-8" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="mx-auto mt-[5vh] max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" role="dialog" aria-modal="true" aria-label="Global search"><div className="flex items-center gap-3 border-b border-border px-4"><Search className="size-5 text-primary" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${role === "patient" ? "doctors, appointments, records..." : "patients, appointments, payments..."}`} className="h-14 flex-1 bg-transparent text-sm outline-none" /><kbd className="hidden rounded border border-border px-2 py-1 text-[10px] text-muted-foreground sm:block">ESC</kbd><button onClick={() => setOpen(false)} aria-label="Close search" className="rounded-lg p-2 hover:bg-secondary"><X className="size-4" /></button></div><div className="max-h-[65vh] overflow-y-auto p-3">{!query && <div className="mb-4"><p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent searches</p>{recent.map((item) => <button key={item} onClick={() => setQuery(item)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"><Clock3 className="size-4 text-muted-foreground" />{item}</button>)}</div>}{query && results.length === 0 ? <div className="py-12 text-center"><Search className="mx-auto size-8 text-muted-foreground/50" /><p className="mt-3 font-bold">No results found</p><p className="mt-1 text-xs text-muted-foreground">Try a patient name, appointment ID, or category.</p></div> : <div className="space-y-4">{Array.from(new Set(results.map((item) => item.category))).map((category) => <section key={category}><p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{category}</p>{results.filter((item) => item.category === category).map((result) => { const Icon = result.icon; return <button key={result.title} onClick={() => select(result)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-secondary"><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></div><div className="min-w-0"><p className="truncate text-sm font-bold">{result.title}</p><p className="truncate text-xs text-muted-foreground">{result.detail}</p></div></button> })}</section>)}</div>}{!query && <p className="border-t border-border px-2 pt-3 text-[11px] text-muted-foreground">Search is scoped to your {role} portal. Press <kbd className="rounded border border-border px-1">⌘K</kbd> anytime to open.</p>}</div></div></div>}
  </>
}
