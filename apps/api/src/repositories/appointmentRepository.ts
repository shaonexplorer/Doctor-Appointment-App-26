/**
 * Appointment Repository
 * Data access layer for Appointment operations
 */

import type { PrismaClient, Appointment, PaymentStatus, ConsultationType } from '@prisma/client';
import { AppointmentStatus, UserType } from '@prisma/client';
import type { AppointmentFilters, PaginatedResponse } from '@doctor-appointment-app/shared';
import type { Prisma } from '@prisma/client';

export interface AppointmentWithRelations extends Omit<
  Appointment,
  'patient' | 'doctor' | 'slot' | 'prescriptions'
> {
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: UserType;
  };
  doctor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: UserType;
  };
  slot: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
  };
  prescriptions: Array<{
    id: string;
    diagnosis: string;
    createdAt: Date;
  }>;
}

export class AppointmentRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find appointment by ID with relations
   */
  async findById(id: string): Promise<AppointmentWithRelations | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            userType: true,
          },
        },
        doctor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            userType: true,
          },
        },
        slot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        },
        prescriptions: {
          select: {
            id: true,
            diagnosis: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Create appointment
   */
  async create(data: {
    patientId: string;
    doctorId: string;
    slotId: string;
    symptoms?: string | null;
    notes?: string | null;
    consultationType: ConsultationType;
    status?: AppointmentStatus;
    paymentStatus?: PaymentStatus;
  }): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
    });
  }

  /**
   * Update appointment
   */
  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete appointment
   */
  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }

  /**
   * Find appointments with filters and pagination
   */
  async findMany(
    filters: AppointmentFilters,
    userId?: string,
    userType?: UserType
  ): Promise<PaginatedResponse<AppointmentWithRelations>> {
    const { page, limit, status, dateFrom, dateTo, doctorId, patientId, sortBy, sortOrder } =
      filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {};

    // Apply user-based filtering
    if (userType === UserType.PATIENT && userId) {
      where.patientId = userId;
    } else if (userType === UserType.DOCTOR && userId) {
      where.doctorId = userId;
    } else if (userType === UserType.ADMIN || userType === UserType.STAFF) {
      // Admin/Staff can see all, apply additional filters
      if (doctorId) where.doctorId = doctorId;
      if (patientId) where.patientId = patientId;
    }

    if (status && status.length > 0) {
      where.status = { in: status };
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        skip,
        take: limit,
        where,
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              userType: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              userType: true,
            },
          },
          slot: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
          prescriptions: {
            select: {
              id: true,
              diagnosis: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get appointment by slot ID
   */
  async findBySlotId(slotId: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { slotId },
    });
  }

  /**
   * Count appointments for a doctor
   */
  async countByDoctor(doctorId: string, status?: AppointmentStatus[]): Promise<number> {
    return this.prisma.appointment.count({
      where: {
        doctorId,
        ...(status ? { status: { in: status } } : {}),
      },
    });
  }

  /**
   * Count appointments for a patient
   */
  async countByPatient(patientId: string, status?: AppointmentStatus[]): Promise<number> {
    return this.prisma.appointment.count({
      where: {
        patientId,
        ...(status ? { status: { in: status } } : {}),
      },
    });
  }

  /**
   * Get upcoming appointments for a user
   */
  async getUpcoming(
    userId: string,
    userType: UserType,
    limit: number = 5
  ): Promise<
    Array<{
      id: string;
      patientId: string;
      doctorId: string;
      slotId: string;
      status: AppointmentStatus;
      symptoms: string | null;
      notes: string | null;
      paymentStatus: PaymentStatus;
      consultationType: ConsultationType;
      createdAt: Date;
      updatedAt: Date;
      patient: { id: string; firstName: string; lastName: string };
      doctor: { id: string; firstName: string; lastName: string };
      slot: { id: string; startTime: Date; endTime: Date };
    }>
  > {
    const where: Prisma.AppointmentWhereInput = {
      status: { in: [AppointmentStatus.SCHEDULED] },
      slot: {
        startTime: { gte: new Date() },
      },
    };

    if (userType === UserType.PATIENT) {
      where.patientId = userId;
    } else if (userType === UserType.DOCTOR) {
      where.doctorId = userId;
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
        slot: {
          select: { id: true, startTime: true, endTime: true },
        },
      },
      orderBy: { slot: { startTime: 'asc' } },
      take: limit,
    });
  }

  /**
   * Get appointment statistics for a doctor
   */
  async getDoctorStats(doctorId: string): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }> {
    const [total, scheduled, completed, cancelled, noShow] = await Promise.all([
      this.prisma.appointment.count({ where: { doctorId } }),
      this.prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.SCHEDULED } }),
      this.prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.COMPLETED } }),
      this.prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.CANCELLED } }),
      this.prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.NO_SHOW } }),
    ]);

    return { total, scheduled, completed, cancelled, noShow };
  }

  /**
   * Get appointment statistics for a patient
   */
  async getPatientStats(patientId: string): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }> {
    const [total, scheduled, completed, cancelled, noShow] = await Promise.all([
      this.prisma.appointment.count({ where: { patientId } }),
      this.prisma.appointment.count({ where: { patientId, status: AppointmentStatus.SCHEDULED } }),
      this.prisma.appointment.count({ where: { patientId, status: AppointmentStatus.COMPLETED } }),
      this.prisma.appointment.count({ where: { patientId, status: AppointmentStatus.CANCELLED } }),
      this.prisma.appointment.count({ where: { patientId, status: AppointmentStatus.NO_SHOW } }),
    ]);

    return { total, scheduled, completed, cancelled, noShow };
  }
}
