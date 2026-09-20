/**
 * Schedule Repository
 * Data access layer for Schedule/Slot operations
 */

import type { PrismaClient, Schedule, Appointment } from '@prisma/client';
import { SlotStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export interface SlotWithAppointment extends Schedule {
  appointment: Appointment | null;
}

export class ScheduleRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find slot by ID
   */
  async findById(id: string): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  /**
   * Find slot by ID with appointment
   */
  async findByIdWithAppointment(id: string): Promise<SlotWithAppointment | null> {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: { appointment: true },
    });
  }

  /**
   * Create a single slot
   */
  async create(data: {
    doctorId: string;
    startTime: Date;
    endTime: Date;
    status?: SlotStatus;
  }): Promise<Schedule> {
    return this.prisma.schedule.create({
      data,
    });
  }

  /**
   * Create multiple slots in bulk
   */
  async createMany(
    slots: Array<{
      doctorId: string;
      startTime: Date;
      endTime: Date;
      status?: SlotStatus;
    }>
  ): Promise<number> {
    const result = await this.prisma.schedule.createMany({
      data: slots,
      skipDuplicates: true,
    });
    return result.count;
  }

  /**
   * Update slot
   */
  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete slot
   */
  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({ where: { id } });
  }

  /**
   * Get available slots for a doctor
   */
  async getAvailableSlots(doctorId: string, startDate?: Date, endDate?: Date): Promise<Schedule[]> {
    const where: Prisma.ScheduleWhereInput = {
      doctorId,
      status: SlotStatus.AVAILABLE,
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.schedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  /**
   * Get slots for a doctor (all statuses)
   */
  async getDoctorSlots(doctorId: string, startDate?: Date, endDate?: Date): Promise<Schedule[]> {
    const where: Prisma.ScheduleWhereInput = { doctorId };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.schedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  /**
   * Lock slot for booking (atomic update with status check)
   * Returns the slot if successfully locked, null if not available
   */
  async lockSlot(slotId: string, _patientId: string): Promise<SlotWithAppointment | null> {
    return this.prisma.$transaction(async (tx) => {
      // Find slot with FOR UPDATE equivalent (using pessimistic locking via transaction)
      const slot = await tx.schedule.findUnique({
        where: { id: slotId },
        include: { appointment: true },
      });

      if (!slot || slot.status !== SlotStatus.AVAILABLE) {
        return null;
      }

      // Update slot status to BOOKED
      const updatedSlot = await tx.schedule.update({
        where: { id: slotId },
        data: { status: SlotStatus.BOOKED },
        include: { appointment: true },
      });

      return updatedSlot;
    });
  }

  /**
   * Release slot (cancel booking)
   */
  async releaseSlot(slotId: string): Promise<Schedule> {
    return this.prisma.schedule.update({
      where: { id: slotId },
      data: { status: SlotStatus.AVAILABLE },
    });
  }

  /**
   * Check if slot exists and is available
   */
  async isSlotAvailable(slotId: string): Promise<boolean> {
    const slot = await this.prisma.schedule.findUnique({
      where: { id: slotId },
      select: { status: true },
    });
    return slot?.status === SlotStatus.AVAILABLE;
  }

  /**
   * Count available slots for a doctor
   */
  async countAvailableSlots(doctorId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const where: Prisma.ScheduleWhereInput = {
      doctorId,
      status: SlotStatus.AVAILABLE,
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.schedule.count({ where });
  }
}
