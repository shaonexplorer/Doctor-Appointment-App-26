'use client';

/**
 * TanStack Query hooks for patient appointments
 * Provides caching, pagination, and filtering functionality
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  appointmentApi,
  type AppointmentFilters,
  type AppointmentResponse,
  type PaginatedAppointmentsResponse,
  type PatientDashboardStats,
  type MedicalTimelineResponse,
  type AppointmentCreateInput,
} from '@/lib/api';

// Query keys for consistent caching
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  dashboardStats: () => [...appointmentKeys.all, 'dashboardStats'] as const,
  medicalTimeline: (filters?: AppointmentFilters) =>
    [...appointmentKeys.all, 'timeline', 'medical', filters] as const,
  upcoming: (limit?: number) => [...appointmentKeys.all, 'upcoming', limit] as const,
  completed: (limit?: number) => [...appointmentKeys.all, 'completed', limit] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type {
  AppointmentFilters,
  AppointmentResponse,
  PaginatedAppointmentsResponse,
  PatientDashboardStats,
  MedicalTimelineResponse,
  AppointmentCreateInput,
};

/**
 * Hook for fetching patient dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: appointmentKeys.dashboardStats(),
    queryFn: () => appointmentApi.getDashboardStats(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching patient medical timeline
 */
export function useMedicalTimeline(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: appointmentKeys.medicalTimeline(filters),
    queryFn: () => appointmentApi.getMedicalTimeline(filters),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching upcoming appointments with details
 */
export function useUpcomingAppointments(limit = 10) {
  return useQuery({
    queryKey: appointmentKeys.upcoming(limit),
    queryFn: () => appointmentApi.getUpcomingWithDetails(limit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching completed appointments with prescriptions
 */
export function useCompletedAppointments(limit = 10) {
  return useQuery({
    queryKey: appointmentKeys.completed(limit),
    queryFn: () => appointmentApi.getCompletedWithPrescriptions(limit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for listing appointments with filters and pagination
 */
export function useAppointments(filters: AppointmentFilters) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentApi.listAppointments(filters),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for booking a new appointment (Staff/Patient)
 */
export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AppointmentCreateInput) => appointmentApi.bookAppointment(input),
    onSuccess: () => {
      // Invalidate all appointment queries to refetch fresh data
      void queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to book appointment:', error);
    },
  });
}

/**
 * Hook for cancelling an appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentApi.cancelAppointment(id),
    onSuccess: () => {
      // Invalidate all appointment queries to refetch fresh data
      void queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to cancel appointment:', error);
    },
  });
}

/**
 * Hook for rescheduling an appointment
 */
export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, slotId }: { id: string; slotId: string }) =>
      appointmentApi.rescheduleAppointment(id, { slotId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      console.error('Failed to reschedule appointment:', error);
    },
  });
}

/**
 * Transform backend AppointmentResponse to frontend Appointment format
 * Maps API response to the UI component's expected data structure
 */
export function transformAppointmentToUI(appointment: AppointmentResponse): AppointmentUI {
  const startTime = new Date(appointment.slot.startTime);
  const createdAt = new Date(appointment.createdAt);

  // Format date as "Thu, Sep 24, 2026"
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format time as "10:30" (24-hour format for AppointmentDrawer compatibility)
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Map status from backend to frontend format
  const statusMap: Record<string, 'Confirmed' | 'Completed' | 'Cancelled' | 'Scheduled'> = {
    SCHEDULED: 'Scheduled',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'Cancelled',
  };

  // Map payment status
  const paymentMap: Record<string, 'Pending' | 'Paid' | 'Refunded'> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    REFUNDED: 'Refunded',
  };

  // Determine tab based on status
  let tab: 'Upcoming' | 'Completed' | 'Cancelled';
  if (appointment.status === 'COMPLETED') {
    tab = 'Completed';
  } else if (appointment.status === 'CANCELLED' || appointment.status === 'NO_SHOW') {
    tab = 'Cancelled';
  } else {
    tab = 'Upcoming';
  }

  // Get clinic from doctor profile or use default
  const clinic = appointment.doctorProfile?.clinic || 'Clinic not specified';

  // Get prescription filename if available
  const prescription =
    appointment.prescriptions && appointment.prescriptions.length > 0
      ? `Prescription_${appointment.id}.pdf`
      : undefined;

  return {
    id: appointment.id,
    doctor: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    specialty: appointment.doctorProfile?.specialty || 'General Medicine',
    date: formattedDate,
    time: formattedTime,
    clinic,
    status: statusMap[appointment.status] || 'Scheduled',
    payment: paymentMap[appointment.paymentStatus] || 'Pending',
    symptoms: appointment.symptoms || 'No symptoms recorded',
    prescription,
    consultationType: appointment.consultationType as 'IN_PERSON' | 'VIDEO' | 'PHONE',
    tab,
    // Additional fields for drawer/modal
    slotId: appointment.slotId,
    doctorId: appointment.doctorId,
    notes: appointment.notes,
    createdAt: createdAt.toISOString(),
  };
}

/**
 * Transform array of appointments to UI format
 */
export function transformAppointmentsToUI(appointments: AppointmentResponse[]): AppointmentUI[] {
  return appointments.map(transformAppointmentToUI);
}

/**
 * Transform backend AppointmentResponse to frontend AdminAppointment format
 * Maps API response to the admin appointments workspace UI data structure
 */
export function transformAppointmentToAdminFormat(
  appointment: AppointmentResponse
): AdminAppointmentData {
  const startTime = new Date(appointment.slot.startTime);
  const createdAt = new Date(appointment.createdAt);

  // Format date as "Thu, Sep 24, 2026"
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format time as "10:30 AM"
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Get full names and initials
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  const patientInitials = `${appointment.patient.firstName.charAt(0)}${appointment.patient.lastName.charAt(0)}`.toUpperCase();
  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

  // Get clinic from doctor profile or use default
  const clinic = appointment.doctorProfile?.clinic || 'Clinic not specified';

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    patientName,
    patientInitials,
    patientEmail: appointment.patient.email,
    patientPhone: appointment.patient.phone || 'N/A',
    doctorId: appointment.doctorId,
    doctorName,
    specialty: appointment.doctorProfile?.specialty || 'General Medicine',
    date: formattedDate,
    time: formattedTime,
    status: appointment.status,
    paymentStatus: appointment.paymentStatus,
    consultationType: appointment.consultationType,
    symptoms: appointment.symptoms || 'No symptoms recorded',
    notes: appointment.notes,
    clinic,
    created: createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    // Raw data for drawer
    raw: appointment,
  };
}

/**
 * Transform array of appointments to admin format
 */
export function transformAppointmentsToAdminFormat(
  appointments: AppointmentResponse[]
): AdminAppointmentData[] {
  return appointments.map(transformAppointmentToAdminFormat);
}

// Type for the transformed admin appointment data (matches the AdminPatientData/AdminUserData pattern)
export interface AdminAppointmentData {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
  consultationType: string;
  symptoms: string;
  notes: string | null;
  clinic: string;
  created: string;
  raw: AppointmentResponse;
}

// Type for the transformed UI data (matches the Appointment interface in the page)
export interface AppointmentUI {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Scheduled';
  payment: 'Pending' | 'Paid' | 'Refunded';
  symptoms: string;
  prescription?: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  tab: 'Upcoming' | 'Completed' | 'Cancelled';
  // Additional fields for drawer/modal
  slotId: string;
  doctorId: string;
  notes?: string | null;
  createdAt: string;
}
