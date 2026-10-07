'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  MoreHorizontal,
  Phone,
  Search,
  X,
} from 'lucide-react';

const rows = [
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    time: '07:20 PM',
    symptoms: 'Chest discomfort and shortness of breath.',
    status: 'Confirmed',
    payment: 'Paid',
  },
  {
    name: 'Robert Chen',
    initials: 'RC',
    time: '08:00 PM',
    symptoms: 'Follow-up for hypertension.',
    status: 'Confirmed',
    payment: 'Pending',
  },
  {
    name: 'Emily Davis',
    initials: 'ED',
    time: '08:40 PM',
    symptoms: 'Recurring migraine episodes.',
    status: 'Checked in',
    payment: 'Paid',
  },
];

export function DoctorAppointments({ onConsult }: { onConsult?: () => void }) {
  const [tab, setTab] = useState('Today');
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState<'cancel' | 'reschedule' | null>(null);
  const [notice, setNotice] = useState('');
  return (
    <div className="mt-8 space-y-5">
      {notice && (
        <div
          role="status"
          className="border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          <Check className="size-4" />
          {notice}
        </div>
      )}
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black">Appointment management</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Review your patient schedule and care actions.
            </p>
          </div>
          <button className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold">
            <CalendarDays className="size-4" />
            Set availability
          </button>
        </div>
        <div className="border-border mt-5 flex flex-wrap gap-2 border-b pb-3">
          {['Today', 'Upcoming', 'Completed', 'Cancelled', 'No-show'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              placeholder="Search patient or symptom"
              className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none sm:w-72"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            <span className="text-primary font-bold">{tab === 'Today' ? 12 : 8}</span> appointments
          </p>
        </div>
      </section>
      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-border bg-secondary/60 text-muted-foreground border-b text-[10px] tracking-wider uppercase">
              <tr>
                {['Patient', 'Appointment time', 'Symptoms', 'Status', 'Payment', 'Actions'].map(
                  (head) => (
                    <th key={head} className="px-5 py-4 font-bold">
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-border border-b last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{row.name}</p>
                        <p className="text-muted-foreground text-[11px]">Cardiology patient</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold">Sep 18, 2026</p>
                    <p className="text-primary text-xs">{row.time}</p>
                  </td>
                  <td className="text-muted-foreground max-w-[220px] px-5 py-4 text-xs">
                    {row.symptoms}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#e9f8f3] px-2.5 py-1 text-[10px] font-bold text-[#258c70]">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold">{row.payment}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDrawer(true)}
                        className="border-border hover:bg-secondary rounded-lg border px-2.5 py-1.5 text-[10px] font-bold"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          onConsult
                            ? onConsult()
                            : setNotice(`Consultation started for ${row.name}.`)
                        }
                        className="bg-primary text-primary-foreground rounded-lg px-2.5 py-1.5 text-[10px] font-bold"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => setDialog('reschedule')}
                        aria-label={`More actions for ${row.name}`}
                        className="hover:bg-secondary rounded-lg p-1.5"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {rows.map((row) => (
            <article key={row.name} className="border-border rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                    {row.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{row.name}</p>
                    <p className="text-primary text-xs">{row.time}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#e9f8f3] px-2 py-1 text-[10px] font-bold text-[#258c70]">
                  {row.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">{row.symptoms}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setDrawer(true)}
                  className="border-border flex-1 rounded-lg border py-2 text-xs font-bold"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    onConsult ? onConsult() : setNotice(`Consultation started for ${row.name}.`)
                  }
                  className="bg-primary text-primary-foreground flex-1 rounded-lg py-2 text-xs font-bold"
                >
                  Start consultation
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {drawer && (
        <DetailDrawer
          onClose={() => setDrawer(false)}
          onReschedule={() => {
            setDrawer(false);
            setDialog('reschedule');
          }}
          onCancel={() => {
            setDrawer(false);
            setDialog('cancel');
          }}
        />
      )}
      {dialog === 'cancel' && (
        <CancelDialog
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            setNotice('Appointment cancelled. Sarah will receive a notification.');
          }}
        />
      )}
      {dialog === 'reschedule' && (
        <RescheduleDialog
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            setNotice('Appointment rescheduled. Sarah will receive a notification.');
          }}
        />
      )}
    </div>
  );
}

function DetailDrawer({
  onClose,
  onReschedule,
  onCancel,
}: {
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-foreground/25 fixed inset-0 z-50">
      <aside className="border-border bg-card absolute top-0 right-0 h-full w-full max-w-xl overflow-y-auto border-l p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Appointment detail
            </p>
            <h2 className="mt-1 text-2xl font-black">Sarah Johnson</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="bg-secondary mt-6 rounded-2xl p-4">
          <p className="text-primary text-xs font-bold">Appointment</p>
          <p className="mt-2 text-lg font-black">Sep 18, 2026 · 07:20 PM</p>
          <p className="text-muted-foreground mt-1 text-sm">In-person · Cardiology clinic</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Info label="DOB" value="May 14, 1988" />
          <Info label="Blood group" value="O+" />
          <Info label="History" value="Hypertension" />
        </div>
        <div className="mt-6">
          <p className="text-sm font-bold">Symptoms</p>
          <p className="border-border text-muted-foreground mt-2 rounded-xl border p-4 text-sm">
            Chest discomfort and shortness of breath.
          </p>
        </div>
        <div className="mt-6">
          <p className="text-sm font-bold">Appointment timeline</p>
          <div className="border-primary/20 mt-3 grid gap-3 border-l-2 pl-4 text-xs">
            <p>
              <b>06:45 PM</b> · Patient checked in
            </p>
            <p>
              <b>07:00 PM</b> · Payment verified
            </p>
            <p>
              <b>07:20 PM</b> · Appointment starts
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Payment status" value="Paid · ₹800" />
          <Info label="Prescription" value="Not issued" />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setTimeout(() => {}, 0)}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            Mark completed
          </button>
          <button
            onClick={onReschedule}
            className="border-border rounded-xl border px-4 py-2.5 text-xs font-bold"
          >
            Reschedule
          </button>
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#f0ccc5] px-4 py-2.5 text-xs font-bold text-[#bd7165]"
          >
            Cancel
          </button>
        </div>
      </aside>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
function CancelDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Dialog title="Cancel appointment" onClose={onClose}>
      <p className="text-muted-foreground text-sm">
        Are you sure you want to cancel Sarah Johnson&apos;s appointment? The patient will receive a
        notification.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="border-border rounded-xl border px-4 py-2 text-xs font-bold"
        >
          Keep appointment
        </button>
        <button
          onClick={onConfirm}
          className="rounded-xl bg-[#bd7165] px-4 py-2 text-xs font-bold text-white"
        >
          Confirm cancellation
        </button>
      </div>
    </Dialog>
  );
}
function RescheduleDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Dialog title="Reschedule appointment" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-bold">
          Select date
          <input
            type="date"
            defaultValue="2026-09-19"
            className="border-border bg-background h-10 rounded-xl border px-3"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold">
          Available slot
          <select className="border-border bg-background h-10 rounded-xl border px-3">
            <option>08:00 PM</option>
            <option>08:40 PM</option>
          </select>
        </label>
      </div>
      <div className="bg-secondary mt-4 rounded-xl p-4 text-xs">
        <p className="font-bold">Previous appointment</p>
        <p className="text-muted-foreground mt-1">Sep 18, 2026 · 07:20 PM</p>
        <p className="mt-3 font-bold">New appointment</p>
        <p className="text-primary mt-1">Sep 19, 2026 · 08:00 PM</p>
      </div>
      <p className="text-muted-foreground mt-4 text-xs">
        Sarah Johnson will receive a notification when the appointment changes.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="border-border rounded-xl border px-4 py-2 text-xs font-bold"
        >
          Keep current time
        </button>
        <button
          onClick={onConfirm}
          className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs font-bold"
        >
          Confirm change
        </button>
      </div>
    </Dialog>
  );
}
function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
