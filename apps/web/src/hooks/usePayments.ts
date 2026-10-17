'use client';

/**
 * TanStack Query hooks for payment management (Admin Portal)
 * Provides caching, pagination, search, and filtering for billing and payments.
 *
 * Reads are powered by the appointments API (each appointment carries
 * `paymentStatus` and the doctor's fee). Payment status updates and refunds
 * are mutation-ready; the backend endpoints for those mutations are to be
 * implemented per spec 05 (Billing & Payment Support).
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { PaymentStatus } from '@doctor-appointment-app/shared';
import {
  appointmentApi,
  type AppointmentFilters,
  type AppointmentResponse,
  type PaginatedAppointmentsResponse,
} from '@/lib/api';

// Query keys for consistent caching
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
};

// Re-export types for consumers
export type { AppointmentFilters, PaginatedAppointmentsResponse };

// Type for payment/billing filters (spec 5.3: filterable by payment status, date range, appointment type)
export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: 'All statuses' | PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  consultationType?: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook for fetching payments (appointments with billing info) with pagination,
 * search, date range, and consultation type filters. Payment status and
 * consultation type are applied client-side on the transformed data, matching
 * the pattern used by the admin appointments workspace (the backend list
 * endpoint does not yet expose those filters).
 */
export function usePayments(filters: PaymentFilters = {}) {
  const {
    page = 1,
    limit = 20,
    paymentStatus: _paymentStatusFilter,
    consultationType: _consultationTypeFilter,
    ...restFilters
  } = filters;

  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () =>
      appointmentApi.listAppointments({
        ...restFilters,
        page,
        limit,
        // dateFrom/dateTo/search are passed through to the backend endpoint
      }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Input for updating an appointment's payment status (spec 5.1).
 */
export interface UpdatePaymentStatusInput {
  id: string;
  paymentStatus: PaymentStatus;
}

/**
 * Mutation hook for updating an appointment's payment status (Admin/Staff).
 * Backend endpoint (PATCH /api/appointments/:id/payment-status) to be implemented.
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePaymentStatusInput) => {
      // TODO: await paymentApi.updatePaymentStatus(input.id, input.paymentStatus);
      return Promise.resolve(input);
    },
    onSuccess: () => {
      // Invalidate payment lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
    },
  });
}

/**
 * Input for initiating a refund (spec 5.2).
 */
export interface RefundInput {
  appointmentId: string;
  amount: number; // must be <= total appointment cost
  reason:
    | 'CANCELLATION_BY_PATIENT'
    | 'CANCELLATION_BY_DOCTOR'
    | 'INSURANCE'
    | 'PATIENT_REQUEST'
    | 'OTHER';
  notes?: string | null;
}

/**
 * Mutation hook for initiating a refund (spec 5.2).
 * Backend endpoint (POST /api/refunds) to be implemented.
 */
export function useInitiateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RefundInput) => {
      // TODO: await paymentApi.initiateRefund(input);
      return Promise.resolve(input);
    },
    onSuccess: () => {
      // Invalidate payment lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to initiate refund:', error);
    },
  });
}

/**
 * Transform backend AppointmentResponse to frontend AdminPayment format.
 * Maps API response to the UI component's expected billing data structure.
 */
export function transformAppointmentToPaymentFormat(
  appointment: AppointmentResponse
): AdminPaymentData {
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
  const patientInitials =
    `${appointment.patient.firstName.charAt(0)}${appointment.patient.lastName.charAt(0)}`.toUpperCase();
  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

  // Get fee from doctor profile
  const fee = appointment.doctorProfile?.fee ?? 0;
  const clinic = appointment.doctorProfile?.clinic || 'Clinic not specified';

  return {
    id: appointment.id,
    appointmentId: appointment.id,
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
    paymentStatus: appointment.paymentStatus as PaymentStatus,
    amount: fee,
    amountPaid: appointment.paymentStatus === 'PAID' ? fee : 0,
    amountRefunded: appointment.paymentStatus === 'REFUNDED' ? fee : 0,
    consultationType: appointment.consultationType,
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
 * Transform array of appointments to admin payment format
 */
export function transformAppointmentsToPaymentFormat(
  appointments: AppointmentResponse[]
): AdminPaymentData[] {
  return appointments.map(transformAppointmentToPaymentFormat);
}

// Type for the transformed admin payment data
export interface AdminPaymentData {
  id: string;
  appointmentId: string;
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
  paymentStatus: PaymentStatus;
  amount: number;
  amountPaid: number;
  amountRefunded: number;
  consultationType: string;
  clinic: string;
  created: string;
  raw: AppointmentResponse;
}

/**
 * Get payment status badge tone (Clinical Precision semantic colors)
 */
export function getPaymentStatusBadgeTone(status: PaymentStatus): 'emerald' | 'primary' | 'amber' {
  switch (status) {
    case PaymentStatus.PAID:
      return 'emerald';
    case PaymentStatus.REFUNDED:
      return 'primary';
    case PaymentStatus.PENDING:
    default:
      return 'amber';
  }
}

/**
 * Get payment status display label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pending',
    [PaymentStatus.PAID]: 'Paid',
    [PaymentStatus.REFUNDED]: 'Refunded',
  };
  return labels[status];
}
