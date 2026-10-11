'use client';

/**
 * TanStack Query hooks for staff patient search and management
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  userApi,
  patientApi,
  type UserListItem,
  type DoctorPatientListItem,
  type DoctorPatientFilters,
  type DoctorPatientListResponse,
  type PaginatedResponse,
} from '@/lib/api';

// Query keys for consistent caching
export const staffPatientSearchKeys = {
  all: ['staff-patient-search'] as const,
  lists: () => [...staffPatientSearchKeys.all, 'list'] as const,
  list: (filters: StaffPatientSearchFilters) => [...staffPatientSearchKeys.lists(), filters] as const,
  detail: (id: string) => [...staffPatientSearchKeys.all, 'detail', id] as const,
  staffList: (filters: DoctorPatientFilters) => [...staffPatientSearchKeys.all, 'staff-list', filters] as const,
};

// Re-export types for consumers
export type { UserListItem, DoctorPatientListItem, DoctorPatientListResponse, PaginatedResponse };

// Type for staff patient search filters (used with userApi.listUsers)
export interface StaffPatientSearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  userType?: 'PATIENT';
}

/**
 * Hook for searching patients with pagination (using userApi.listUsers)
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useStaffPatientSearch(filters: StaffPatientSearchFilters = {}) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: staffPatientSearchKeys.list(filters),
    queryFn: () => userApi.listUsers({ ...restFilters, page, limit, userType: 'PATIENT' }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching staff patient list (using patientApi.getStaffPatientList)
 * Returns data in DoctorPatientListItem format with medical info
 */
export function useStaffPatients(filters: DoctorPatientFilters = {}) {
  const { page = 1, limit = 50, ...restFilters } = filters;

  return useQuery({
    queryKey: staffPatientSearchKeys.staffList(filters),
    queryFn: () => patientApi.getStaffPatientList({ ...restFilters, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single patient detail
 */
export function useStaffPatientDetail(patientId: string | undefined) {
  return useQuery({
    queryKey: staffPatientSearchKeys.detail(patientId ?? ''),
    queryFn: () => userApi.getUserById(patientId!),
    enabled: !!patientId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend UserListItem to frontend Patient format for StaffBooking
 */
export function transformUserToPatient(user: UserListItem): StaffBookingPatient {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    patientId: user.id,
    phone: user.phone || '',
    email: user.email,
    // Add patient profile info if available
    dateOfBirth: user.patientProfile?.dob || null,
    gender: user.patientProfile?.gender || null,
  };
}

export function transformUsersToPatients(users: UserListItem[]): StaffBookingPatient[] {
  return users.map(transformUserToPatient);
}

// Type for the transformed patient data (matches what StaffBooking expects)
export interface StaffBookingPatient {
  id: string;
  name: string;
  patientId: string;
  phone: string;
  email: string;
  dateOfBirth: string | null;
  gender: string | null;
}