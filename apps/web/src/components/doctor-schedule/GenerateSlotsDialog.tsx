'use client';

import { useState, useRef } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface GenerateSlotsDialogProps {
  onClose: () => void;
  onGenerate: (data: BulkSlotCreateInput) => void;
}

interface BulkSlotCreateInput {
  doctorId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  slotDuration: number; // minutes
  daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
}

const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function GenerateSlotsDialog({ onClose, onGenerate }: GenerateSlotsDialogProps) {
  const [preview, setPreview] = useState(false);
  const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const slotDurationRef = useRef<HTMLInputElement>(null);
  const breakDurationRef = useRef<HTMLInputElement>(null);
  const slotIntervalRef = useRef<HTMLInputElement>(null);

  const toggleDay = (day: string) =>
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );

  const collectFormData = (): BulkSlotCreateInput | null => {
    const startDate = startDateRef.current?.value;
    const endDate = endDateRef.current?.value;
    const startTime = startTimeRef.current?.value;
    const endTime = endTimeRef.current?.value;
    const slotDuration = parseInt(slotDurationRef.current?.value || '20', 10);
    // breakDuration is read but not used; slotInterval encompasses both appointment + break
    parseInt(breakDurationRef.current?.value || '5', 10);
    const slotInterval = parseInt(slotIntervalRef.current?.value || '20', 10);

    if (!startDate || !endDate || !startTime || !endTime) {
      setError('Please fill in all required fields');
      return null;
    }

    // Validate start time is before end time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      setError('End time must be after start time');
      return null;
    }

    if (days.length === 0) {
      setError('Please select at least one day of the week');
      return null;
    }

    if (slotDuration <= 0 || slotInterval <= 0) {
      setError('Duration and interval must be positive numbers');
      return null;
    }

    if (slotInterval < slotDuration) {
      setError('Slot interval must be at least the appointment duration');
      return null;
    }

    // Use slotInterval as the actual slot duration (appointment duration + break)
    const effectiveSlotDuration = slotInterval;

    return {
      doctorId: '', // Will be filled by parent component
      startDate,
      endDate,
      startTime,
      endTime,
      slotDuration: effectiveSlotDuration,
      daysOfWeek: days.map((day) => DAY_MAP[day]).filter((d) => d !== undefined),
    };
  };

  const handlePreview = () => {
    setError(null);
    const data = collectFormData();
    if (data) {
      setPreview(true);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    const data = collectFormData();
    if (!data) return;

    setIsGenerating(true);
    try {
      await onGenerate(data);
      setPreview(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate slots');
    } finally {
      setIsGenerating(false);
    }
  };

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
            disabled={isGenerating}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Start date</span>
            <input
              ref={startDateRef}
              type="date"
              defaultValue="2026-09-20"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">End date</span>
            <input
              ref={endDateRef}
              type="date"
              defaultValue="2026-10-20"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Start time</span>
            <input
              ref={startTimeRef}
              type="time"
              defaultValue="19:00"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">End time</span>
            <input
              ref={endTimeRef}
              type="time"
              defaultValue="21:00"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Appointment duration</span>
            <input
              ref={slotDurationRef}
              type="number"
              min="5"
              max="120"
              defaultValue={20}
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Break duration</span>
            <input
              ref={breakDurationRef}
              type="number"
              min="0"
              max="60"
              defaultValue={5}
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Slot interval</span>
            <input
              ref={slotIntervalRef}
              type="number"
              min="5"
              max="120"
              defaultValue={20}
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
        {error && (
          <div className="border-destructive bg-destructive/10 text-destructive mt-4 rounded-xl border p-3 text-xs">
            {error}
          </div>
        )}
        {preview && (
          <div className="border-primary/20 bg-primary/5 mt-5 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Preview · Generated slots</p>
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
            disabled={isGenerating}
          >
            Cancel
          </button>
          {preview ? (
            <button
              onClick={handleGenerate}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Confirm & generate'}
            </button>
          ) : (
            <button
              onClick={handlePreview}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
              disabled={isGenerating}
            >
              Preview slots
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
