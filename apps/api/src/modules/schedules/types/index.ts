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
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface BulkSlotResult {
  created: number;
  total: number;
}

export type { SlotCreateInput, BulkSlotCreateInput, SlotUpdateInput };
export { SlotStatus };
