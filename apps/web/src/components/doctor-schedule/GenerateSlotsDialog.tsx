'use client';

import { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface GenerateSlotsDialogProps {
  onClose: () => void;
  onGenerate: () => void;
}

export function GenerateSlotsDialog({ onClose, onGenerate }: GenerateSlotsDialogProps) {
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
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Start date</span>
            <input
              type="date"
              defaultValue="2026-09-20"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">End date</span>
            <input
              type="date"
              defaultValue="2026-10-20"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Start time</span>
            <input
              type="time"
              defaultValue="19:00"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">End time</span>
            <input
              type="time"
              defaultValue="21:00"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Appointment duration</span>
            <input
              type="text"
              placeholder="20 minutes"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Break duration</span>
            <input
              type="text"
              placeholder="5 minutes"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Slot interval</span>
            <input
              type="text"
              placeholder="20 minutes"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
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
