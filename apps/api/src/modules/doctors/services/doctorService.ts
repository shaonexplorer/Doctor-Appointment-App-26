/**
 * Doctor Service
 * Business logic for doctor operations
 */

import type { DoctorRepository } from '../../../repositories';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  DoctorProfileCreateInput,
  DoctorProfileUpdateInput,
  DoctorSearchFilters,
  DoctorProfile,
  DoctorSearchResult,
  DoctorSchedule,
} from '../types';

export class DoctorService {
  constructor(private doctorRepository: DoctorRepository) {}

  /**
   * Search doctors with filters
   */
  async searchDoctors(
    filters: DoctorSearchFilters
  ): Promise<{ data: DoctorSearchResult[]; meta: { total: number; totalPages: number } }> {
    const result = await this.doctorRepository.search(filters);
    return {
      data: result.data.map(this.mapToSearchResult),
      meta: result.meta,
    };
  }

  /**
   * Full-text search doctors (dedicated search endpoint)
   * Uses PostgreSQL tsvector/tsquery with materialized view for performance
   */
  async fullTextSearchDoctors(
    filters: DoctorSearchFilters
  ): Promise<{ data: DoctorSearchResult[]; meta: { total: number; totalPages: number } }> {
    const result = await this.doctorRepository.fullTextSearch(filters);
    return {
      data: result.data.map(this.mapToSearchResult),
      meta: result.meta,
    };
  }

  private mapToSearchResult(doctor: any): DoctorSearchResult {
    return {
      ...doctor,
      fee: typeof doctor.fee === 'object' && doctor.fee !== null ? Number(doctor.fee) : Number(doctor.fee),
    };
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(id: string): Promise<DoctorProfile> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new AppError('NOT_FOUND', 'Doctor not found', 404);
    }
    return {
      ...doctor,
      fee: typeof doctor.fee === 'object' && doctor.fee !== null ? Number(doctor.fee) : Number(doctor.fee),
    };
  }

  /**
   * Get doctor profile for authenticated doctor
   */
  async getMyProfile(userId: string): Promise<DoctorProfile> {
    const doctor = await this.doctorRepository.findByUserIdWithUser(userId);
    if (!doctor) {
      throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
    }
    return {
      ...doctor,
      fee: typeof doctor.fee === 'object' && doctor.fee !== null ? Number(doctor.fee) : Number(doctor.fee),
    };
  }

  /**
   * Create doctor profile
   */
  async createProfile(userId: string, data: DoctorProfileCreateInput): Promise<DoctorProfile> {
    // Check if profile already exists
    const existingProfile = await this.doctorRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError('CONFLICT', 'Doctor profile already exists', 409);
    }

    // Check if license number is unique
    const licenseExists = await this.doctorRepository.licenseExists(data.licenseNo);
    if (licenseExists) {
      throw new AppError('CONFLICT', 'License number already registered', 409);
    }

    const createData = {
      userId,
      specialty: data.specialty,
      designation: data.designation,
      licenseNo: data.licenseNo,
      bio: data.bio ?? null,
      fee: data.fee,
    };
    const created = await this.doctorRepository.create(createData);
    return {
      ...created,
      fee: typeof created.fee === 'object' && created.fee !== null ? Number(created.fee) : Number(created.fee),
    } as DoctorProfile;
  }

  /**
   * Update doctor profile
   */
  async updateProfile(userId: string, data: DoctorProfileUpdateInput): Promise<DoctorProfile> {
    // Check if profile exists
    const existingProfile = await this.doctorRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
    }

    // Check license number uniqueness if being updated
    if (data.licenseNo && data.licenseNo !== existingProfile.licenseNo) {
      const licenseExists = await this.doctorRepository.licenseExists(data.licenseNo);
      if (licenseExists) {
        throw new AppError('CONFLICT', 'License number already registered', 409);
      }
    }

    const updateData: Record<string, any> = {};
    if (data.specialty !== undefined) updateData.specialty = data.specialty;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.licenseNo !== undefined) updateData.licenseNo = data.licenseNo;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.fee !== undefined) updateData.fee = data.fee;

    const updated = await this.doctorRepository.update(userId, updateData);
    return {
      ...updated,
      fee: typeof updated.fee === 'object' && updated.fee !== null ? Number(updated.fee) : Number(updated.fee),
    } as DoctorProfile;
  }

  /**
   * Get doctor schedule
   */
  async getSchedule(doctorId: string, startDate?: Date, endDate?: Date): Promise<DoctorSchedule[]> {
    const schedules = await this.doctorRepository.getSchedule(doctorId, startDate, endDate);
    return schedules as DoctorSchedule[];
  }
}

// Factory function for dependency injection
export function createDoctorService(doctorRepository: DoctorRepository): DoctorService {
  return new DoctorService(doctorRepository);
}
