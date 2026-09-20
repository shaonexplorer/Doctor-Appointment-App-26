/**
 * Prescription Repository
 * Data access layer for Prescription operations
 */

import type { PrismaClient, Prescription, Prisma } from '@prisma/client';
import type { PaginationParams, PaginatedResponse } from '@doctor-appointment-app/shared';
// Prisma is already imported as a namespace from '@prisma/client'

export interface PrescriptionWithRelations extends Omit<Prescription, 'appointment'> {
  appointment: {
    id: string;
    slot: {
      startTime: Date;
      endTime: Date;
    };
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

export class PrescriptionRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find prescription by ID with relations
   */
  async findById(id: string): Promise<PrescriptionWithRelations | null> {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            slot: {
              select: { startTime: true, endTime: true },
            },
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
            doctor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    }) as Promise<PrescriptionWithRelations | null>;
  }

  /**
   * Create prescription
   */
  async create(data: {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    diagnosis: string;
    medications: Prisma.InputJsonValue; // JSON array of medications
    tests?: string | null;
    notes?: string | null;
    pdfUrl?: string | null;
  }): Promise<Prescription> {
    return this.prisma.prescription.create({
      data,
    });
  }

  /**
   * Update prescription
   */
  async update(id: string, data: Prisma.PrescriptionUpdateInput): Promise<Prescription> {
    return this.prisma.prescription.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete prescription
   */
  async delete(id: string): Promise<void> {
    await this.prisma.prescription.delete({ where: { id } });
  }

  /**
   * Find prescriptions with pagination
   */
  async findMany(
    filters: {
      doctorId?: string;
      patientId?: string;
      appointmentId?: string;
    },
    params: PaginationParams
  ): Promise<PaginatedResponse<PrescriptionWithRelations>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PrescriptionWhereInput = {};
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.appointmentId) where.appointmentId = filters.appointmentId;

    const [prescriptions, total] = await Promise.all([
      this.prisma.prescription.findMany({
        skip,
        take: limit,
        where,
        include: {
          appointment: {
            include: {
              slot: {
                select: { startTime: true, endTime: true },
              },
              patient: {
                select: { id: true, firstName: true, lastName: true },
              },
              doctor: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      data: prescriptions as PrescriptionWithRelations[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find prescriptions by appointment ID
   */
  async findByAppointmentId(appointmentId: string): Promise<Prescription[]> {
    return this.prisma.prescription.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find prescriptions by doctor ID
   */
  async findByDoctorId(doctorId: string, limit: number = 10): Promise<Prescription[]> {
    return this.prisma.prescription.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Find prescriptions by patient ID
   */
  async findByPatientId(patientId: string, limit: number = 10): Promise<Prescription[]> {
    return this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent prescriptions for a doctor
   */
  async getRecentByDoctor(
    doctorId: string,
    limit: number = 5
  ): Promise<PrescriptionWithRelations[]> {
    return this.prisma.prescription.findMany({
      where: { doctorId },
      include: {
        appointment: {
          include: {
            slot: {
              select: { startTime: true, endTime: true },
            },
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
            doctor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as Promise<PrescriptionWithRelations[]>;
  }

  /**
   * Get recent prescriptions for a patient
   */
  async getRecentByPatient(
    patientId: string,
    limit: number = 5
  ): Promise<PrescriptionWithRelations[]> {
    return this.prisma.prescription.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            slot: {
              select: { startTime: true, endTime: true },
            },
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
            doctor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as Promise<PrescriptionWithRelations[]>;
  }
}
