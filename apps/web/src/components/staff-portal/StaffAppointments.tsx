'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Search,
  UserRound,
  XCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { appointmentApi } from '@/lib/api';
import { useStaffAppointments } from '@/hooks/useStaffAppointments';
import { transformStaffAppointmentsToUI } from '@/hooks/useStaffAppointments';
import { staffAppointmentKeys } from '@/hooks/useStaffAppointments';

const toneStyles: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
};

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  Cancelled: 'destructive',
  Waiting: 'warning',
  'Checked in': 'default',
  Confirmed: 'success',
};

const paymentBadgeVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Refunded: 'destructive',
  Pending: 'warning',
};

// Map API status strings to UI status labels
const statusLabelMap: Record<string, string> = {
  SCHEDULED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
};

// Map API payment status strings to UI payment labels
const paymentLabelMap: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
};

// Map consultation type to readable format
const consultationTypeMap: Record<string, string> = {
  IN_PERSON: 'In-person',
  VIDEO: 'Video',
};

interface FetchedAppointment {
  id: string;
  slotId: string;
  patientId: string;
  doctorId: string;
  status: string;
  symptoms: string | null;
  notes: string | null;
  paymentStatus: string;
  consultationType: string;
  createdAt: string;
  updatedAt: string;
  slot?: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    doctorId: string;
  };
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctorProfile?: {
    specialty: string;
    clinic?: string;
    designation: string;
    fee: number;
  } | null;
  prescriptions?: Array<{
    id: string;
    diagnosis: string;
    createdAt: string;
  }>;
  // Transformed fields from TanStack Query
  startTime: string; // ISO string (flattened from slot.startTime)
  endTime: string; // ISO string
  time: string; // Formatted time like "9:00 AM"
  date: string; // Formatted date like "Sep 18, 2026"
  initials: string;
}

export function StaffAppointments() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<FetchedAppointment | null>(null);

  const router = useRouter();

  // Use TanStack Query for fetching appointments with caching
  const { data, isLoading, error } = useStaffAppointments({
    status: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
  });

  // const appointments = data ? transformStaffAppointmentsToUI(data) : [];
  const appointments = data || [];

  const filtered = useMemo(
    () =>
      appointments.filter(
        (item) =>
          `${item.patient?.firstName} ${item.patient?.lastName} ${item.doctor?.firstName} ${item.doctorProfile?.specialty}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === 'All statuses' || item.status === status)
      ),
    [appointments, query, status]
  );

  const action = (message: string) => {
    // console.log(message);
    setNotice(message);
    router.push('/staff/booking');
  };

  const openDrawer = (appointment: FetchedAppointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <section className="mt-8 space-y-5" aria-label="Appointment management">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Today', getCount: () => appointments.length },
          {
            label: 'Confirmed',
            getCount: () => appointments.filter((a) => statusLabelMap[a.status]).length,
          },
          {
            label: 'Waiting',
            getCount: () => appointments.filter((a) => a.status === 'Waiting').length,
          },
          {
            label: 'Cancelled',
            getCount: () => appointments.filter((a) => a.status === 'Cancelled').length,
          },
        ].map(({ label, getCount }, i) => (
          <div key={label} className="border-border bg-card rounded-2xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <span className="bg-muted/30 rounded-xl p-2">
                <CalendarDays className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">{getCount()}</p>
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold">Today&apos;s appointments</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {appointments.length} scheduled appointments
            </p>
          </div>
          <Button onClick={() => action('Booking workspace opened')}>Book appointment</Button>
        </div>

        <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search appointments"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient, doctor, appointment ID..."
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
            />
          </label>
          <select
            aria-label="Filter appointment status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border-border bg-background h-11 rounded-xl border px-3 text-sm"
          >
            <option>All statuses</option>
            <option>Confirmed</option>
            <option>Waiting</option>
            <option>Cancelled</option>
          </select>
          {/* <Button variant="outline" className="text-sm font-bold">
            <Filter className="mr-2 inline size-4" />
            More filters
          </Button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs tracking-wider uppercase">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((item) => {
                const patientName = `${item.patient?.firstName} ${item.patient?.lastName}`;
                const doctorName = `${item.doctor?.firstName} ${item.doctor?.lastName}`;
                const formattedTime = item.slot.startTime
      ? format(new Date(item.slot.startTime), 'h:mm a')
      : '—';
                const statusLabel = statusLabelMap[item.status] || item.status;
                const paymentLabel = paymentLabelMap[item.paymentStatus] || item.paymentStatus;
                const consultationTypeLabel =
                  consultationTypeMap[item.consultationType] || item.consultationType;
                const specialty = item.doctorProfile?.specialty || 'Unknown';

                return (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-5 py-4 font-bold whitespace-nowrap">{formattedTime}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary rounded-xl p-2">
                          <UserRound className="size-4" />
                        </span>
                        <div>
                          <p className="font-bold">{patientName}</p>
                          <p className="text-muted-foreground text-xs">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{doctorName}</p>
                      <p className="text-muted-foreground text-xs">{specialty}</p>
                    </td>
                    <td className="text-muted-foreground px-5 py-4">{consultationTypeLabel}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusBadgeVariant[statusLabel]}>{statusLabel}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={paymentBadgeVariant[paymentLabel]}>{paymentLabel}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openDrawer(item)}
                        aria-label={`View ${patientName}`}
                        className="mobile-touch-target text-muted-foreground hover:bg-muted rounded-lg p-2"
                      >
                        <Eye className="size-4" />
                      </button>
                      {/* <button
                        onClick={() => action('Appointment actions opened')}
                        aria-label={`More actions for ${patientName}`}
                        className="mobile-touch-target text-muted-foreground hover:bg-muted rounded-lg p-2"
                      >
                        <MoreHorizontal className="size-4" />
                      </button> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-muted-foreground p-10 text-center text-sm">
            {appointments.length === 0
              ? 'No appointments found.'
              : 'No appointments match these filters.'}
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

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          {/* {!selectedAppointment && (
            <SheetHeader>
              <SheetTitle className="text-lg">Appointment Details</SheetTitle>
              <SheetDescription>
                View and manage appointment information for {selectedAppointment?.patient}
              </SheetDescription>
            </SheetHeader>
          )} */}
          {selectedAppointment && (
            <div className="mt-4 flex h-screen flex-col space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary text-xs font-bold tracking-wider uppercase">
                    Appointment #{selectedAppointment.id}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                  </h2>
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
                  · {selectedAppointment.doctorProfile?.specialty || 'Unknown'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Info
                  label="Patient"
                  value={
                    selectedAppointment?.patient
                      ? `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
                      : ''
                  }
                />
                <Info
                  label="Doctor"
                  value={
                    selectedAppointment?.doctor
                      ? `${selectedAppointment.doctor.firstName} ${selectedAppointment.doctor.lastName}`
                      : ''
                  }
                />
                <Info
                  label="Specialty"
                  value={selectedAppointment.doctorProfile?.specialty || 'Unknown'}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold">Status & Payment</p>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedAppointment && (
                    <>
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
                            paymentLabelMap[selectedAppointment.paymentStatus] ||
                              selectedAppointment.paymentStatus
                          ]
                        }
                      >
                        {paymentLabelMap[selectedAppointment.paymentStatus] ||
                          selectedAppointment.paymentStatus}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold">Contact & Location</p>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4" />
                    <span>+1 (555) 000-0000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>Main Clinic, Room 204</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex w-full flex-wrap gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      setNotice(
                        `Checked in ${selectedAppointment?.patient?.firstName} ${selectedAppointment?.patient?.lastName}`
                      );
                    }}
                  >
                    Check in
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      setNotice(
                        `Rescheduling ${selectedAppointment?.patient?.firstName} ${selectedAppointment?.patient?.lastName}`
                      );
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      closeDrawer();
                      setNotice(
                        `Cancelled ${selectedAppointment?.patient?.firstName} ${selectedAppointment?.patient?.lastName}`
                      );
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
