'use client';

/**
 * TanStack Query hooks for doctor appointments (Doctor Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  appointmentApi,
  type DoctorAppointmentFilters,
  type DoctorAppointmentResponse,
  type PaginatedDoctorAppointmentsResponse,
} from '@/lib/api';

// Query keys for consistent caching
export const doctorAppointmentKeys = {
  all: ['doctor-appointments'] as const,
  lists: () => [...doctorAppointmentKeys.all, 'list'] as const,
  list: (filters: DoctorAppointmentFilters) => [...doctorAppointmentKeys.lists(), filters] as const,
  detail: (id: string) => [...doctorAppointmentKeys.all, 'detail', id] as const,
  stats: () => [...doctorAppointmentKeys.all, 'stats'] as const,
};

// Re-export types for consumers
export type {
  DoctorAppointmentFilters,
  DoctorAppointmentResponse,
  PaginatedDoctorAppointmentsResponse,
};

/**
 * Hook for fetching doctor's appointments with pagination and filters
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useDoctorAppointments(filters: DoctorAppointmentFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: doctorAppointmentKeys.list(filters),
    queryFn: () => appointmentApi.getDoctorAppointments({ ...restFilters, page, limit }),
    select: (data) => ({
      ...data,
      data: data.data.map(transformDoctorAppointmentToUI),
    }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single appointment detail (for Appointment Drawer)
 */
export function useDoctorAppointmentDetail(appointmentId: string | undefined) {
  return useQuery({
    queryKey: doctorAppointmentKeys.detail(appointmentId ?? ''),
    queryFn: () => appointmentApi.getDoctorAppointmentDetail(appointmentId!),
    select: transformDoctorAppointmentToUI,
    enabled: !!appointmentId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for cancelling an appointment as doctor
 */
export function useCancelAppointmentAsDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
      triggerRefund,
    }: {
      id: string;
      reason: string;
      triggerRefund: boolean;
    }) => appointmentApi.cancelAppointmentAsDoctor(id, { reason, triggerRefund }),
    onSuccess: () => {
      // Invalidate all doctor appointment queries to refetch fresh data
      void queryClient.invalidateQueries({ queryKey: doctorAppointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to cancel appointment:', error);
    },
  });
}

/**
 * Hook for rescheduling an appointment as doctor
 */
export function useRescheduleAppointmentAsDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newSlotId }: { id: string; newSlotId: string }) =>
      appointmentApi.rescheduleAppointmentAsDoctor(id, { newSlotId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorAppointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to reschedule appointment:', error);
    },
  });
}

/**
 * Hook for checking in a patient
 */
export function useCheckInPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      appointmentApi.checkInPatient(id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorAppointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to check in patient:', error);
    },
  });
}

/**
 * Hook for completing an appointment as doctor
 */
export function useCompleteAppointmentAsDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      notes,
      diagnosis,
    }: {
      id: string;
      notes?: string | null;
      diagnosis?: string | null;
    }) => appointmentApi.completeAppointmentAsDoctor(id, { notes, diagnosis }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorAppointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to complete appointment:', error);
    },
  });
}

/**
 * Transform backend DoctorAppointmentResponse to frontend DoctorAppointment format
 * Maps API response to the UI component's expected data structure
 */
export function transformDoctorAppointmentToUI(
  appointment: DoctorAppointmentResponse
): DoctorAppointmentUI {
  const startTime = new Date(appointment.slot.startTime);
  const endTime = new Date(appointment.slot.endTime);
  const createdAt = new Date(appointment.createdAt);

  // Format date as "Sep 18, 2026"
  const formattedDate = startTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format time as "07:20 PM" (12-hour format)
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Map status from backend to frontend format
  const statusMap: Record<
    string,
    'Confirmed' | 'Checked in' | 'Completed' | 'Cancelled' | 'No-show'
  > = {
    SCHEDULED: 'Confirmed',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No-show',
  };

  // Map payment status
  const paymentMap: Record<string, 'Pending' | 'Paid' | 'Refunded'> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    REFUNDED: 'Refunded',
  };

  // Get patient name and initials
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  const initials =
    `${appointment.patient.firstName.charAt(0)}${appointment.patient.lastName.charAt(0)}`.toUpperCase();

  // Get clinic from doctor profile or use default
  const clinic = appointment.doctorProfile?.clinic || 'Clinic not specified';

  // Get specialty from doctor profile
  const specialty = appointment.doctorProfile?.specialty || 'General Medicine';

  return {
    id: appointment.id,
    patient: patientName,
    initials,
    time: formattedTime,
    symptoms: appointment.symptoms || 'No symptoms recorded',
    status: statusMap[appointment.status] || 'Confirmed',
    payment: paymentMap[appointment.paymentStatus] || 'Pending',
    date: formattedDate,
    consultationType: appointment.consultationType as 'IN_PERSON' | 'VIDEO' | 'PHONE',
    specialty,
    clinic,
    // Additional fields for drawer/modal
    slotId: appointment.slotId,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    notes: appointment.notes,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    createdAt: createdAt.toISOString(),
  };
}

/**
 * Transform array of appointments to UI format
 */
export function transformDoctorAppointmentsToUI(
  appointments: DoctorAppointmentResponse[]
): DoctorAppointmentUI[] {
  return appointments.map(transformDoctorAppointmentToUI);
}

/**
 * Determine which tab an appointment belongs to based on its status
 */
export function getAppointmentTab(
  status: string
): 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'No-show' {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const _todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  if (status === 'COMPLETED') {
    return 'Completed';
  }
  if (status === 'CANCELLED') {
    return 'Cancelled';
  }
  if (status === 'NO_SHOW') {
    return 'No-show';
  }
  // For SCHEDULED/CONFIRMED, check if it's today
  // Note: This is a simplified check - in reality you'd compare the appointment date
  // For now, we'll use a simple approach: if status is SCHEDULED or CONFIRMED, it could be Today or Upcoming
  // The actual tab assignment should be based on the appointment date
  return 'Upcoming'; // Default, will be overridden by date-based logic in the component
}

/**
 * Get appointment tab based on appointment date and status
 */
export function getAppointmentTabByDate(
  appointment: DoctorAppointmentUI
): 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'No-show' {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const appointmentDate = new Date(appointment.startTime);

  if (appointment.status === 'Completed') {
    return 'Completed';
  }
  if (appointment.status === 'Cancelled') {
    return 'Cancelled';
  }
  if (appointment.status === 'No-show') {
    return 'No-show';
  }
  // Check if appointment is today
  if (appointmentDate >= todayStart && appointmentDate < todayEnd) {
    return 'Today';
  }
  // Check if appointment is in the past (backdated) - should be treated as Completed
  if (appointmentDate < todayStart) {
    return 'Completed';
  }
  // Future appointment
  return 'Upcoming';
}

// Type for the transformed UI data (matches the DoctorAppointment interface in the components)
export interface DoctorAppointmentUI {
  id: string;
  patient: string;
  initials: string;
  time: string;
  symptoms: string;
  status: 'Confirmed' | 'Checked in' | 'Completed' | 'Cancelled' | 'No-show';
  payment: 'Pending' | 'Paid' | 'Refunded';
  date: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  specialty: string;
  clinic: string;
  // Additional fields for drawer/modal
  slotId: string;
  doctorId: string;
  patientId: string;
  notes?: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
}
