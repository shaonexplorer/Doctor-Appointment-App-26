'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  useStaffAppointments,
  useCancelStaffAppointment,
  useCheckInStaffAppointment,
  useRescheduleStaffAppointment,
  transformStaffAppointmentsToUI,
} from '@/hooks/useStaffAppointments';
import { useAvailableSlotsForReschedule } from '@/hooks/useSchedule';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from './data-table';
import { staffAppointmentsColumns, type StaffAppointment } from './staff-appointments-columns';

const statusLabelMap: Record<string, string> = {
  Confirmed: 'Confirmed',
  'Checked in': 'Checked in',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  NoShow: 'No Show',
  Waiting: 'Waiting',
};

const paymentLabelMap: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
};

const consultationTypeMap: Record<string, string> = {
  IN_PERSON: 'In-person',
  VIDEO: 'Video',
};

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  Cancelled: 'destructive',
  Waiting: 'warning',
  'Checked in': 'default',
  Confirmed: 'success',
  NoShow: 'destructive',
};

const paymentBadgeVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Refunded: 'destructive',
  Pending: 'warning',
};

export function StaffAppointments() {
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkInNotes, setCheckInNotes] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const router = useRouter();

  // Mutations
  const cancelMutation = useCancelStaffAppointment();
  const checkInMutation = useCheckInStaffAppointment();
  const rescheduleMutation = useRescheduleStaffAppointment();

  // Use TanStack Query for fetching appointments with caching
  const { data, isLoading, error } = useStaffAppointments({
    status: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
    // dateRange: 'today',
    sortBy: 'slot.startTime',
    sortOrder: 'desc',
  });

  // Fetch available slots for rescheduling when an appointment is selected
  // Use startTime as the start date, and 30 days from startTime as end date
  const startDate = selectedAppointment?.startTime
    ? new Date(selectedAppointment.startTime)
    : undefined;
  const endDate = startDate ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined; // 30 days from appointment

  const { data: availableSlots, isLoading: slotsLoading } = useAvailableSlotsForReschedule(
    selectedAppointment?.doctorId,
    startDate,
    endDate
  );

  // Transform data for UI - matches the hook's output shape
  const appointments = data ? transformStaffAppointmentsToUI(data) : [];

  console.log('Transformed appointments for UI:', data);

  // KPI counts
  const todayCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const action = (message: string) => {
    setNotice(message);
    router.push('/staff/booking');
  };

  const openDrawer = (appointment: StaffAppointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
    setSelectedSlotId('');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedAppointment(null);
    setSelectedSlotId('');
  };

  const handleCheckIn = () => {
    if (selectedAppointment) {
      setCheckInNotes('');
      setCheckInDialogOpen(true);
    }
  };

  const confirmCheckIn = () => {
    if (selectedAppointment) {
      checkInMutation.mutate(
        { appointmentId: selectedAppointment.id, notes: checkInNotes || undefined },
        {
          onSuccess: () => {
            closeDrawer();
            setCheckInDialogOpen(false);
            setCheckInNotes('');
            setNotice(`Checked in ${selectedAppointment.patient}`);
          },
          onError: (error: Error) => {
            setCheckInDialogOpen(false);
            setCheckInNotes('');
            setNotice(`Failed to check in: ${error.message}`);
          },
        }
      );
    }
  };

  const handleReschedule = () => {
    if (selectedAppointment) {
      closeDrawer();
      setRescheduleDialogOpen(true);
    }
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      setCancelDialogOpen(true);
    }
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      cancelMutation.mutate(selectedAppointment.id, {
        onSuccess: () => {
          closeDrawer();
          setCancelDialogOpen(false);
          setNotice(`Cancelled ${selectedAppointment.patient}`);
        },
        onError: (error: Error) => {
          setCancelDialogOpen(false);
          setNotice(`Failed to cancel: ${error.message}`);
        },
      });
    }
  };

  const confirmReschedule = () => {
    if (selectedAppointment && selectedSlotId) {
      rescheduleMutation.mutate(
        { appointmentId: selectedAppointment.id, newSlotId: selectedSlotId },
        {
          onSuccess: () => {
            setRescheduleDialogOpen(false);
            setSelectedSlotId('');
            setNotice(`Rescheduled ${selectedAppointment.patient}`);
          },
          onError: (error: Error) => {
            setRescheduleDialogOpen(false);
            setSelectedSlotId('');
            setNotice(`Failed to reschedule: ${error.message}`);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <section className="mt-8 space-y-5" aria-label="Appointment management">
        <div className="border-border bg-card rounded-2xl border p-10 text-center shadow-sm">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 space-y-5" aria-label="Appointment management">
        <div className="border-border bg-card rounded-2xl border p-10 text-center shadow-sm">
          <p className="text-destructive">Failed to load appointments. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-5" aria-label="Appointment management">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Today', count: todayCount },
          { label: 'Confirmed', count: confirmedCount },
          { label: 'Completed', count: completedCount },
          { label: 'Cancelled', count: cancelledCount },
        ].map(({ label, count }) => (
          <div key={label} className="border-border bg-card rounded-2xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <span className="bg-muted/30 rounded-xl p-2">
                <CalendarDays className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">{count}</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
        <div className="border-border mb-5 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold">Today's appointments</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
              {appointments.length} scheduled appointments
            </p>
          </div>
          <Button onClick={() => action('Booking workspace opened')}>Book appointment</Button>
        </div>

        <DataTable
          columns={staffAppointmentsColumns(openDrawer)}
          data={appointments}
          searchPlaceholder="Search patient, doctor, appointment ID..."
          searchKey="patient"
        />

        {appointments.length === 0 && (
          <div className="text-muted-foreground py-10 text-center text-sm">
            No appointments found.
          </div>
        )}
      </div>

      {notice && (
        <div
          role="status"
          className="fixed right-5 bottom-24 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {notice}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the appointment for {selectedAppointment?.patient}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new time slot for {selectedAppointment?.patient}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {slotsLoading ? (
              <div className="text-muted-foreground py-8 text-center">
                Loading available slots...
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="space-y-2">
                <Label htmlFor="slot-select" className="text-sm font-medium">
                  Available Time Slots
                </Label>
                <Select
                  value={selectedSlotId}
                  onValueChange={setSelectedSlotId}
                  disabled={rescheduleMutation.isPending}
                >
                  <SelectTrigger id="slot-select">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {new Date(slot.startTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        at {slot.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                No available slots found for the next 30 days.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRescheduleDialogOpen(false);
                setSelectedSlotId('');
              }}
              disabled={rescheduleMutation.isPending}
            >
              Keep Current Time
            </Button>
            <Button
              onClick={confirmReschedule}
              disabled={rescheduleMutation.isPending || !selectedSlotId}
            >
              {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check In Confirmation Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check In Patient</DialogTitle>
            <DialogDescription>
              Confirm check-in for {selectedAppointment?.patient}. You can optionally add notes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="check-in-notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="check-in-notes"
                placeholder="Add any check-in notes (max 500 characters)..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                maxLength={500}
                rows={3}
                disabled={checkInMutation.isPending}
              />
              <p className="text-muted-foreground text-right text-xs">{checkInNotes.length}/500</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCheckInDialogOpen(false);
                setCheckInNotes('');
              }}
              disabled={checkInMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={confirmCheckIn} disabled={checkInMutation.isPending}>
              {checkInMutation.isPending ? 'Checking in...' : 'Check In'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          {selectedAppointment && (
            <div className="mt-4 flex h-screen flex-col space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary text-xs font-bold tracking-wider uppercase">
                    Appointment #{selectedAppointment.id}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{selectedAppointment.patient}</h2>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4">
                <p className="text-primary text-xs font-bold">Appointment</p>
                <p className="mt-2 text-lg font-black">
                  {selectedAppointment.startTime
                    ? new Date(selectedAppointment.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {consultationTypeMap[selectedAppointment.consultationType] ||
                    selectedAppointment.consultationType}{' '}
                  · {selectedAppointment.specialty}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="Patient" value={selectedAppointment.patient} />
                <Info label="Doctor" value={selectedAppointment.specialty} />
                <Info label="Specialty" value={selectedAppointment.specialty} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold">Status & Payment</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      statusBadgeVariant[
                        statusLabelMap[selectedAppointment.status] || selectedAppointment.status
                      ]
                    }
                  >
                    {statusLabelMap[selectedAppointment.status] || selectedAppointment.status}
                  </Badge>
                  <Badge
                    variant={
                      paymentBadgeVariant[
                        paymentLabelMap[selectedAppointment.payment] || selectedAppointment.payment
                      ]
                    }
                  >
                    {paymentLabelMap[selectedAppointment.payment] || selectedAppointment.payment}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold">Contact & Location</p>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>+1 (555) 000-0000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Main Clinic, Room 204</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex w-full flex-wrap gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleCheckIn}
                    disabled={checkInMutation.isPending}
                  >
                    {checkInMutation.isPending ? 'Checking in...' : 'Check in'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReschedule}
                    disabled={rescheduleMutation.isPending}
                  >
                    {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule'}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleCancel}
                    disabled={
                      cancelMutation.isPending || selectedAppointment?.status === 'Cancelled'
                    }
                  >
                    {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
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
