/**
 * User Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import type { AuthenticatedRequest } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { UpdateProfileSchema, PaginationParamsSchema } from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';
import { UserType } from '@doctor-appointment-app/shared';

const router = Router();

// Get current user profile
router.get('/me', async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      doctorProfile: true,
      patientProfile: true,
    },
  });

  if (!user) {
    throw new AppError('NOT_FOUND', 'User not found', 404);
  }

  const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
  void _passwordHash;
  res.json(buildSuccessResponse(userWithoutPassword));
});

// Update current user profile
router.patch('/me', async (req: AuthenticatedRequest, res) => {
  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const data = parseResult.data;
  const userId = req.user!.id;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
    include: {
      doctorProfile: true,
      patientProfile: true,
    },
  });

  // Update profile based on user type
  if (req.user!.userType === UserType.DOCTOR && user.doctorProfile) {
    await prisma.doctorProfile.update({
      where: { userId },
      data: {
        specialty: data.specialty,
        designation: data.designation,
        licenseNo: data.licenseNo,
        bio: data.bio,
        fee: data.fee,
      },
    });
  } else if (req.user!.userType === UserType.PATIENT && user.patientProfile) {
    await prisma.patientProfile.update({
      where: { userId },
      data: {
        dob: data.dob ? new Date(data.dob) : undefined,
        gender: data.gender,
        address: data.address,
        emergencyContact: data.emergencyContact,
      },
    });
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      doctorProfile: true,
      patientProfile: true,
    },
  });

  const { passwordHash: _passwordHash, ...userWithoutPassword } = updatedUser!;
  void _passwordHash;
  res.json(buildSuccessResponse(userWithoutPassword));
});

// Get user by ID (Admin/Staff only)
router.get(
  '/:id',
  requireRole(UserType.ADMIN, UserType.STAFF),
  async (req: AuthenticatedRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    void _passwordHash;
    res.json(buildSuccessResponse(userWithoutPassword));
  }
);

// List users (Admin/Staff only)
router.get(
  '/',
  requireRole(UserType.ADMIN, UserType.STAFF),
  async (req: AuthenticatedRequest, res) => {
    const parseResult = PaginationParamsSchema.safeParse(req.query);
    if (!parseResult.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid query parameters',
        400,
        parseResult.error.flatten().fieldErrors
      );
    }

    const { page, limit, sortBy, sortOrder } = parseResult.data;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
        include: {
          doctorProfile: true,
          patientProfile: true,
        },
      }),
      prisma.user.count(),
    ]);

    const usersWithoutPassword = users.map(({ passwordHash: _passwordHash, ...u }) => u);
    res.json(
      buildSuccessResponse(buildPaginatedResponse(usersWithoutPassword, { page, limit }, total))
    );
  }
);

// Delete user (Admin only)
router.delete('/:id', requireRole(UserType.ADMIN), async (req: AuthenticatedRequest, res) => {
  if (req.params.id === req.user!.id) {
    throw new AppError('FORBIDDEN', 'Cannot delete yourself', 403);
  }

  await prisma.user.delete({ where: { id: req.params.id } });
  res.json(buildSuccessResponse({ message: 'User deleted successfully' }));
});

export { router as userRouter };
