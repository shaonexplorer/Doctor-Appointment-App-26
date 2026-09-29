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
  searchVector: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: string;
    emailVerified: boolean;
  };
  schedules?: Array<{
    id: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface DoctorSearchResult {
  id: string;
  userId: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number;
  isVerified: boolean;
  searchVector: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: string;
    emailVerified: boolean;
  };
  schedules?: Array<{
    id: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { DoctorSearchFilters, DoctorProfileCreateInput, DoctorProfileUpdateInput };
