'use client';

/**
 * TanStack Query hooks for doctor's patient data fetching (Doctor Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  patientApi,
  type DoctorPatientListItem,
  type DoctorPatientListResponse,
  type DoctorPatientFilters,
  type DoctorPatientDetail,
} from '@/lib/api';

// Query keys for consistent caching
export const doctorPatientKeys = {
  all: ['doctor-patients'] as const,
  lists: () => [...doctorPatientKeys.all, 'list'] as const,
  list: (filters: DoctorPatientFilters) => [...doctorPatientKeys.lists(), filters] as const,
  detail: (id: string) => [...doctorPatientKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type {
  DoctorPatientListItem,
  DoctorPatientListResponse,
  DoctorPatientFilters,
  DoctorPatientDetail,
};

/**
 * Hook for fetching doctor's patient list with pagination
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useDoctorPatients(filters: DoctorPatientFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: doctorPatientKeys.list(filters),
    queryFn: () => patientApi.getDoctorPatientList({ ...restFilters, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single patient detail (for Patient Drawer)
 */
export function useDoctorPatientDetail(patientId: string | undefined) {
  return useQuery({
    queryKey: doctorPatientKeys.detail(patientId ?? ''),
    queryFn: () => patientApi.getDoctorPatientDetail(patientId!),
    enabled: !!patientId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend DoctorPatientListItem to frontend Patient format
 * Maps API response to the UI component's expected data structure
 */
export function transformPatientToUI(patient: DoctorPatientListItem): PatientUI {
  // Calculate age from DOB
  let age = 0;
  if (patient.dob) {
    const dob = new Date(patient.dob);
    const today = new Date();
    age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  }

  // Get initials
  const initials = `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase();

  // Format last visit
  const lastVisit = patient.lastVisit
    ? new Date(patient.lastVisit).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  // Format next appointment
  const nextAppointment = patient.nextAppointment
    ? new Date(patient.nextAppointment).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—';

  // Get primary condition (first one)
  const condition = patient.conditions[0] || 'No conditions';

  // Determine status
  let status: 'Confirmed' | 'Pending' | 'Completed' = 'Completed';
  if (patient.nextAppointment) {
    const nextApptDate = new Date(patient.nextAppointment);
    if (nextApptDate > new Date()) {
      status = 'Confirmed';
    }
  } else if (patient.lastVisit) {
    const lastVisitDate = new Date(patient.lastVisit);
    const diffDays = Math.floor(
      (new Date().getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 30) {
      status = 'Pending';
    }
  }

  return {
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`,
    initials,
    age,
    lastVisit,
    diagnosis: condition,
    nextAppointment,
    totalVisits: patient.totalAppointments,
    condition,
    status,
  };
}

/**
 * Transform array of patients to UI format
 */
export function transformPatientsToUI(patients: DoctorPatientListItem[]): PatientUI[] {
  return patients.map(transformPatientToUI);
}

/**
 * Get unique conditions from patient list for filter dropdown
 */
export function getConditionsFromPatients(patients: DoctorPatientListItem[]): string[] {
  const conditions = new Set<string>();
  patients.forEach((p) => {
    p.conditions.forEach((c) => conditions.add(c));
  });
  return Array.from(conditions).sort();
}

/**
 * Get unique statuses for filter dropdown
 * Based on the UI status values
 */
export const PATIENT_STATUSES = ['Confirmed', 'Pending', 'Completed'] as const;

// Type for the transformed UI data (matches Patient from PatientDirectory types)
export interface PatientUI {
  id: string;
  name: string;
  initials: string;
  age: number;
  lastVisit: string;
  diagnosis: string;
  nextAppointment: string;
  totalVisits: number;
  condition: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}
