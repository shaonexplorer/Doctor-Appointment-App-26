'use client';

/**
 * TanStack Query hooks for patient management (Admin Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { userApi, type UserListItem, type PaginatedResponse } from '@/lib/api';

// Query keys for consistent caching
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters: PatientSearchFilters) => [...patientKeys.lists(), filters] as const,
};

// Re-export types for consumers
export type { UserListItem, PaginatedResponse };

// Type for patient search filters (used with userApi.listUsers)
export interface PatientSearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'All statuses' | 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook for fetching patients with pagination, search, and status filter.
 * Uses keepPreviousData for smooth pagination transitions.
 *
 * The listUsers endpoint filters by userType only, so the status filter
 * (ACTIVE / PENDING / SUSPENDED) is applied client-side on the transformed data,
 * matching the pattern used by the admin doctors workspace.
 */
export function usePatients(filters: PatientSearchFilters = {}) {
  const { page = 1, limit = 20, status: _statusFilter, ...restFilters } = filters;

  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: () => userApi.listUsers({ ...restFilters, page, limit, userType: 'PATIENT' }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend UserListItem to frontend AdminPatient format
 * Maps API response to the UI component's expected data structure
 */
export function transformUserToPatientFormat(user: UserListItem): AdminPatientData {
  const createdDate = new Date(user.createdAt);
  const formattedCreated = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format last activity - use updatedAt as fallback for "last activity"
  const updatedDate = new Date(user.updatedAt);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  let formattedActivity: string;
  if (updatedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
    formattedActivity = `Today, ${updatedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (updatedDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
    formattedActivity = 'Yesterday';
  } else {
    formattedActivity = updatedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Determine status - ACTIVE if emailVerified, PENDING if not
  const status = user.emailVerified ? 'ACTIVE' : 'PENDING';

  // Get full name
  const name = `${user.firstName} ${user.lastName}`;

  // Get initials
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  // Patient profile info
  const patientProfile = user.patientProfile;
  const dateOfBirth = patientProfile?.dob
    ? new Date(patientProfile.dob).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';
  const gender = patientProfile?.gender || 'N/A';

  return {
    id: user.id,
    name,
    initials,
    email: user.email,
    phone: user.phone || 'N/A',
    role: user.userType as 'ADMIN' | 'STAFF' | 'DOCTOR' | 'PATIENT',
    status,
    created: formattedCreated,
    activity: formattedActivity,
    dateOfBirth,
    gender,
    patientId: user.id,
    // Raw data for drawer
    raw: user,
  };
}

/**
 * Transform array of users to admin patient format
 */
export function transformUsersToPatientFormat(users: UserListItem[]): AdminPatientData[] {
  return users.map(transformUserToPatientFormat);
}

// Type for the transformed admin patient data (matches the AdminUserData/AdminDoctorData pattern)
export interface AdminPatientData {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'STAFF' | 'DOCTOR' | 'PATIENT';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  created: string;
  activity: string;
  dateOfBirth: string;
  gender: string;
  patientId: string;
  raw: UserListItem;
}

/**
 * Get status badge tone based on status
 */
export function getPatientStatusBadgeTone(
  status: AdminPatientData['status']
): 'emerald' | 'amber' | 'rose' {
  switch (status) {
    case 'ACTIVE':
      return 'emerald';
    case 'SUSPENDED':
      return 'rose';
    case 'PENDING':
    default:
      return 'amber';
  }
}
