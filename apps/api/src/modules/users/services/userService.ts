/**
 * User Service
 * Business logic for user operations
 */

import type { UserRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { UserType } from '@doctor-appointment-app/shared';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  UpdateProfileInput,
  PaginationParams,
  UserProfile,
  UserListItem,
  UserStats,
} from '../types';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Extract profile updates from UpdateProfileInput based on user type
   */
  private extractProfileUpdates(userType: UserType, data: UpdateProfileInput): Record<string, any> {
    const profileUpdates: Record<string, any> = {};

    if (userType === UserType.DOCTOR) {
      if (data.specialty !== undefined) profileUpdates.specialty = data.specialty;
      if (data.designation !== undefined) profileUpdates.designation = data.designation;
      if (data.licenseNo !== undefined) profileUpdates.licenseNo = data.licenseNo;
      if (data.bio !== undefined) profileUpdates.bio = data.bio;
      if (data.fee !== undefined) profileUpdates.fee = new Prisma.Decimal(data.fee);
    } else if (userType === UserType.PATIENT) {
      if (data.dob !== undefined) profileUpdates.dob = data.dob ? new Date(data.dob) : null;
      if (data.gender !== undefined) profileUpdates.gender = data.gender;
      if (data.address !== undefined) profileUpdates.address = data.address;
      if (data.emergencyContact !== undefined)
        profileUpdates.emergencyContact = data.emergencyContact;
    }

    return profileUpdates;
  }

  /**
   * Get user profile with related profiles
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    void _passwordHash;
    return userWithoutPassword as UserProfile;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    userType: UserType,
    data: UpdateProfileInput
  ): Promise<UserProfile> {
    // Build profile updates based on user type
    const profileUpdates = this.extractProfileUpdates(userType, data);

    // Extract user data (excluding profile-specific fields)
    const profileKeys = new Set([
      'specialty',
      'designation',
      'licenseNo',
      'bio',
      'fee',
      'dob',
      'gender',
      'address',
      'emergencyContact',
    ]);
    const userData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !profileKeys.has(key))
    );

    const updatedUser = await this.userRepository.updateWithProfiles(userId, {
      ...userData,
      doctorProfile:
        Object.keys(profileUpdates).length > 0 && userType === UserType.DOCTOR
          ? profileUpdates
          : undefined,
      patientProfile:
        Object.keys(profileUpdates).length > 0 && userType === UserType.PATIENT
          ? profileUpdates
          : undefined,
    });

    const { passwordHash: _passwordHash, ...userWithoutPassword } = updatedUser;
    void _passwordHash;
    return userWithoutPassword as UserProfile;
  }

  /**
   * Get user by ID (Admin/Staff)
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    void _passwordHash;
    return userWithoutPassword as UserProfile;
  }

  /**
   * List users with pagination (Admin/Staff)
   */
  async listUsers(
    params: PaginationParams
  ): Promise<{ data: UserListItem[]; meta: { total: number; totalPages: number } }> {
    const result = await this.userRepository.findMany(params);
    return {
      data: result.data.map(({ passwordHash: _passwordHash, ...user }) => user) as UserListItem[],
      meta: {
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string, requestingUserId: string): Promise<{ message: string }> {
    if (userId === requestingUserId) {
      throw new AppError('FORBIDDEN', 'Cannot delete yourself', 403);
    }

    await this.userRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  /**
   * Get user statistics (Admin/Staff)
   */
  async getUserStats(): Promise<UserStats> {
    const [totalUsers, totalDoctors, totalPatients, totalAdmins, totalStaff] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { userType: UserType.DOCTOR } }),
      this.prisma.user.count({ where: { userType: UserType.PATIENT } }),
      this.prisma.user.count({ where: { userType: UserType.ADMIN } }),
      this.prisma.user.count({ where: { userType: UserType.STAFF } }),
    ]);

    return {
      total: totalUsers,
      byType: {
        [UserType.ADMIN]: totalAdmins,
        [UserType.STAFF]: totalStaff,
        [UserType.DOCTOR]: totalDoctors,
        [UserType.PATIENT]: totalPatients,
      },
    };
  }
}

// Factory function for dependency injection
export function createUserService(
  userRepository: UserRepository,
  prisma: PrismaClient
): UserService {
  return new UserService(userRepository, prisma);
}
