'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { RescheduleDialogProps } from './types';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Convert appointment date to YYYY-MM-DD format for date input
function toDateInputValue(dateStr: string) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

export function RescheduleDialog({
  isOpen,
  onClose,
  onConfirm,
  onDateChange,
  appointment,
  availableSlots,
  isLoading = false,
  className,
}: RescheduleDialogProps) {
  if (!isOpen || !appointment) return null;

  const [selectedSlotId, setSelectedSlotId] = useState(availableSlots[0]?.id || '');
  const [selectedSlotTime, setSelectedSlotTime] = useState(availableSlots[0]?.time || '');

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    onDateChange?.(date);
  };

  // Update selected slot when availableSlots change
  const selectedSlot = availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <div
      className={cn('bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-5', className)}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
    >
      <div
        className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="reschedule-title" className="text-lg font-black">
            Reschedule appointment
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-bold">
            Select date
            <input
              type="date"
              defaultValue={toDateInputValue(appointment.date)}
              className="border-border bg-background h-10 rounded-xl border px-3"
              onChange={handleDateChange}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Available slot
            <select
              className="border-border bg-background h-10 rounded-xl border px-3"
              value={selectedSlotId}
              onChange={(e) => {
                const slotId = e.target.value;
                setSelectedSlotId(slotId);
                const slot = availableSlots.find((s) => s.id === slotId);
                if (slot) setSelectedSlotTime(slot.time);
              }}
              disabled={availableSlots.length === 0 || isLoading}
            >
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="bg-secondary mt-4 rounded-xl p-4 text-xs">
          <p className="font-bold">Previous appointment</p>
          <p className="text-muted-foreground mt-1">
            {formatDate(appointment.date)} &middot; {formatTime(appointment.time)}
          </p>
          <p className="mt-3 font-bold">New appointment</p>
          <p className="text-primary mt-1">
            {formatDate(appointment.date)} &middot; {selectedSlot?.time || 'TBD'}
          </p>
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          {appointment.patient} will receive a notification when the appointment changes.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border-border rounded-xl border px-4 py-2 text-xs font-bold"
          >
            Keep current time
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedSlotId, selectedSlotTime)}
            disabled={isLoading || availableSlots.length === 0}
            className={cn(
              'bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs font-bold',
              isLoading && 'cursor-wait opacity-70',
              availableSlots.length === 0 && 'cursor-not-allowed opacity-50'
            )}
          >
            {isLoading ? 'Rescheduling...' : 'Confirm change'}
          </button>
        </div>
      </div>
    </div>
  );
}
