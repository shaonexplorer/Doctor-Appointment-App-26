/**
 * TanStack Query hooks for staff appointments (Staff Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  appointmentApi,
  type DoctorAppointmentResponse,
  type PaginatedDoctorAppointmentsResponse,
  type DoctorAppointmentFilters,
} from '@/lib/api';

// Query keys for consistent caching
export const staffAppointmentKeys = {
  all: ['staff-appointments'] as const,
  lists: () => [...staffAppointmentKeys.all, 'list'] as const,
  list: (filters: DoctorAppointmentFilters) => [...staffAppointmentKeys.lists(), filters] as const,
  detail: (id: string) => [...staffAppointmentKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type { DoctorAppointmentResponse, PaginatedDoctorAppointmentsResponse };

/**
 * Hook for fetching staff appointments with pagination and filters
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useStaffAppointments(filters: DoctorAppointmentFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: staffAppointmentKeys.list(filters),
    queryFn: () => appointmentApi.getDoctorAppointments({ ...restFilters, page, limit }),
    select: (data) => data.data, // Return the appointments array directly
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single appointment detail (for Staff Drawer)
 */
export function useStaffAppointmentDetail(appointmentId: string | undefined) {
  return useQuery({
    queryKey: staffAppointmentKeys.detail(appointmentId ?? ''),
    queryFn: () => appointmentApi.getDoctorAppointmentDetail(appointmentId!),
    select: transformStaffAppointmentToUI,
    enabled: !!appointmentId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend DoctorAppointmentResponse to frontend StaffAppointment format
 * Maps API response to the UI component's expected data structure
 */
export function transformStaffAppointmentToUI(appointment: DoctorAppointmentResponse) {
  const startTime = new Date(appointment.slot.startTime);
  const endTime = new Date(appointment.slot.endTime);

  // Format date as "Sep 18, 2026"
  const formattedDate = startTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format time as "9:00 AM" (12-hour format)
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Map status from backend to frontend format
  const statusMap: Record<string, 'Confirmed' | 'Checked in' | 'Completed' | 'Cancelled' | 'No-show'> = {
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
    consultationType: appointment.consultationType as 'IN_PERSON' | 'VIDEO',
    specialty,
    slotId: appointment.slotId,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    notes: appointment.notes,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    createdAt: appointment.createdAt,
  };
}

/**
 * Transform array of appointments to UI format
 */
export function transformStaffAppointmentsToUI(
  appointments: DoctorAppointmentResponse[]
): ReturnType<typeof transformStaffAppointmentToUI>[] {
  return appointments.map(transformStaffAppointmentToUI);
}