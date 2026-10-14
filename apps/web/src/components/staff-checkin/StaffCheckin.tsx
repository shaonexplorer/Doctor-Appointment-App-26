/***
 * Staff Checkin Component
 * Fetches today's appointments using TanStack Query for caching and
 * displays them in a table with check-in functionality.
 * ***/

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "./DataTable";
import { cn } from "@/lib/utils";
import { appointmentApi } from "@/lib/api";
import { staffCheckinColumns } from "./columns";
import { toast } from "@/components/ui/toast";

// Query keys for consistent caching
export const staffCheckinAppointmentKeys = {
  all: ["staff-checkin-appointments"] as const,
  today: () => [...staffCheckinAppointmentKeys.all, "today"] as const,
};

// Status badge colors based on clinical precision palette
// Maps status strings to Tailwind classes using project's design tokens
const statusBadgeClasses = {
  waiting: "bg-primary/10 text-primary",
  checkedIn: "bg-secondary/10 text-secondary",
  inConsultation: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  noShow: "bg-destructive/10 text-destructive",
  default: "bg-muted/10 text-muted-foreground",
};

export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  time: string;
  status: string;
  payment: string;
}

// Backend response types for doctor appointments
interface DoctorAppointmentResponse {
  id: string;
  status: string;
  paymentStatus: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
  };
  slot: {
    startTime: string;
  };
}

// Transform backend DoctorAppointmentResponse to frontend Appointment format
function transformToAppointment(ui: DoctorAppointmentResponse): Appointment {
  const patientName = `${ui.patient.firstName} ${ui.patient.lastName}`;
  const doctorName = `Dr. ${ui.doctor.firstName} ${ui.doctor.lastName}`;
  const time = new Date(ui.slot.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    id: ui.id,
    patientName,
    doctor: doctorName,
    time,
    status: ui.status,
    payment: ui.paymentStatus,
  };
}

// Hook to fetch today's appointments using TanStack Query
function useTodayAppointments() {
  return useQuery({
    queryKey: staffCheckinAppointmentKeys.today(),
    queryFn: async () => {
      const result = await appointmentApi.getDoctorAppointments({
        dateRange: "today",
      });
      // Transform each appointment to the UI format
      return result.data.map(transformToAppointment);
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function StaffCheckin() {
  // Fetch today's appointments using TanStack Query (replaces useEffect)
  const { data } = useTodayAppointments();
  const appointments = data ? data : [];
  const total = data ? data.length : 0;

  const queryClient = useQueryClient();

  console.log(appointments, "appointments data");

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (appointmentId: string) => appointmentApi.checkInPatient(appointmentId),
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: staffCheckinAppointmentKeys.today() });
      toast.add({
        type: "success",
        title: "Check-in successful",
        description: "Patient has been checked in successfully",
      });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Check-in failed",
        description: error.message || "Failed to check in patient",
      });
    },
  });

  // Handle check-in action from table
  useEffect(() => {
    const handleCheckIn = (event: CustomEvent<{ appointmentId: string; patientName: string }>) => {
      const { appointmentId } = event.detail;
      checkInMutation.mutate(appointmentId);
    };

    window.addEventListener("staff-checkin:check-in", handleCheckIn as EventListener);

    return () => {
      window.removeEventListener("staff-checkin:check-in", handleCheckIn as EventListener);
    };
  }, [checkInMutation]);

  // Get badge classes for a given status
  const getStatusBadgeClass = (status: string) => {
    const lower = status.toLowerCase();
    return lower.includes("waiting") || lower.includes("pending")
      ? statusBadgeClasses.waiting
      : lower.includes("checked in") || lower.includes("checked-in")
        ? statusBadgeClasses.checkedIn
        : lower.includes("consultation")
          ? statusBadgeClasses.inConsultation
          : lower.includes("completed")
            ? statusBadgeClasses.completed
            : lower.includes("no-show") || lower.includes("cancelled")
              ? statusBadgeClasses.noShow
              : statusBadgeClasses.default;
  };

  // Stats for the metric cards
  const waitingCount = appointments.filter((a) => a.status === "Waiting").length;
  const checkedInCount = appointments.filter((a) => a.status === "Checked In").length;
  const pendingPaymentsCount = appointments.filter((a) => a.payment === "Pending").length;

  return (
    <div className="mt-8 space-y-6">
      {/* Metrics Section */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Today's appointments
          </h3>
          <p className="text-3xl font-black tracking-tight">{total}</p>
        </div>
        <div className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Waiting queue
          </h3>
          <p className="text-3xl font-black tracking-tight">{waitingCount}</p>
        </div>
        <div className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Checked in
          </h3>
          <p className="text-3xl font-black tracking-tight">{checkedInCount}</p>
        </div>
        <div className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Pending payments
          </h3>
          <p className="text-3xl font-black tracking-tight">
            {pendingPaymentsCount > 0 ? pendingPaymentsCount : "0"}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <section className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-bold">Appointments</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Search by appointment ID, patient name, or doctor name.
              </p>
            </div>
          </div>
        </div>

        <DataTable
          columns={staffCheckinColumns}
          data={appointments}
          searchPlaceholder="Search appointments (ID, patient, doctor)..."
          searchKey="patientName"
          enableRowSelection
          enableColumnVisibility
          enableGlobalFilter
          showPageSizeSelector
          pageSizeOptions={[10, 25, 50, 100]}
          initialPageSize={10}
          emptyMessage="No appointments found"
          emptyDescription="No appointments match your search criteria."
          stickyHeader
          showRowNumbers
        />

        {/* Mobile Card View */}
        <div className="p-4 md:hidden">
          {appointments.length === 0 && (
            <div className="text-muted-foreground p-10 text-center text-sm">
              <svg
                className="text-primary/60 mx-auto size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="mt-2 font-semibold">No appointments found</p>
            </div>
          )}
          {appointments.map((a) => (
            <div
              key={a.id}
              className={cn(
                "mb-2 flex items-center gap-3 rounded-xl border p-3",
                getStatusBadgeClass(a.status)
              )}
            >
              <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-full text-xs font-black">
                {a.id.substring(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{a.patientName}</p>
                <p className="text-muted-foreground text-xs">
                  {a.doctor} · {a.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    a.status === "Waiting"
                      ? "warning"
                      : a.status === "Checked In"
                        ? "success"
                        : a.status === "Completed"
                          ? "success"
                          : "default"
                  }
                  className="text-xs"
                >
                  {a.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Waiting queue sidebar */}
      <section className="border-border bg-card elevation-1 rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Waiting queue</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Estimated order for patients ready to be seen.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {appointments
            .filter((a) => a.status === "Waiting")
            .map((a) => (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  // Apply status-based background tint
                  getStatusBadgeClass(a.status)
                )}
              >
                <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-full text-xs font-black">
                  {a.id.substring(0, 2)}
                </span>
                <div>
                  <p className="truncate text-xs font-bold">{a.patientName}</p>
                  <p className="text-muted-foreground text-xs">Estimated wait 5 min</p>
                </div>
              </div>
            ))}
          {appointments.filter((a) => a.status === "Waiting").length === 0 && (
            <div className="text-muted-foreground py-8 text-center sm:col-span-3">
              <svg
                className="text-muted-foreground/50 mx-auto size-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <p className="mt-2 font-medium">No patients waiting</p>
              <p className="text-xs">All caught up!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}