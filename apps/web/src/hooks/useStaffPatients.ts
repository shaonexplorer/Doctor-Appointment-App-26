'use client';

/**
 * TanStack Query hooks for staff patient data fetching (Staff Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  patientApi,
  type DoctorPatientListItem,
  type DoctorPatientListResponse,
  type DoctorPatientFilters,
} from '@/lib/api';

// Query keys for consistent caching
export const staffPatientKeys = {
  all: ['staff-patients'] as const,
  lists: () => [...staffPatientKeys.all, 'list'] as const,
  list: (filters: StaffPatientFilters) => [...staffPatientKeys.lists(), filters] as const,
  detail: (id: string) => [...staffPatientKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type {
  DoctorPatientListItem,
  DoctorPatientListResponse,
  DoctorPatientFilters,
};

// Type for staff patient filters
export interface StaffPatientFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'lastVisit' | 'nextAppointment' | 'name' | 'totalAppointments';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook for fetching staff patient list with pagination
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useStaffPatients(filters: StaffPatientFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: staffPatientKeys.list(filters),
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
export function useStaffPatientDetail(patientId: string | undefined) {
  return useQuery({
    queryKey: staffPatientKeys.detail(patientId ?? ''),
    queryFn: () => patientApi.getDoctorPatientDetail(patientId!),
    enabled: !!patientId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}