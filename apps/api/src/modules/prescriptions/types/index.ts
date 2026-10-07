/**
 * Prescriptions Module Types
 * Type definitions for prescriptions module
 */

import type {
  PrescriptionCreateInput,
  PrescriptionUpdateInput,
} from '@doctor-appointment-app/shared';

// Medication type (matches shared schema)
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

// Prisma returns medications as JsonValue which can be null
export type PrismaMedications = Medication[] | null;

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medications: PrismaMedications;
  tests: string | null;
  notes: string | null;
  pdfUrl: string | null;
  createdAt: Date;
  updatedAt?: Date; // Not stored in DB currently
  appointment?: {
    id: string;
    slot?: {
      startTime: Date;
      endTime: Date;
    };
    startTime?: Date;
    endTime?: Date;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
    };
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

// Extended type with relations for internal use
export interface PrescriptionWithRelations extends Omit<Prescription, 'appointment'> {
  appointment?: {
    id: string;
    slot: {
      startTime: Date;
      endTime: Date;
    };
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export type { PrescriptionCreateInput, PrescriptionUpdateInput };
