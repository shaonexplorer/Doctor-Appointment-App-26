'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';

import {
  useStaffTodayAppointments,
  useStaffWeeklyAppointments,
  useStaffDoctors,
  useStaffUtilizationStats,
  useStaffWeeklySlots,
  transformAppointmentsToScheduleEvents,
  transformDoctorsToOnDuty,
  buildWeekDaysData,
  computeStatCards,
  type ScheduleEvent,
  type ScheduleSlot,
} from '@/hooks/useStaffSchedule';

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  Cancelled: 'destructive',
  Pending: 'warning',
  'Checked in': 'default',
  Confirmed: 'success',
};

export function StaffSchedule() {
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  });
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  const router = useRouter();

  // Fetch data using hooks
  const {
    data: todayAppointments = [],
    isLoading: loadingTodayAppointments,
    error: errorTodayAppointments,
    refetch: refetchTodayAppointments,
  } = useStaffTodayAppointments();

  const { data: weeklyAppointments = [], isLoading: loadingWeeklyAppointments } =
    useStaffWeeklyAppointments(format(weekStart, 'yyyy-MM-dd'));

  const { data: doctors = [], isLoading: loadingDoctors } = useStaffDoctors();

  const { data: utilizationStats, isLoading: loadingUtilization } = useStaffUtilizationStats();

  const { data: weekSlots = [], isLoading: loadingWeekSlots } = useStaffWeeklySlots(
    format(weekStart, 'yyyy-MM-dd')
  );

  // Transform data for UI
  const scheduleEvents = useMemo(
    () => transformAppointmentsToScheduleEvents(todayAppointments),
    [todayAppointments]
  );

  const doctorsOnDuty = useMemo(
    () => transformDoctorsToOnDuty(doctors, groupSlotsByDoctorId(weekSlots)),
    [doctors, weekSlots]
  );

  const weekDays = useMemo(
    () => buildWeekDaysData(weeklyAppointments, weekSlots, format(weekStart, 'yyyy-MM-dd')),
    [weeklyAppointments, weekSlots, weekStart]
  );

  const statCards = useMemo(
    () =>
      computeStatCards(
        todayAppointments,
        utilizationStats || { booked: 0, available: 0, cancelled: 0, noShow: 0, total: 0 },
        doctors,
        weekSlots
      ),
    [todayAppointments, utilizationStats, doctors, weekSlots]
  );

  const filtered = useMemo(
    () =>
      scheduleEvents.filter((event) =>
        `${event.time} ${event.patient} ${event.doctor} ${event.status}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, scheduleEvents]
  );

  const handleAction = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleBookAppointment = () => {
    router.push('/staff/booking');
  };

  const openDrawer = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  const getDayClass = (isToday: boolean) =>
    cn(
      'rounded-xl p-3 text-center text-sm font-bold',
      isToday ? 'bg-primary text-primary-foreground' : 'bg-secondary'
    );

  const getSlotClass = (color: string) => {
    const colorName = color.replace('bg-', '').replace('-500', '');
    return cn(
      'rounded-lg p-2 text-xs',
      `bg-${colorName}-50 text-${colorName}-800 border border-${colorName}-200`
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekStart((prev) => (direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)));
  };

  const isLoading =
    loadingTodayAppointments ||
    loadingWeeklyAppointments ||
    loadingDoctors ||
    loadingUtilization ||
    loadingWeekSlots;

  if (isLoading) {
    return (
      <section className="mt-8 space-y-6" aria-label="Schedule management">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-5 shadow-sm">
              <CardHeader className="pb-2">
                <div className="bg-muted h-4 w-24 rounded" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-muted h-8 w-16 rounded" />
                <div className="bg-muted mt-1 h-3 w-20 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse overflow-hidden shadow-sm">
          <div className="min-w-[850px] p-5">
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="bg-secondary h-10 rounded-xl p-3 text-center text-sm font-bold"
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="border-border bg-background min-h-48 rounded-xl border p-3"
                />
              ))}
            </div>
          </div>
        </Card>
      </section>
    );
  }

  if (errorTodayAppointments) {
    return (
      <section className="mt-8 space-y-6" aria-label="Schedule management">
        <div className="p-10 text-center">
          <p className="text-destructive">Failed to load schedule data. Please try again.</p>
          <Button onClick={() => refetchTodayAppointments()} className="mt-4">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6" aria-label="Schedule management">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, detail }) => (
          <Card key={label} className="p-5 shadow-sm">
            <CardHeader className="pb-2">
              <p className="text-muted-foreground text-sm">{label}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-black tracking-tight">{value}</p>
              <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Overview */}
      <Card className="overflow-hidden shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Schedule overview</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {format(weekStart, 'MMMM d')} – {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous week"
              className="mobile-touch-target"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next week"
              className="mobile-touch-target"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="size-4" />
            </Button>
            {['Day', 'Week', 'Month'].map((item) => (
              <Button
                key={item}
                onClick={() => setView(item as 'Day' | 'Week' | 'Month')}
                variant={view === item ? 'default' : 'outline'}
                className="mobile-touch-target px-3 py-2 text-sm font-semibold"
              >
                {item}
              </Button>
            ))}
            <Button
              onClick={() => handleBookAppointment()}
              className="mobile-touch-target inline-flex items-center gap-2"
            >
              <Plus className="size-4" /> Add appointment
            </Button>
          </div>
        </div>

        <div className="mobile-scroll-x overflow-x-auto">
          <div className="min-w-[850px] p-5">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day.day} className={getDayClass(day.isToday)}>
                  {day.day}
                </div>
              ))}
            </div>

            {/* Week Grid */}
            <div className="mt-3 grid grid-cols-7 gap-2">
              {weekDays.map((day, _) => (
                <div
                  key={day.day}
                  className="border-border bg-background min-h-48 rounded-xl border p-3"
                >
                  <p className="text-muted-foreground text-xs">{day.appointments}</p>
                  {day.slots.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {day.slots.map((slot, slotIndex) => {
                        // console.log(slot);
                        return (
                          <div
                            key={`${day.day}-${slotIndex}`}
                            className={getSlotClass(slot.doctorColor)}
                          >
                            <b>{slot.time}</b>
                            <br />
                            {slot.patient}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Appointment Queue & Doctors on Duty */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Today's Appointment Queue */}
        <Card className="overflow-hidden shadow-sm">
          <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Today's appointment queue</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
            <label className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                aria-label="Search schedule"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search patient or doctor"
                className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-sm outline-none sm:w-64"
              />
            </label>
          </div>

          <div className="mobile-scroll-x overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-secondary text-muted-foreground text-xs tracking-wider uppercase">
                <tr>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/20">
                    <td className="px-5 py-4 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="text-muted-foreground size-4" />
                        {event.time}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <UserRound className="text-muted-foreground size-4" />
                        {event.patient}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-5 py-4">{event.doctor}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={statusBadgeVariant[event.status]}
                        className={event.statusClass.replace('border-', 'border')}
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDrawer(event)}
                        aria-label={`More actions for ${event.patient}`}
                        className="mobile-touch-target"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-muted-foreground p-10 text-center text-sm">
              No appointments match your search.
            </div>
          )}
        </Card>

        {/* Doctors on Duty */}
        <Card className="p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Doctors on duty</h2>
              <p className="text-muted-foreground text-sm">Live availability</p>
            </div>
            <CalendarDays className="text-primary size-5" />
          </div>
          <div className="mt-5 space-y-4">
            {doctorsOnDuty.slice(0, showAllDoctors ? doctorsOnDuty.length : 5).map((doctor) => (
              <div key={doctor.name} className="flex items-center gap-3">
                <div
                  className={cn(
                    'grid size-9 place-items-center rounded-full text-xs font-bold text-white',
                    doctor.color
                  )}
                >
                  {doctor.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{doctor.name}</p>
                  <p className="text-muted-foreground text-xs">{doctor.specialty}</p>
                </div>
                <span className="text-primary text-xs font-bold">{doctor.slots}</span>
              </div>
            ))}
            {doctorsOnDuty.length > 5 && (
              <div className="mt-4 border-t pt-4">
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary hover:text-primary/80 w-full text-left"
                  onClick={() => setShowAllDoctors(!showAllDoctors)}
                >
                  {showAllDoctors ? (
                    <span className="flex items-center justify-center gap-2">
                      <ChevronLeft className="size-4" /> Show less
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Show all {doctorsOnDuty.length} doctors
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notification Toast */}
      {notice && (
        <div
          role="status"
          className="bg-foreground text-background fixed right-5 bottom-24 z-40 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}

      {/* Drawer for Appointment Details */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          {selectedEvent && (
            <div className="mt-4 flex h-screen flex-col space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary text-xs font-bold tracking-wider uppercase">
                    Appointment Details
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{selectedEvent.patient}</h2>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4">
                <p className="text-primary text-xs font-bold">Appointment</p>
                <p className="mt-2 text-lg font-black">
                  {format(new Date(selectedEvent.startTime), 'EEEE, MMMM d, yyyy')} ·{' '}
                  {selectedEvent.time}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{selectedEvent.doctor}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="Patient" value={selectedEvent.patient} />
                <Info label="Doctor" value={selectedEvent.doctor} />
                <Info label="Status" value={selectedEvent.status} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold">Status</p>
                <Badge variant={statusBadgeVariant[selectedEvent.status]}>
                  {selectedEvent.status}
                </Badge>
              </div>

              <div className="border-t pt-4">
                <div className="flex w-full flex-wrap gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      handleAction(`Checked in ${selectedEvent.patient}`);
                    }}
                  >
                    Check in
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      handleAction(`Rescheduling ${selectedEvent.patient}`);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      handleAction(`Cancelled ${selectedEvent.patient}`);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
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

// Helper function to group slots by doctor ID
function groupSlotsByDoctorId(slots: ScheduleSlot[]): Record<string, ScheduleSlot[]> {
  return slots.reduce(
    (acc, slot) => {
      if (!acc[slot.doctorId]) {
        acc[slot.doctorId] = [];
      }
      acc[slot.doctorId].push(slot);
      return acc;
    },
    {} as Record<string, ScheduleSlot[]>
  );
}
