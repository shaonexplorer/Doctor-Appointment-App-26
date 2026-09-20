/**
 * Doctors Module Types
 * Type definitions for doctors module
 */

import type {
  DoctorSearchFilters,
  DoctorProfileCreateInput,
  DoctorProfileUpdateInput,
} from '@doctor-appointment-app/shared';

export interface DoctorProfile {
  id: string;
  userId: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    emailVerified: boolean;
  };
}

export interface DoctorSearchResult {
  id: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number;
  isVerified: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    emailVerified: boolean;
  };
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
}

export type { DoctorSearchFilters, DoctorProfileCreateInput, DoctorProfileUpdateInput };
