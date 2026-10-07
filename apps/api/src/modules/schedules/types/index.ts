/**
 * Schedules Module Types
 * Type definitions for schedules/slots module
 */

import type {
  SlotCreateInput,
  BulkSlotCreateInput,
  SlotUpdateInput,
} from '@doctor-appointment-app/shared';
import { SlotStatus } from '@prisma/client';

export interface ScheduleSlot {
  id: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  createdAt: Date;
  updatedAt: Date;
  doctor?: {
    id: string;
    specialty: string;
    designation: string | null;
    fee: number | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface BulkSlotResult {
  created: number;
  total: number;
}

export interface BulkSlotUpdateInput {
  slotIds: string[];
  status?: SlotStatus;
  startTime?: string;
  endTime?: string;
}

export interface BulkSlotUpdateResult {
  updated: number;
  total: number;
}

export interface WeeklyScheduleParams {
  weekStart: string;
}

export type { SlotCreateInput, BulkSlotCreateInput, SlotUpdateInput };
export { SlotStatus };
