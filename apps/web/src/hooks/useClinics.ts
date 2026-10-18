'use client';

/**
 * TanStack Query hooks for clinic management (Admin/Staff Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  clinicApi,
  type Clinic,
  type ClinicFilters,
  type ClinicCreateInput,
  type ClinicUpdateInput,
  type ClinicStats,
} from '@/lib/api';

// Query keys for consistent caching
export const clinicKeys = {
  all: ['clinics'] as const,
  lists: () => [...clinicKeys.all, 'list'] as const,
  list: (filters: ClinicFilters) => [...clinicKeys.lists(), filters] as const,
  detail: (id: string) => [...clinicKeys.all, 'detail', id] as const,
  stats: () => [...clinicKeys.all, 'stats'] as const,
};

// Re-export types for consumers
export type { Clinic, ClinicFilters, ClinicCreateInput, ClinicUpdateInput, ClinicStats };

/**
 * Hook for fetching clinics with pagination, filters, and sorting
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useClinics(params: ClinicFilters = {}) {
  const { page = 1, limit = 20, ...restParams } = params;

  return useQuery({
    queryKey: clinicKeys.list(params),
    queryFn: () => clinicApi.listClinics({ ...restParams, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single clinic by ID
 */
export function useClinic(id: string | undefined) {
  return useQuery({
    queryKey: clinicKeys.detail(id ?? ''),
    queryFn: () => clinicApi.getClinic(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching clinic statistics
 */
export function useClinicStats() {
  return useQuery({
    queryKey: clinicKeys.stats(),
    queryFn: () => clinicApi.getClinicStats(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation hook for creating a new clinic (Admin only)
 * Invalidates the clinics list on success to refresh the data
 */
export function useCreateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClinicCreateInput) => {
      return clinicApi.createClinic(data);
    },
    onSuccess: () => {
      // Invalidate all clinic lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: clinicKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: clinicKeys.stats() });
    },
  });
}

/**
 * Mutation hook for updating a clinic (Admin only)
 * Invalidates the clinics list and detail on success to refresh the data
 */
export function useUpdateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClinicUpdateInput }) => {
      return clinicApi.updateClinic(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate all clinic lists and the specific clinic detail
      void queryClient.invalidateQueries({ queryKey: clinicKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: clinicKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: clinicKeys.stats() });
    },
  });
}

/**
 * Mutation hook for deleting a clinic (Admin only)
 * Invalidates the clinics list on success to refresh the data
 */
export function useDeleteClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return clinicApi.deleteClinic(id);
    },
    onSuccess: () => {
      // Invalidate all clinic lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: clinicKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: clinicKeys.stats() });
    },
  });
}
