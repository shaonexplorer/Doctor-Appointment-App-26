/**
 * Schedule Service
 * Business logic for schedule/slot operations
 */

import type { ScheduleRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { SlotStatus } from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  SlotCreateInput,
  BulkSlotCreateInput,
  SlotUpdateInput,
  ScheduleSlot,
  BulkSlotResult,
} from '../types';

export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Convert string datetime to Date
   */
  private toDate(value: string | Date | undefined): Date | undefined {
    if (value === undefined) return undefined;
    return value instanceof Date ? value : new Date(value);
  }

  /**
   * Create a single slot
   */
  async createSlot(doctorId: string, data: SlotCreateInput): Promise<ScheduleSlot> {
    // Verify doctor exists
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: data.doctorId },
      select: { id: true, userId: true },
    });

    if (!doctor) {
      throw new AppError('NOT_FOUND', 'Doctor not found', 404);
    }

    // Verify the authenticated user is the doctor
    if (doctor.userId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Cannot create slots for another doctor', 403);
    }

    const startTime = this.toDate(data.startTime)!;
    const endTime = this.toDate(data.endTime)!;

    // Check for overlapping slots
    const overlapping = await this.prisma.schedule.findFirst({
      where: {
        doctorId: data.doctorId,
        status: { not: SlotStatus.CANCELLED },
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });

    if (overlapping) {
      throw new AppError('CONFLICT', 'Slot overlaps with existing schedule', 409);
    }

    return this.scheduleRepository.create({
      doctorId: data.doctorId,
      startTime,
      endTime,
      status: data.status || SlotStatus.AVAILABLE,
    });
  }

  /**
   * Create bulk slots
   */
  async createBulkSlots(doctorId: string, data: BulkSlotCreateInput): Promise<BulkSlotResult> {
    // Verify doctor exists and user is the doctor
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: data.doctorId },
      select: { id: true, userId: true },
    });

    if (!doctor) {
      throw new AppError('NOT_FOUND', 'Doctor not found', 404);
    }

    if (doctor.userId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Cannot create slots for another doctor', 403);
    }

    const slots: Array<{
      doctorId: string;
      startTime: Date;
      endTime: Date;
      status: SlotStatus;
    }> = [];

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);

    // Generate slots for each day in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

      if (data.daysOfWeek.includes(dayOfWeek)) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMinute, 0, 0);

        const slotEnd = new Date(currentDate);
        slotEnd.setHours(endHour, endMinute, 0, 0);

        // Generate slots for the day
        let currentSlotStart = new Date(slotStart);
        while (currentSlotStart < slotEnd) {
          const currentSlotEnd = new Date(currentSlotStart);
          currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + data.slotDuration);

          if (currentSlotEnd <= slotEnd) {
            slots.push({
              doctorId: data.doctorId,
              startTime: new Date(currentSlotStart),
              endTime: new Date(currentSlotEnd),
              status: SlotStatus.AVAILABLE,
            });
          }

          currentSlotStart = new Date(currentSlotEnd);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (slots.length === 0) {
      throw new AppError('VALIDATION_ERROR', 'No slots generated for the given parameters', 400);
    }

    // Check for overlaps with existing slots
    const existingSlots = await this.prisma.schedule.findMany({
      where: {
        doctorId: data.doctorId,
        status: { not: SlotStatus.CANCELLED },
        startTime: { lt: new Date(data.endDate) },
        endTime: { gt: new Date(data.startDate) },
      },
      select: { startTime: true, endTime: true },
    });

    for (const newSlot of slots) {
      for (const existing of existingSlots) {
        if (newSlot.startTime < existing.endTime && newSlot.endTime > existing.startTime) {
          throw new AppError(
            'CONFLICT',
            `Slot overlaps with existing schedule at ${newSlot.startTime.toISOString()}`,
            409
          );
        }
      }
    }

    const created = await this.scheduleRepository.createMany(slots);
    return { created, total: slots.length };
  }

  /**
   * Get available slots for a doctor
   */
  async getAvailableSlots(
    doctorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScheduleSlot[]> {
    return this.scheduleRepository.getAvailableSlots(doctorId, startDate, endDate);
  }

  /**
   * Get all slots for a doctor (including booked/cancelled)
   */
  async getDoctorSlots(
    doctorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScheduleSlot[]> {
    return this.scheduleRepository.getDoctorSlots(doctorId, startDate, endDate);
  }

  /**
   * Update slot
   */
  async updateSlot(slotId: string, doctorId: string, data: SlotUpdateInput): Promise<ScheduleSlot> {
    const slot = await this.scheduleRepository.findById(slotId);
    if (!slot) {
      throw new AppError('NOT_FOUND', 'Slot not found', 404);
    }

    // Verify ownership
    if (slot.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', "Cannot update another doctor's slot", 403);
    }

    // Convert string dates to Date objects
    const updateData = {
      ...data,
      startTime: this.toDate(data.startTime),
      endTime: this.toDate(data.endTime),
    };

    // If updating time, check for overlaps
    if (updateData.startTime || updateData.endTime) {
      const newStart = updateData.startTime || slot.startTime;
      const newEnd = updateData.endTime || slot.endTime;

      if (newStart >= newEnd) {
        throw new AppError('VALIDATION_ERROR', 'Start time must be before end time', 400);
      }

      const overlapping = await this.prisma.schedule.findFirst({
        where: {
          doctorId: slot.doctorId,
          id: { not: slotId },
          status: { not: SlotStatus.CANCELLED },
          OR: [
            {
              startTime: { lt: newEnd },
              endTime: { gt: newStart },
            },
          ],
        },
      });

      if (overlapping) {
        throw new AppError('CONFLICT', 'Updated slot overlaps with existing schedule', 409);
      }
    }

    return this.scheduleRepository.update(slotId, updateData);
  }

  /**
   * Delete slot
   */
  async deleteSlot(slotId: string, doctorId: string): Promise<{ message: string }> {
    const slot = await this.scheduleRepository.findById(slotId);
    if (!slot) {
      throw new AppError('NOT_FOUND', 'Slot not found', 404);
    }

    // Verify ownership
    if (slot.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', "Cannot delete another doctor's slot", 403);
    }

    // Cannot delete booked slots
    if (slot.status === SlotStatus.BOOKED) {
      throw new AppError(
        'CONFLICT',
        'Cannot delete a booked slot. Cancel the appointment first.',
        409
      );
    }

    await this.scheduleRepository.delete(slotId);
    return { message: 'Slot deleted successfully' };
  }

  /**
   * Lock slot for booking
   */
  async lockSlot(slotId: string, patientId: string): Promise<ScheduleSlot> {
    const lockedSlot = await this.scheduleRepository.lockSlot(slotId, patientId);
    if (!lockedSlot) {
      throw new AppError('CONFLICT', 'Slot is no longer available', 409);
    }
    return lockedSlot;
  }

  /**
   * Release slot (cancel booking)
   */
  async releaseSlot(slotId: string): Promise<ScheduleSlot> {
    return this.scheduleRepository.releaseSlot(slotId);
  }
}

// Factory function for dependency injection
export function createScheduleService(
  scheduleRepository: ScheduleRepository,
  prisma: PrismaClient
): ScheduleService {
  return new ScheduleService(scheduleRepository, prisma);
}
