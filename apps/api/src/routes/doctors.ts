/**
 * Doctor Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import type { AuthenticatedRequest } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import {
  DoctorSearchFiltersSchema,
  DoctorProfileCreateSchema,
  DoctorProfileUpdateSchema,
} from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';
import { UserType } from '@doctor-appointment-app/shared';

const router = Router();

// Search doctors (public)
router.get('/', async (req: AuthenticatedRequest, res) => {
  const parseResult = DoctorSearchFiltersSchema.safeParse(req.query);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid query parameters',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const { page, limit, specialty, minFee, maxFee, availableFrom, availableTo, sortBy, sortOrder } =
    parseResult.data;
  const skip = (page - 1) * limit;

  const where: any = {
    user: {
      userType: UserType.DOCTOR,
    },
  };

  if (specialty) where.specialty = { contains: specialty, mode: 'insensitive' };
  if (minFee !== undefined || maxFee !== undefined) {
    where.fee = {};
    if (minFee !== undefined) where.fee.gte = minFee;
    if (maxFee !== undefined) where.fee.lte = maxFee;
  }

  const [doctors, total] = await Promise.all([
    prisma.doctorProfile.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            userType: true,
            emailVerified: true,
          },
        },
        schedules: {
          where: {
            status: 'AVAILABLE',
            startTime: {
              gte: availableFrom ? new Date(availableFrom) : new Date(),
              lte: availableTo ? new Date(availableTo) : undefined,
            },
          },
          orderBy: { startTime: 'asc' },
          take: 5,
        },
      },
      orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
    }),
    prisma.doctorProfile.count({ where }),
  ]);

  res.json(buildSuccessResponse(buildPaginatedResponse(doctors, { page, limit }, total)));
});

// Get doctor by ID (public)
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          userType: true,
          emailVerified: true,
        },
      },
      schedules: {
        where: {
          status: 'AVAILABLE',
          startTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  if (!doctor) {
    throw new AppError('NOT_FOUND', 'Doctor not found', 404);
  }

  res.json(buildSuccessResponse(doctor));
});

// Create doctor profile (Doctor only - for own profile)
router.post('/profile', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = DoctorProfileCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const existingProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (existingProfile) {
    throw new AppError('CONFLICT', 'Doctor profile already exists', 409);
  }

  const doctor = await prisma.doctorProfile.create({
    data: {
      userId: req.user!.id,
      ...parseResult.data,
    },
  });

  res.status(201).json(buildSuccessResponse(doctor));
});

// Get own doctor profile
router.get('/profile/me', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
    include: {
      user: true,
      schedules: {
        where: { startTime: { gte: new Date() } },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  if (!doctor) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  res.json(buildSuccessResponse(doctor));
});

// Update own doctor profile
router.patch(
  '/profile/me',
  requireRole(UserType.DOCTOR),
  async (req: AuthenticatedRequest, res) => {
    const parseResult = DoctorProfileUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid input',
        400,
        parseResult.error.flatten().fieldErrors
      );
    }

    const doctor = await prisma.doctorProfile.update({
      where: { userId: req.user!.id },
      data: parseResult.data,
    });

    res.json(buildSuccessResponse(doctor));
  }
);

// Get doctor schedule (for booking)
router.get('/:id/schedule', async (req: AuthenticatedRequest, res) => {
  const { startDate, endDate } = req.query;

  const where: any = {
    doctorId: req.params.id,
    status: 'AVAILABLE',
  };

  if (startDate) where.startTime = { ...where.startTime, gte: new Date(startDate as string) };
  if (endDate) where.startTime = { ...where.startTime, lte: new Date(endDate as string) };

  const slots = await prisma.schedule.findMany({
    where,
    orderBy: { startTime: 'asc' },
  });

  res.json(buildSuccessResponse(slots));
});

export { router as doctorRouter };
