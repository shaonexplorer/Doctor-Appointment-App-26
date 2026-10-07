'use client';

/**
 * TanStack Query hooks for doctor prescriptions (Doctor Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  prescriptionApi,
  type PrescriptionCreateInput,
  type PrescriptionUpdateInput,
  type PrescriptionResponse,
  type PaginatedPrescriptionsResponse,
  type DoctorPrescriptionFilters,
} from '@/lib/api';

// Query keys for consistent caching
export const doctorPrescriptionKeys = {
  all: ['doctor-prescriptions'] as const,
  lists: () => [...doctorPrescriptionKeys.all, 'list'] as const,
  list: (filters: DoctorPrescriptionFilters) =>
    [...doctorPrescriptionKeys.lists(), filters] as const,
  detail: (id: string) => [...doctorPrescriptionKeys.all, 'detail', id] as const,
  recent: () => [...doctorPrescriptionKeys.all, 'recent'] as const,
  byAppointment: (appointmentId: string) =>
    [...doctorPrescriptionKeys.all, 'by-appointment', appointmentId] as const,
};

// Re-export types for consumers
export type {
  PrescriptionCreateInput,
  PrescriptionUpdateInput,
  PrescriptionResponse,
  PaginatedPrescriptionsResponse,
  DoctorPrescriptionFilters,
};

/**
 * Hook for fetching doctor's prescriptions with pagination and filters
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useDoctorPrescriptions(filters: DoctorPrescriptionFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: doctorPrescriptionKeys.list(filters),
    queryFn: () => prescriptionApi.listPrescriptions({ ...restFilters, page, limit }),
    select: (data) => ({
      ...data,
      data: transformPrescriptionsToUI(data.data),
    }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single prescription detail
 */
export function useDoctorPrescriptionDetail(prescriptionId: string | undefined) {
  return useQuery({
    queryKey: doctorPrescriptionKeys.detail(prescriptionId ?? ''),
    queryFn: () => prescriptionApi.getPrescription(prescriptionId!),
    select: transformPrescriptionToUI,
    enabled: !!prescriptionId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching recent prescriptions for doctor
 */
export function useDoctorRecentPrescriptions(limit = 5) {
  return useQuery({
    queryKey: [...doctorPrescriptionKeys.recent(), limit],
    queryFn: () => prescriptionApi.getRecentByDoctor(limit),
    select: transformPrescriptionsToUI,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching prescriptions by appointment
 */
export function usePrescriptionsByAppointment(appointmentId: string | undefined) {
  return useQuery({
    queryKey: doctorPrescriptionKeys.byAppointment(appointmentId ?? ''),
    queryFn: () => prescriptionApi.getPrescriptionsByAppointment(appointmentId!),
    select: transformPrescriptionsToUI,
    enabled: !!appointmentId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for creating a prescription
 */
export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PrescriptionCreateInput) => prescriptionApi.createPrescription(input),
    onSuccess: (_newPrescription) => {
      // Invalidate all prescription queries to refetch fresh data
      void queryClient.invalidateQueries({ queryKey: doctorPrescriptionKeys.all });
      // Also invalidate appointment queries since prescription affects appointment status
      void queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    },
    onError: (error) => {
      console.error('Failed to create prescription:', error);
    },
  });
}

/**
 * Hook for updating a prescription
 */
export function useUpdatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PrescriptionUpdateInput }) =>
      prescriptionApi.updatePrescription(id, input),
    onSuccess: (updatedPrescription) => {
      void queryClient.invalidateQueries({ queryKey: doctorPrescriptionKeys.all });
      // Update the specific prescription in cache
      queryClient.setQueryData(
        doctorPrescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      );
    },
    onError: (error) => {
      console.error('Failed to update prescription:', error);
    },
  });
}

/**
 * Hook for deleting a prescription
 */
export function useDeletePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => prescriptionApi.deletePrescription(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorPrescriptionKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete prescription:', error);
    },
  });
}

/**
 * Hook for downloading prescription PDF
 */
export function useDownloadPrescriptionPDF() {
  return useMutation({
    mutationFn: (id: string) => prescriptionApi.downloadPrescriptionPDF(id),
    onSuccess: (blob, prescriptionId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Failed to download prescription PDF:', error);
    },
  });
}

/**
 * Transform backend PrescriptionResponse to frontend PrescriptionUI format
 * Maps API response to the UI component's expected data structure
 */
export function transformPrescriptionToUI(prescription: PrescriptionResponse): PrescriptionUI {
  const createdAt = new Date(prescription.createdAt);

  // Format date as "Sep 18, 2026"
  const formattedDate = createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get patient name
  const patientName = prescription.appointment
    ? `${prescription.appointment.patient.firstName} ${prescription.appointment.patient.lastName}`
    : 'Unknown Patient';

  return {
    id: prescription.id,
    patient: patientName,
    diagnosis: prescription.diagnosis,
    medications: prescription.medications.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      instructions: med.instructions || '',
    })),
    tests: prescription.tests,
    notes: prescription.notes,
    date: formattedDate,
    appointmentId: prescription.appointmentId,
    doctorName: prescription.appointment
      ? `Dr. ${prescription.appointment.doctor.firstName} ${prescription.appointment.doctor.lastName}`
      : 'Unknown Doctor',
  };
}

/**
 * Transform array of prescriptions to UI format
 */
export function transformPrescriptionsToUI(
  prescriptions: PrescriptionResponse[]
): PrescriptionUI[] {
  return prescriptions.map(transformPrescriptionToUI);
}

// Type for the transformed UI data
export interface PrescriptionUI {
  id: string;
  patient: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  tests: string | null;
  notes: string | null;
  date: string;
  appointmentId: string;
  doctorName: string;
}
