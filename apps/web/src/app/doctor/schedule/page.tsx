'use client';

import { useState } from 'react';
import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { ScheduleGrid } from '@/components/doctor-schedule';
import { useWeeklySchedule, transformScheduleForGrid } from '@/hooks/useSchedule';

export function DoctorSchedulePageContent() {
  const [weekStart, setWeekStart] = useState(() => {
    // Get the start of the current week (Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString().split('T')[0];
  });

  const { data: scheduleData, isLoading, error, refetch } = useWeeklySchedule(weekStart);

  const { slots, days } = transformScheduleForGrid(scheduleData || []);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const currentWeekStart = new Date(weekStart);
    if (direction === 'prev') {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    } else {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    const newWeekStart = currentWeekStart.toISOString().split('T')[0];
    setWeekStart(newWeekStart);
  };

  if (isLoading) {
    return (
      <DoctorPortalShell active="Schedule">
        <div className="mt-8 space-y-5">
          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-muted-foreground">Loading schedule...</p>
              </div>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-border bg-card h-32 rounded-2xl border" />
            ))}
          </div>
        </div>
      </DoctorPortalShell>
    );
  }

  if (error) {
    return (
      <DoctorPortalShell active="Schedule">
        <div className="mt-8 space-y-5">
          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-destructive">Failed to load schedule</p>
                <button
                  onClick={() => refetch()}
                  className="bg-primary text-primary-foreground mt-2 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </DoctorPortalShell>
    );
  }

  return (
    <DoctorPortalShell active="Schedule">
      <div className="mt-8 space-y-5">
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWeekChange('prev')}
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
                  {new Date(weekStart).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  –{' '}
                  {new Date(
                    new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                <button
                  onClick={() => handleWeekChange('next')}
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
            <div className="flex items-center gap-2">
              <div className="bg-secondary flex rounded-xl p-1">
                {['Day', 'Week', 'Month'].map((item) => (
                  <button
                    key={item}
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${item === 'Week' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <ScheduleGrid slots={slots} days={days} />
      </div>
    </DoctorPortalShell>
  );
}

export default function DoctorSchedulePage() {
  return <DoctorSchedulePageContent />;
}
