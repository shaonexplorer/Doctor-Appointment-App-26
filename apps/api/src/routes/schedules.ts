/**
 * Schedule/Slot Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import type { AuthenticatedRequest } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import {
  SlotCreateSchema,
  BulkSlotCreateSchema,
  SlotUpdateSchema,
  PaginationParamsSchema,
} from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';
import { UserType, SlotStatus } from '@doctor-appointment-app/shared';

const router = Router();

// Create single slot (Doctor only)
router.post('/', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = SlotCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  // Verify doctor owns the profile
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  // Check for overlapping slots
  const existingSlot = await prisma.schedule.findFirst({
    where: {
      doctorId: doctorProfile.id,
      OR: [
        {
          startTime: { lt: new Date(parseResult.data.endTime) },
          endTime: { gt: new Date(parseResult.data.startTime) },
        },
      ],
      status: { not: SlotStatus.CANCELLED },
    },
  });

  if (existingSlot) {
    throw new AppError('CONFLICT', 'Slot overlaps with existing schedule', 409);
  }

  const slot = await prisma.schedule.create({
    data: {
      doctorId: doctorProfile.id,
      startTime: new Date(parseResult.data.startTime),
      endTime: new Date(parseResult.data.endTime),
      status: parseResult.data.status,
    },
  });

  res.status(201).json(buildSuccessResponse(slot));
});

// Bulk create slots (Doctor only)
router.post('/bulk', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = BulkSlotCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const data = parseResult.data;
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  const slots: any[] = [];
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);

  // Generate slots for each day in range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 = Sunday

    if (!data.daysOfWeek.includes(dayOfWeek)) continue;

    const dayStart = new Date(d);
    dayStart.setHours(startHour, startMinute, 0, 0);

    const dayEnd = new Date(d);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    let currentStart = new Date(dayStart);

    while (currentStart < dayEnd) {
      const currentEnd = new Date(currentStart.getTime() + data.slotDuration * 60000);

      if (currentEnd > dayEnd) break;

      // Check for conflicts
      const conflict = await prisma.schedule.findFirst({
        where: {
          doctorId: doctorProfile.id,
          startTime: { lt: currentEnd },
          endTime: { gt: currentStart },
          status: { not: SlotStatus.CANCELLED },
        },
      });

      if (!conflict) {
        slots.push({
          doctorId: doctorProfile.id,
          startTime: new Date(currentStart),
          endTime: new Date(currentEnd),
          status: SlotStatus.AVAILABLE,
        });
      }

      currentStart = new Date(currentEnd);
    }
  }

  if (slots.length === 0) {
    return res.json(
      buildSuccessResponse({ created: 0, message: 'No slots created (conflicts or invalid range)' })
    );
  }

  const created = await prisma.schedule.createMany({
    data: slots,
    skipDuplicates: true,
  });

  res.status(201).json(buildSuccessResponse({ created: created.count }));
});

// List slots for doctor
router.get('/', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
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

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  const where: any = { doctorId: doctorProfile.id };

  // Filter by status if provided
  if (req.query.status) {
    where.status = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    where.startTime = {};
    if (req.query.startDate) where.startTime.gte = new Date(req.query.startDate as string);
    if (req.query.endDate) where.startTime.lte = new Date(req.query.endDate as string);
  }

  const [slots, total] = await Promise.all([
    prisma.schedule.findMany({
      skip,
      take: limit,
      where,
      include: {
        appointment: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { startTime: 'asc' },
    }),
    prisma.schedule.count({ where }),
  ]);

  res.json(buildSuccessResponse(buildPaginatedResponse(slots, { page, limit }, total)));
});

// Update slot
router.patch('/:id', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = SlotUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  const slot = await prisma.schedule.findUnique({
    where: { id: req.params.id },
  });

  if (!slot || slot.doctorId !== doctorProfile.id) {
    throw new AppError('NOT_FOUND', 'Slot not found', 404);
  }

  // Check for conflicts if time is being changed
  if (parseResult.data.startTime || parseResult.data.endTime) {
    const newStart = parseResult.data.startTime
      ? new Date(parseResult.data.startTime)
      : slot.startTime;
    const newEnd = parseResult.data.endTime ? new Date(parseResult.data.endTime) : slot.endTime;

    const conflict = await prisma.schedule.findFirst({
      where: {
        id: { not: slot.id },
        doctorId: doctorProfile.id,
        startTime: { lt: newEnd },
        endTime: { gt: newStart },
        status: { not: SlotStatus.CANCELLED },
      },
    });

    if (conflict) {
      throw new AppError('CONFLICT', 'Slot overlaps with existing schedule', 409);
    }
  }

  const updated = await prisma.schedule.update({
    where: { id: req.params.id },
    data: {
      startTime: parseResult.data.startTime ? new Date(parseResult.data.startTime) : undefined,
      endTime: parseResult.data.endTime ? new Date(parseResult.data.endTime) : undefined,
      status: parseResult.data.status,
    },
  });

  res.json(buildSuccessResponse(updated));
});

// Delete slot
router.delete('/:id', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  const slot = await prisma.schedule.findUnique({
    where: { id: req.params.id },
    include: { appointment: true },
  });

  if (!slot || slot.doctorId !== doctorProfile.id) {
    throw new AppError('NOT_FOUND', 'Slot not found', 404);
  }

  if (slot.appointment) {
    throw new AppError('CONFLICT', 'Cannot delete slot with existing appointment', 409);
  }

  await prisma.schedule.delete({ where: { id: req.params.id } });
  res.json(buildSuccessResponse({ message: 'Slot deleted successfully' }));
});

export { router as scheduleRouter };
