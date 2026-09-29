/**
 * Users Module Types
 * Type definitions for users module
 */

import type {
  UserType,
  UpdateProfileInput,
  PaginationParams,
} from '@doctor-appointment-app/shared';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: UserType;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  doctorProfile?: {
    id: string;
    specialty: string;
    designation: string;
    licenseNo: string;
    bio: string | null;
    fee: number;
    isVerified: boolean;
  } | null;
  patientProfile?: {
    id: string;
    dob: Date | null;
    gender: string | null;
    address: string | null;
    emergencyContact: string | null;
  } | null;
}

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: UserType;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  total: number;
  byType: Record<UserType, number>;
}

export type { UpdateProfileInput, PaginationParams };
