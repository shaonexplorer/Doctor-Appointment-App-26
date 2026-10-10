'use client';

import { useState } from 'react';
import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { ScheduleGrid } from '@/components/doctor-schedule';
import { useWeeklySchedule, transformScheduleForGrid } from '@/hooks/useSchedule';
import { useDoctorProfile } from '@/hooks/useDoctorDashboard';

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
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');

  const { data: scheduleData, isLoading, error, refetch } = useWeeklySchedule(weekStart);
  const { data: profileData } = useDoctorProfile();

  // console.log(scheduleData);

  const doctorId = profileData?.id;
  const { grid, days, times } = transformScheduleForGrid(scheduleData || []);

  console.log(grid);

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

  if (!doctorId && !isLoading) {
    return (
      <DoctorPortalShell active="Schedule">
        <div className="mt-8 space-y-5">
          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-destructive">
                  Doctor profile not found. Please complete your profile setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DoctorPortalShell>
    );
  }

  // At this point, doctorId is guaranteed to be defined
  const doctorIdString = doctorId!;

  return (
    <DoctorPortalShell active="Schedule">
      <div className="mt-8 space-y-5">
        <ScheduleGrid
          grid={grid}
          days={days}
          times={times}
          doctorId={doctorIdString}
          onSlotsGenerated={refetch}
          view={view}
          onViewChange={setView}
          weekStart={weekStart}
          onWeekChange={handleWeekChange}
        />
      </div>
    </DoctorPortalShell>
  );
}

export default function DoctorSchedulePage() {
  return <DoctorSchedulePageContent />;
}
