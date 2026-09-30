'use client';

import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, ShieldAlert } from 'lucide-react';

import { SlotCell } from './SlotCell';
import { ScheduleLegend } from './ScheduleLegend';
import { BulkActions } from './BulkActions';
import { GenerateSlotsDialog } from './GenerateSlotsDialog';

interface ScheduleGridProps {
  slots: Array<{
    time: string;
    patient: string;
    state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  }>;
  days: string[];
}

export function ScheduleGrid({ slots, days }: ScheduleGridProps) {
  const [view, setView] = useState('Week');
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);

  const toggle = (time: string) =>
    setSelected((current) =>
      current.includes(time) ? current.filter((item) => item !== time) : [...current, time]
    );

  const handleDeleteSlots = () => {
    setNotice(`${selected.length} slots deleted.`);
    setSelected([]);
  };

  const handleGenerateSlots = () => {
    setDialog(false);
    setNotice('12 slots generated successfully. Preview is ready for review.');
  };

  const handleToggleBlocked = () => {
    setBlocked(!blocked);
    setNotice(blocked ? 'Blocked time removed.' : 'Time blocked for selected period.');
  };

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
        <ScheduleLegend />
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
                <SlotCell
                  day={day}
                  slot={slot}
                  selected={selected}
                  onToggle={toggle}
                  index={index}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
      <BulkActions
        selected={selected}
        onDelete={handleDeleteSlots}
        onToggleBlocked={handleToggleBlocked}
        blocked={blocked}
      />
      {blocked && (
        <div className="flex items-center gap-3 rounded-xl border border-[#ead9aa] bg-[#fffaf0] px-4 py-3 text-xs font-semibold text-[#9d7830]">
          <ShieldAlert className="size-4" />
          Blocked time: Wednesday, September 23 · 7:00 PM – 9:00 PM
        </div>
      )}
      {dialog && (
        <GenerateSlotsDialog onClose={() => setDialog(false)} onGenerate={handleGenerateSlots} />
      )}
    </div>
  );
}
