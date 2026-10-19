'use client';

/**
 * TanStack Query hooks for patient prescriptions (Patient Portal - Medical Records)
 * Provides caching, pagination, search, and sorting functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  prescriptionApi,
  type PatientPrescriptionFilters,
  type PaginatedPrescriptionsResponse,
  type PrescriptionResponse,
} from '@/lib/api';

// Query keys for consistent caching
export const patientPrescriptionKeys = {
  all: ['patient-prescriptions'] as const,
  lists: () => [...patientPrescriptionKeys.all, 'list'] as const,
  list: (filters: PatientPrescriptionFilters) =>
    [...patientPrescriptionKeys.lists(), filters] as const,
  detail: (id: string) => [...patientPrescriptionKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type { PatientPrescriptionFilters, PaginatedPrescriptionsResponse, PrescriptionResponse };

// Type for the transformed UI data used by PrescriptionList/PrescriptionPreview
export interface PatientPrescription {
  id: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medications: number;
  tests: string;
  created: string;
  // Rich fields used by PrescriptionPreview
  medicationsList: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  }>;
  testsList: string[];
  patient: string;
  appointmentId: string;
}

/**
 * Hook for fetching the current patient's prescriptions with server-side
 * pagination, search, and sorting. Uses keepPreviousData for smooth
 * pagination transitions.
 */
export function usePatientPrescriptions(filters: PatientPrescriptionFilters = {}) {
  const { page = 1, limit = 10, ...restFilters } = filters;

  return useQuery({
    queryKey: patientPrescriptionKeys.list(filters),
    queryFn: () => prescriptionApi.listPatientPrescriptions({ ...restFilters, page, limit }),
    select: (data) => ({
      ...data,
      data: data.data.map(transformPrescriptionToPatientUI),
    }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend PrescriptionResponse to frontend PatientPrescription format
 * Maps API response to the UI component's expected data structure
 */
export function transformPrescriptionToPatientUI(
  prescription: PrescriptionResponse
): PatientPrescription {
  const createdAt = new Date(prescription.createdAt);

  // Format date as "Aug 18, 2026"
  const formattedDate = createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Prisma stores medications as JSON; guard against non-array values at runtime
  const medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  }> = Array.isArray(prescription.medications)
    ? prescription.medications.map((m) => ({ ...m, instructions: m.instructions ?? null }))
    : [];

  // Tests are stored as a comma-separated string
  const testsList = prescription.tests
    ? prescription.tests
        .split(',')
        .map((test) => test.trim())
        .filter(Boolean)
    : [];

  const patientName = prescription.appointment
    ? `${prescription.appointment.patient.firstName} ${prescription.appointment.patient.lastName}`
    : 'Unknown Patient';
  const doctorName = prescription.appointment
    ? `Dr. ${prescription.appointment.doctor.firstName} ${prescription.appointment.doctor.lastName}`
    : 'Unknown Doctor';

  return {
    id: prescription.id,
    doctor: doctorName,
    date: formattedDate,
    diagnosis: prescription.diagnosis,
    medications: medications.length,
    tests: testsList.join(', '),
    created: formattedDate,
    medicationsList: medications,
    testsList,
    patient: patientName,
    appointmentId: prescription.appointmentId,
  };
}

/**
 * Transform array of prescriptions to UI format
 */
export function transformPrescriptionsToPatientUI(
  prescriptions: PrescriptionResponse[]
): PatientPrescription[] {
  return prescriptions.map(transformPrescriptionToPatientUI);
}
