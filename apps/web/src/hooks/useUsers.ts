'use client';

/**
 * TanStack Query hooks for user management (Admin/Staff Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  userApi,
  type UserListItem,
  type PaginatedResponse,
  type UserProfile,
} from '@/lib/api';

// Query keys for consistent caching
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number; search?: string; userType?: string }) =>
    [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// Re-export types for consumers
export type { UserListItem, UserProfile, PaginatedResponse };

/**
 * Hook for fetching users with pagination, filters, sorting
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  userType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const { page = 1, limit = 20, ...restParams } = params;

  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.listUsers({ ...restParams, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single user detail (for Admin Drawer)
 */
export function useUserDetail(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(userId ?? ''),
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation hook for deleting a user (Admin only)
 * Invalidates the users list on success to refresh the data
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_userId: string) => {
      // TODO: Implement actual delete endpoint when available
      // await userApi.deleteUser(userId);
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate all user lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Mutation hook for updating user status (Admin only)
 * Invalidates the users list on success to refresh the data
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId: _userId, status: _status }: { userId: string; status: string }) => {
      // TODO: Implement actual update endpoint when available
      // await userApi.updateUserStatus(userId, status);
      return Promise.resolve();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Transform backend UserListItem to frontend AdminUser format
 * Maps API response to the UI component's expected data structure
 */
export function transformUserToAdminFormat(user: UserListItem): AdminUserData {
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

  // Determine status - since backend only has emailVerified, we'll derive status
  // ACTIVE if emailVerified, PENDING if not
  const status = user.emailVerified ? 'ACTIVE' : 'PENDING';

  // Get full name
  const name = `${user.firstName} ${user.lastName}`;

  // Get initials
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  // Get role from userType
  const role = user.userType as 'ADMIN' | 'STAFF' | 'DOCTOR' | 'PATIENT';

  // Phone formatting - ensure it has proper format
  const phone = user.phone || 'N/A';

  return {
    id: user.id,
    name,
    initials,
    email: user.email,
    phone,
    role,
    status,
    created: formattedCreated,
    activity: formattedActivity,
    // Raw data for drawer
    raw: user,
  };
}

/**
 * Transform array of users to admin format
 */
export function transformUsersToAdminFormat(users: UserListItem[]): AdminUserData[] {
  return users.map(transformUserToAdminFormat);
}

// Type for the transformed admin user data (matches the original seed data structure)
export interface AdminUserData {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'STAFF' | 'DOCTOR' | 'PATIENT';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  created: string;
  activity: string;
  raw: UserListItem;
}

/**
 * Get status badge tone based on status
 */
export function getStatusBadgeTone(status: AdminUserData['status']): 'green' | 'red' | 'amber' {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'SUSPENDED':
      return 'red';
    case 'PENDING':
    default:
      return 'amber';
  }
}

/**
 * Get role display label
 */
export function getRoleLabel(role: AdminUserData['role']): string {
  const labels: Record<AdminUserData['role'], string> = {
    ADMIN: 'Admin',
    STAFF: 'Staff',
    DOCTOR: 'Doctor',
    PATIENT: 'Patient',
  };
  return labels[role];
}