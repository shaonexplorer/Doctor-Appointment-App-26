"use client"

import { useState } from "react"
import { Check, Camera, LockKeyhole, Save, ShieldCheck } from "lucide-react"

const inputClass = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"

export function PatientProfileSettings({ mode = "profile" }: { mode?: "profile" | "settings" }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState("sarah.johnson@example.com")
  const [phone, setPhone] = useState("+1 (415) 555-0198")
  const [reminders, setReminders] = useState(true)
  const [prescriptions, setPrescriptions] = useState(true)
  const [cancellations, setCancellations] = useState(true)

  const save = () => { setSaving(true); setSaved(false); window.setTimeout(() => { setSaving(false); setEditing(false); setSaved(true) }, 650) }
  const field = (label: string, value: string, onChange?: (value: string) => void, type = "text") => <label className="grid gap-2 text-xs font-bold text-foreground"><span>{label}</span><input disabled={!editing} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className={`${inputClass} disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground`} /></label>
  const toggle = (label: string, description: string, value: boolean, onChange: (value: boolean) => void) => <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"><div><p className="text-sm font-bold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><button type="button" onClick={() => editing && onChange(!value)} aria-pressed={value} className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? "bg-primary" : "bg-muted"}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${value ? "left-6" : "left-1"}`} /></button></div>

  return <div className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-lg font-black">{mode === "profile" ? "My profile" : "Settings"}</h2><p className="mt-1 text-xs text-muted-foreground">{mode === "profile" ? "Keep your personal and medical information up to date." : "Control your account, notifications, and privacy preferences."}</p></div><div className="flex gap-2">{saved && <span className="flex items-center gap-1 rounded-xl bg-[#e9f8f3] px-3 py-2 text-xs font-bold text-[#218765]"><Check className="size-4" /> Saved</span>}<button onClick={() => editing ? save() : setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-primary-foreground hover:opacity-90" disabled={saving}>{saving ? "Saving..." : editing ? <><Save className="size-4" /> Save changes</> : "Edit profile"}</button></div></div>
    {mode === "profile" ? <>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative grid size-20 shrink-0 place-items-center rounded-2xl bg-[#d9e8ff] text-xl font-black text-primary">SJ{editing && <button aria-label="Change avatar" className="absolute -bottom-2 -right-2 grid size-8 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground"><Camera className="size-4" /></button>}</div><div><h3 className="font-black">Sarah Johnson</h3><p className="mt-1 text-xs text-muted-foreground">Patient account · Member since January 2024</p><p className="mt-3 text-xs font-bold text-primary">{editing ? "Choose a clear photo for your care team" : "Your profile is visible to doctors you book with"}</p></div></div></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><h3 className="font-black">Personal information</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("Full name", "Sarah Johnson")}{field("Email", email, setEmail, "email")}{field("Phone", phone, setPhone, "tel")}{field("Date of birth", "June 14, 1992")}{field("Blood group", "O+")}{field("Emergency contact", "David Johnson · +1 (415) 555-0172")}</div><label className="mt-4 grid gap-2 text-xs font-bold">Medical history summary<textarea disabled={!editing} defaultValue="Seasonal allergies. No major surgeries or hospitalizations." className="min-h-24 rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary disabled:bg-secondary" /></label></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-black">Medical information</h3><p className="mt-1 text-xs text-muted-foreground">This information helps your care team prepare for visits.</p></div><ShieldCheck className="size-5 text-primary" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("Blood group", "O+")}{field("Allergies", "Penicillin, pollen")}{field("Existing conditions", "Seasonal allergies")}{field("Current medications", "Cetirizine 10 mg as needed")}{field("Emergency contact", "David Johnson · +1 (415) 555-0172")}</div></section>
    </> : <>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><h3 className="font-black">Account</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("Email", email, setEmail, "email")}{field("Phone", phone, setPhone, "tel")}<button className="flex h-11 items-center gap-2 rounded-xl border border-border px-3 text-left text-xs font-bold hover:bg-secondary"><LockKeyhole className="size-4 text-primary" /> Change password</button></div></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><h3 className="font-black">Notifications</h3><div className="mt-5 grid gap-3">{toggle("Appointment reminders", "Get notified before upcoming visits.", reminders, setReminders)}{toggle("Prescription notifications", "Know when a prescription is ready to view.", prescriptions, setPrescriptions)}{toggle("Cancellation notifications", "Stay informed about appointment changes.", cancellations, setCancellations)}{toggle("Email notifications", "Receive important updates by email.", true, () => {})}{toggle("SMS notifications", "Receive reminders and updates by text.", false, () => {})}</div></section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><h3 className="font-black">Privacy</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("Data visibility", "Doctors you book with")}{field("Session management", "2 active sessions")}</div><div className="mt-4 rounded-xl bg-secondary p-4 text-xs text-muted-foreground">MediBook uses encryption and role-based access to keep your health information protected.</div></section>
    </>}
  </div>
}

export default PatientProfileSettings
