'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';

const slots = [
  { time: '7:00 PM', patient: 'Available', state: 'AVAILABLE' },
  { time: '7:20 PM', patient: 'Sarah Johnson', state: 'BOOKED' },
  { time: '7:40 PM', patient: 'Available', state: 'AVAILABLE' },
  { time: '8:00 PM', patient: 'Robert Chen', state: 'BOOKED' },
  { time: '8:20 PM', patient: 'Cancelled by patient', state: 'CANCELLED' },
  { time: '8:40 PM', patient: 'Available', state: 'AVAILABLE' },
];

export function DoctorSchedule() {
  const [view, setView] = useState('Week');
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);
  const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];
  const toggle = (time: string) =>
    setSelected((current) =>
      current.includes(time) ? current.filter((item) => item !== time) : [...current, time]
    );
  const summary = useMemo(
    () => `${selected.length} slot${selected.length === 1 ? '' : 's'} selected`,
    [selected]
  );
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
            <div className="flex items-center gap-2">
              <button className="hover:bg-secondary rounded-lg p-2" aria-label="Previous period">
                <ChevronLeft className="size-4" />
              </button>
              <h2 className="text-lg font-black">September 21 – 27, 2026</h2>
              <button className="hover:bg-secondary rounded-lg p-2" aria-label="Next period">
                <ChevronRight className="size-4" />
              </button>
            </div>
            <p className="text-muted-foreground mt-1 pl-10 text-xs">
              Manage availability, bookings, and blocked time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-secondary flex rounded-xl p-1">
              {['Day', 'Week', 'Month'].map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${view === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDialog(true)}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm hover:opacity-90"
            >
              <Plus className="size-4" />
              Generate slots
            </button>
          </div>
        </div>
        <div className="border-border text-muted-foreground mt-6 flex flex-wrap items-center gap-4 border-t pt-4 text-[11px] font-bold">
          <span className="flex items-center gap-2">
            <i className="size-2.5 rounded-full bg-[#69b899]" />
            Available
          </span>
          <span className="flex items-center gap-2">
            <i className="bg-primary size-2.5 rounded-full" />
            Booked
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2.5 rounded-full bg-[#e49b8e]" />
            Cancelled
          </span>
          <span className="ml-auto flex items-center gap-2">
            <Clock3 className="size-3.5" />
            Timezone: Asia/Kolkata
          </span>
        </div>
      </section>
      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border grid min-w-[900px] grid-cols-[76px_repeat(7,1fr)] border-b">
          <div className="text-muted-foreground p-3 text-[10px] font-bold uppercase">Time</div>
          {days.map((day, index) => (
            <div
              key={day}
              className={`border-border border-l p-3 text-center ${index === 0 ? 'bg-primary/5' : ''}`}
            >
              <p className="text-muted-foreground text-[10px] font-bold uppercase">
                {day.split(' ')[0]}
              </p>
              <p className={`mt-1 text-sm font-black ${index === 0 ? 'text-primary' : ''}`}>
                {day.split(' ')[1]}
              </p>
            </div>
          ))}
        </div>
        <div className="min-w-[900px]">
          {slots.map((slot) => (
            <div
              key={slot.time}
              className="border-border/70 grid grid-cols-[76px_repeat(7,1fr)] border-b last:border-0"
            >
              <div className="text-muted-foreground flex items-start justify-center pt-4 text-[10px] font-bold">
                {slot.time}
              </div>
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`border-border min-h-[78px] border-l p-2 ${index === 0 ? 'bg-primary/[0.025]' : ''}`}
                >
                  <button
                    onClick={() => toggle(`${day}-${slot.time}`)}
                    className={`group relative flex h-full w-full flex-col justify-between rounded-xl border p-2 text-left transition ${slot.state === 'BOOKED' ? 'border-primary/20 bg-primary/10' : slot.state === 'CANCELLED' ? 'border-[#f0ccc5] bg-[#fff7f5]' : selected.includes(`${day}-${slot.time}`) ? 'border-primary bg-primary/10 ring-primary/20 ring-2' : 'hover:border-primary border-dashed border-[#a8d8c9] bg-[#f3fbf8]'}`}
                  >
                    <span
                      className={`text-[9px] font-black tracking-wide ${slot.state === 'BOOKED' ? 'text-primary' : slot.state === 'CANCELLED' ? 'text-[#c2796d]' : 'text-[#338a70]'}`}
                    >
                      {slot.state}
                    </span>
                    <span className="truncate text-[10px] font-bold">{slot.patient}</span>
                    {slot.state === 'BOOKED' && (
                      <span className="text-muted-foreground text-[9px]">Consultation</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold">Bulk actions</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {summary}. Select available slots to edit or remove them.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled={!selected.length}
            onClick={() => {
              setNotice(`${selected.length} slots deleted.`);
              setSelected([]);
            }}
            className="flex items-center gap-2 rounded-xl border border-[#f0ccc5] px-3 py-2 text-xs font-bold text-[#bd7165] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
          <button
            onClick={() => {
              setBlocked(!blocked);
              setNotice(blocked ? 'Blocked time removed.' : 'Time blocked for selected period.');
            }}
            className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"
          >
            <ShieldAlert className="text-primary size-4" />
            {blocked ? 'Unblock time' : 'Block time'}
          </button>
        </div>
      </div>
      {blocked && (
        <div className="flex items-center gap-3 rounded-xl border border-[#ead9aa] bg-[#fffaf0] px-4 py-3 text-xs font-semibold text-[#9d7830]">
          <ShieldAlert className="size-4" />
          Blocked time: Wednesday, September 23 · 7:00 PM – 9:00 PM
        </div>
      )}
      {dialog && (
        <GenerateSlotsDialog
          onClose={() => setDialog(false)}
          onGenerate={() => {
            setDialog(false);
            setNotice('12 slots generated successfully. Preview is ready for review.');
          }}
        />
      )}
    </div>
  );
}

function GenerateSlotsDialog({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: () => void;
}) {
  const [preview, setPreview] = useState(false);
  const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const toggleDay = (day: string) =>
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  return (
    <div className="bg-foreground/30 fixed inset-0 z-50 grid place-items-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-slots-title"
        className="border-border bg-card max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Schedule automation
            </p>
            <h2 id="generate-slots-title" className="mt-1 text-xl font-black">
              Generate slots
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Create recurring availability with conflict protection.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Start date" value="Sep 20, 2026" type="date" />
          <Field label="End date" value="Oct 20, 2026" type="date" />
          <Field label="Start time" value="07:00 PM" type="time" />
          <Field label="End time" value="09:00 PM" type="time" />
          <Field label="Appointment duration" value="20 minutes" />
          <Field label="Break duration" value="5 minutes" />
          <Field label="Slot interval" value="20 minutes" />
        </div>
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold">Days of week</p>
          <div className="flex flex-wrap gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${days.includes(day) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#ead9aa] bg-[#fffaf0] p-3 text-xs text-[#92702b]">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Existing appointment warning:</strong> 2 slots overlap with confirmed
            appointments. They will remain booked and cannot be overwritten.
          </span>
        </div>
        {preview && (
          <div className="border-primary/20 bg-primary/5 mt-5 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Preview · 12 generated slots</p>
              <button onClick={() => setPreview(false)} className="text-primary text-xs font-bold">
                Edit
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {['Sep 21 · 7:00 PM', 'Sep 21 · 7:20 PM', 'Sep 22 · 7:00 PM', 'Sep 22 · 7:20 PM'].map(
                (item) => (
                  <div key={item} className="bg-card rounded-lg p-2 font-semibold">
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border-border hover:bg-secondary rounded-xl border px-4 py-2.5 text-xs font-bold"
          >
            Cancel
          </button>
          {preview ? (
            <button
              onClick={onGenerate}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              Confirm & generate
            </button>
          ) : (
            <button
              onClick={() => setPreview(true)}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              Preview slots
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, type = 'text' }: { label: string; value: string; type?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold">{label}</span>
      <input
        type={type}
        defaultValue={
          type === 'date' ? (value.includes('Sep') ? '2026-09-20' : '2026-10-20') : undefined
        }
        placeholder={type === 'date' || type === 'time' ? undefined : value}
        className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
      />
    </label>
  );
}
function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl p-3 ${tone}`}>
      <p className="text-[10px] font-bold tracking-wide uppercase opacity-70">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
function ScheduleIcon({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}
