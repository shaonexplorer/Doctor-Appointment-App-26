/**
 * Clinic Repository
 * Data access layer for Clinic operations
 */

import type { PrismaClient, Clinic, ClinicStatus } from '@prisma/client';
import type { PaginationParams, PaginatedResponse } from '@doctor-appointment-app/shared';

export class ClinicRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find clinic by ID
   */
  async findById(id: string): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({
      where: { id },
    });
  }

  /**
   * Find clinic by name
   * Note: `name` is indexed but not unique, so `findFirst` is used instead of `findUnique`.
   */
  async findByName(name: string): Promise<Clinic | null> {
    return this.prisma.clinic.findFirst({
      where: { name },
    });
  }

  /**
   * Create a new clinic
   */
  async create(data: {
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    status?: ClinicStatus;
  }): Promise<Clinic> {
    return this.prisma.clinic.create({
      data,
    });
  }

  /**
   * Update clinic
   */
  async update(
    id: string,
    data: {
      name?: string;
      address?: string | null;
      phone?: string | null;
      email?: string | null;
      departments?: number;
      doctors?: number;
      status?: ClinicStatus;
    }
  ): Promise<Clinic> {
    return this.prisma.clinic.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete clinic
   */
  async delete(id: string): Promise<void> {
    await this.prisma.clinic.delete({
      where: { id },
    });
  }

  /**
   * List clinics with pagination, search, and status filter
   */
  async findMany(params: PaginationParams & {
    search?: string;
    status?: ClinicStatus;
  }): Promise<PaginatedResponse<Clinic>> {
    const { page, limit, sortBy, sortOrder, search } = params;
    const status = (params as { status?: ClinicStatus }).status;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by search term if provided (searches name, address, email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [clinics, total] = await Promise.all([
      this.prisma.clinic.findMany({
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
        where,
      }),
      this.prisma.clinic.count({ where }),
    ]);

    return {
      data: clinics,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get clinic statistics
   */
  async getStats(): Promise<{ total: number; byStatus: Record<ClinicStatus, number> }> {
    const [total, byStatus] = await Promise.all([
      this.prisma.clinic.count(),
      this.prisma.clinic.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const byStatusRecord: Record<ClinicStatus, number> = {
      [ClinicStatus.ACTIVE]: 0,
      [ClinicStatus.INACTIVE]: 0,
    };

    for (const group of byStatus) {
      byStatusRecord[group.status] = group._count.status;
    }

    return { total, byStatus: byStatusRecord };
  }
}
