/**
 * Clinics Module Types
 * Type definitions for clinic management
 */

import type { ClinicStatus } from '@prisma/client';
import type { PaginationParams } from '@doctor-appointment-app/shared';

export interface Clinic {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  departments: number;
  doctors: number;
  status: ClinicStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicListItem {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  departments: number;
  doctors: number;
  status: ClinicStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicStats {
  total: number;
  byStatus: Record<ClinicStatus, number>;
}

export type { PaginationParams };

export interface ClinicCreateInput {
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: ClinicStatus;
}

export interface ClinicUpdateInput {
  name?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  departments?: number;
  doctors?: number;
  status?: ClinicStatus;
}

export interface ClinicFilters extends PaginationParams {
  search?: string;
  status?: ClinicStatus;
}
