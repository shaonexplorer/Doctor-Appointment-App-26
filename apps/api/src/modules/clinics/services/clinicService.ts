/**
 * Clinic Service
 * Business logic for clinic operations
 */

import type { ClinicRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  Clinic,
  ClinicCreateInput,
  ClinicUpdateInput,
  ClinicFilters,
  ClinicStats,
} from '../types';

export class ClinicService {
  constructor(
    private clinicRepository: ClinicRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Get clinic by ID
   */
  async getClinic(id: string): Promise<Clinic> {
    const clinic = await this.clinicRepository.findById(id);
    if (!clinic) {
      throw new AppError('NOT_FOUND', 'Clinic not found', 404);
    }
    return clinic;
  }

  /**
   * List clinics with pagination, search, sorting, and filtering (Admin/Staff only)
   */
  async listClinics(
    params: ClinicFilters
  ): Promise<{ data: Clinic[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const result = await this.clinicRepository.findMany(params);
    return {
      data: result.data,
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Create a new clinic (Admin only)
   */
  async createClinic(data: ClinicCreateInput): Promise<Clinic> {
    // Check if clinic name already exists
    const nameExists = await this.clinicRepository.findByName(data.name);
    if (nameExists) {
      throw new AppError('CONFLICT', 'Clinic with this name already exists', 409);
    }

    return this.clinicRepository.create({
      name: data.name,
      address: data.address ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      status: data.status ?? 'ACTIVE',
    });
  }

  /**
   * Update clinic (Admin only)
   */
  async updateClinic(id: string, data: ClinicUpdateInput): Promise<Clinic> {
    const existing = await this.clinicRepository.findById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', 'Clinic not found', 404);
    }

    // Check name uniqueness if being changed
    if (data.name && data.name !== existing.name) {
      const nameExists = await this.clinicRepository.findByName(data.name);
      if (nameExists) {
        throw new AppError('CONFLICT', 'Clinic with this name already exists', 409);
      }
    }

    return this.clinicRepository.update(id, data);
  }

  /**
   * Delete clinic (Admin only)
   */
  async deleteClinic(id: string): Promise<{ message: string }> {
    const existing = await this.clinicRepository.findById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', 'Clinic not found', 404);
    }

    await this.clinicRepository.delete(id);
    return { message: 'Clinic deleted successfully' };
  }

  /**
   * Get clinic statistics (Admin/Staff only)
   */
  async getClinicStats(): Promise<ClinicStats> {
    return this.clinicRepository.getStats();
  }
}

// Factory function for dependency injection
export function createClinicService(
  clinicRepository: ClinicRepository,
  prisma: PrismaClient
): ClinicService {
  return new ClinicService(clinicRepository, prisma);
}
