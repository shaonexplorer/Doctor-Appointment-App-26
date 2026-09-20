/**
 * Appointments Module Types
 * Type definitions for appointments module
 */

import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
} from '@doctor-appointment-app/shared';
import { AppointmentStatus, PaymentStatus, ConsultationType } from '@prisma/client';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  symptoms: string | null;
  notes: string | null;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  patient?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctor?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  slot?: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
  };
}

export interface DoctorStats {
  totalAppointments: number;
  byStatus: Record<AppointmentStatus, number>;
  byConsultationType: Record<ConsultationType, number>;
  totalRevenue: number;
  upcomingCount: number;
}

export interface PatientStats {
  totalAppointments: number;
  byStatus: Record<AppointmentStatus, number>;
  upcomingCount: number;
  totalSpent: number;
}

export type { AppointmentCreateInput, AppointmentUpdateInput, AppointmentFilters };
export { AppointmentStatus, PaymentStatus, ConsultationType };
