'use client';

import { useState } from 'react';
import { Check, Plus, ShieldAlert } from 'lucide-react';
import { useCreateBulkSlots, useDeleteSlot } from '@/hooks/useSchedule';
import type { BulkSlotCreateInput } from '@/lib/api';

import { SlotCell } from './SlotCell';
import { ScheduleLegend } from './ScheduleLegend';
import { BulkActions } from './BulkActions';
import { GenerateSlotsDialog } from './GenerateSlotsDialog';

interface ScheduleGridProps {
  grid: Array<
    Array<{
      id: string;
      time: string;
      patient: string;
      state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
    }>
  >;
  days: string[];
  times: string[];
  doctorId: string;
  onSlotsGenerated?: () => void;
  view: 'Day' | 'Week' | 'Month';
  onViewChange?: (view: 'Day' | 'Week' | 'Month') => void;
  weekStart: string;
  onWeekChange?: (direction: 'prev' | 'next') => void;
}

export function ScheduleGrid({
  grid,
  days,
  times,
  doctorId,
  onSlotsGenerated,
  view,
  onViewChange,
  weekStart,
  onWeekChange,
}: ScheduleGridProps) {
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);

  const createBulkSlotsMutation = useCreateBulkSlots();
  const deleteSlotMutation = useDeleteSlot();

  const toggle = (slotId: string) =>
    setSelected((current) =>
      current.includes(slotId) ? current.filter((item) => item !== slotId) : [...current, slotId]
    );

  const handleDeleteSlots = async () => {
    const slotsWithIds = selected.filter((id) => id !== '');
    if (slotsWithIds.length === 0) {
      setNotice('No valid slots selected for deletion.');
      return;
    }

    try {
      for (const slotId of slotsWithIds) {
        await deleteSlotMutation.mutateAsync(slotId);
      }
      setNotice(`${slotsWithIds.length} slot(s) deleted successfully.`);
      setSelected([]);
      onSlotsGenerated?.();
    } catch (error) {
      console.error('Failed to delete slots:', error);
      setNotice('Failed to delete some slots.');
    }
  };

  const handleGenerateSlots = async (data: BulkSlotCreateInput) => {
    try {
      const result = await createBulkSlotsMutation.mutateAsync({
        ...data,
        doctorId,
      });
      setDialog(false);
      setNotice(`${result.created} slots generated successfully.`);
      onSlotsGenerated?.();
    } catch (error) {
      // Error is handled by the dialog's error state
      console.error('Failed to generate slots:', error);
      throw error;
    }
  };

  const handleToggleBlocked = () => {
    setBlocked(!blocked);
    setNotice(blocked ? 'Blocked time removed.' : 'Time blocked for selected period.');
  };

  const startDate = new Date(weekStart);
  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

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
              <button
                onClick={() => onWeekChange?.('prev')}
                className="hover:bg-secondary rounded-lg p-2"
                aria-label="Previous week"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-black">
                {startDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                –{' '}
                {endDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h2>
              <button
                onClick={() => onWeekChange?.('next')}
                className="hover:bg-secondary rounded-lg p-2"
                aria-label="Next week"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <p className="text-muted-foreground mt-1 pl-10 text-xs">
              Manage availability, bookings, and blocked time
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="bg-secondary flex rounded-xl p-1">
              {(['Day', 'Week', 'Month'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => onViewChange?.(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${view === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDialog(true)}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm hover:opacity-90"
              disabled={createBulkSlotsMutation.isPending}
            >
              <Plus className="size-4" />
              Generate slots
            </button>
          </div>
        </div>
        <ScheduleLegend />
      </section>
      <section className="border-border bg-card overflow-auto rounded-2xl border shadow-sm sm:overflow-hidden">
        <div className="border-border grid min-w-[900px] grid-cols-[76px_repeat(8,1fr)] border-b">
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
          {grid.map((timeRow, timeIndex) => (
            <div
              key={times[timeIndex]}
              className="border-border/70 grid grid-cols-[76px_repeat(8,1fr)] border-b last:border-0"
            >
              <div className="text-muted-foreground flex items-start justify-center pt-4 text-[10px] font-bold">
                {times[timeIndex]}
              </div>
              {timeRow.map((slot, dayIndex) => (
                <SlotCell
                  key={slot.id || `${dayIndex}-${timeIndex}`}
                  day={days[dayIndex]}
                  slot={slot}
                  selected={selected}
                  onToggle={toggle}
                  index={dayIndex}
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
