"use client"

import { useMemo, useState, type ReactNode } from "react"
import { CalendarDays, CheckCircle2, Clock3, Eye, Filter, MoreHorizontal, Search, UserRound, XCircle } from "lucide-react"

const appointments = [
  { id: "APT-004932", time: "09:00 AM", patient: "Sarah Johnson", age: "34", doctor: "Dr. Emily Carter", specialty: "General Medicine", type: "Follow-up", status: "Confirmed", payment: "Paid" },
  { id: "APT-004933", time: "09:30 AM", patient: "Michael Chen", age: "42", doctor: "Dr. James Wilson", specialty: "Cardiology", type: "Consultation", status: "Checked in", payment: "Paid" },
  { id: "APT-004934", time: "10:00 AM", patient: "Priya Sharma", age: "29", doctor: "Dr. Emily Carter", specialty: "General Medicine", type: "New patient", status: "Waiting", payment: "Pending" },
  { id: "APT-004935", time: "10:30 AM", patient: "Robert Williams", age: "57", doctor: "Dr. Olivia Brown", specialty: "Orthopedics", type: "Follow-up", status: "Confirmed", payment: "Paid" },
  { id: "APT-004936", time: "11:00 AM", patient: "Linda Davis", age: "46", doctor: "Dr. James Wilson", specialty: "Cardiology", type: "Consultation", status: "Cancelled", payment: "Refunded" },
  { id: "APT-004937", time: "11:30 AM", patient: "David Miller", age: "51", doctor: "Dr. Olivia Brown", specialty: "Orthopedics", type: "Follow-up", status: "Confirmed", payment: "Pending" },
]

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = { green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-rose-50 text-rose-700", blue: "bg-blue-50 text-blue-700", slate: "bg-slate-100 text-slate-600" }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone] ?? tones.slate}`}>{children}</span>
}

export function StaffAppointments() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All statuses")
  const [notice, setNotice] = useState("")
  const filtered = useMemo(() => appointments.filter((item) => `${item.patient} ${item.doctor} ${item.id} ${item.specialty}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || item.status === status)), [query, status])
  const action = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2400) }
  return <section className="mt-8 space-y-5" aria-label="Appointment management">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[ ["Today", "24", CalendarDays, "blue"], ["Confirmed", "16", CheckCircle2, "green"], ["Waiting", "4", Clock3, "amber"], ["Cancelled", "2", XCircle, "red"] ].map(([label, value, Icon, tone]) => <div key={label as string} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><span className={`rounded-xl p-2 ${tone === "green" ? "bg-emerald-50 text-emerald-600" : tone === "amber" ? "bg-amber-50 text-amber-600" : tone === "red" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}><Icon className="size-4" /></span></div><p className="mt-3 text-2xl font-black tracking-tight">{value}</p></div>)}
    </div>
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-bold">Today&apos;s appointments</h2><p className="mt-1 text-sm text-muted-foreground">Monday, September 21, 2026 · 24 scheduled appointments</p></div><button onClick={() => action("Booking workspace opened")} className="mobile-touch-target rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Book appointment</button></div>
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search appointments" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient, doctor, appointment ID..." className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><select aria-label="Filter appointment status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm"><option>All statuses</option><option>Confirmed</option><option>Checked in</option><option>Waiting</option><option>Cancelled</option></select><button className="mobile-touch-target rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground"><Filter className="mr-2 inline size-4" />More filters</button></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Time</th><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Doctor</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.id} className="hover:bg-muted/20"><td className="whitespace-nowrap px-5 py-4 font-bold">{item.time}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2 text-primary"><UserRound className="size-4" /></span><div><p className="font-bold">{item.patient}</p><p className="text-xs text-muted-foreground">{item.age} years · {item.id}</p></div></div></td><td className="px-5 py-4"><p className="font-medium">{item.doctor}</p><p className="text-xs text-muted-foreground">{item.specialty}</p></td><td className="px-5 py-4 text-muted-foreground">{item.type}</td><td className="px-5 py-4"><Badge tone={item.status === "Cancelled" ? "red" : item.status === "Waiting" ? "amber" : item.status === "Checked in" ? "blue" : "green"}>{item.status}</Badge></td><td className="px-5 py-4"><Badge tone={item.payment === "Paid" ? "green" : item.payment === "Refunded" ? "red" : "amber"}>{item.payment}</Badge></td><td className="px-5 py-4 text-right"><button onClick={() => action(`Viewing ${item.patient}'s appointment`)} aria-label={`View ${item.patient}`} className="mobile-touch-target rounded-lg p-2 text-muted-foreground hover:bg-muted"><Eye className="size-4" /></button><button onClick={() => action("Appointment actions opened")} aria-label={`More actions for ${item.patient}`} className="mobile-touch-target rounded-lg p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></button></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No appointments match these filters.</div>}
    </div>
    {notice && <div role="status" className="fixed bottom-24 right-5 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">{notice}</div>}
  </section>
}
