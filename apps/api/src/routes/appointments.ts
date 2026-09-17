/**
 * Appointment Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import type { AuthenticatedRequest } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
  AppointmentFiltersSchema,
} from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';
import { UserType, AppointmentStatus, SlotStatus } from '@doctor-appointment-app/shared';

const router = Router();

// Create appointment (Patient only)
router.post('/', requireRole(UserType.PATIENT), async (req: AuthenticatedRequest, res) => {
  const parseResult = AppointmentCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const data = parseResult.data;

  // Check slot availability and lock it atomically
  const slot = await prisma.schedule.findUnique({
    where: { id: data.slotId },
  });

  if (!slot) {
    throw new AppError('NOT_FOUND', 'Slot not found', 404);
  }

  if (slot.status !== SlotStatus.AVAILABLE) {
    throw new AppError('CONFLICT', 'Slot is not available', 409);
  }

  // Get patient profile
  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!patientProfile) {
    throw new AppError('NOT_FOUND', 'Patient profile not found', 404);
  }

  // Get doctor from slot
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { id: slot.doctorId },
    include: { user: true },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor not found', 404);
  }

  // Atomically create appointment and update slot
  const appointment = await prisma.$transaction(async (tx) => {
    // Update slot status to BOOKED
    await tx.schedule.update({
      where: { id: data.slotId },
      data: { status: SlotStatus.BOOKED },
    });

    // Create appointment
    return tx.appointment.create({
      data: {
        patientId: req.user!.id,
        doctorId: doctorProfile.userId,
        slotId: data.slotId,
        symptoms: data.symptoms,
        notes: data.notes,
        consultationType: data.consultationType,
        status: AppointmentStatus.SCHEDULED,
        paymentStatus: 'PENDING',
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        slot: true,
      },
    });
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'APPOINTMENT_CREATED',
      resource: 'Appointment',
      resourceId: appointment.id,
      newData: { slotId: data.slotId, symptoms: data.symptoms },
    },
  });

  res.status(201).json(buildSuccessResponse(appointment));
});

// Get appointment by ID
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        include: { patientProfile: true },
      },
      doctor: {
        select: { id: true, firstName: true, lastName: true, email: true },
        include: { doctorProfile: true },
      },
      slot: true,
      prescriptions: true,
    },
  });

  if (!appointment) {
    throw new AppError('NOT_FOUND', 'Appointment not found', 404);
  }

  // Check permissions
  const isPatient = appointment.patientId === req.user!.id;
  const isDoctor = appointment.doctorId === req.user!.id;
  const isAdminOrStaff = [UserType.ADMIN, UserType.STAFF].includes(req.user!.userType);

  if (!isPatient && !isDoctor && !isAdminOrStaff) {
    throw new AppError('FORBIDDEN', 'Access denied', 403);
  }

  // Create audit log for PHI access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'APPOINTMENT_VIEWED',
      resource: 'Appointment',
      resourceId: appointment.id,
    },
  });

  res.json(buildSuccessResponse(appointment));
});

// List appointments (with filters)
router.get('/', async (req: AuthenticatedRequest, res) => {
  const parseResult = AppointmentFiltersSchema.safeParse(req.query);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid query parameters',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const { page, limit, status, dateFrom, dateTo, doctorId, patientId, sortBy, sortOrder } =
    parseResult.data;
  const skip = (page - 1) * limit;

  const where: any = {};

  // Role-based filtering
  if (req.user!.userType === UserType.PATIENT) {
    where.patientId = req.user!.id;
  } else if (req.user!.userType === UserType.DOCTOR) {
    where.doctorId = req.user!.id;
  } else if (req.user!.userType === UserType.STAFF || req.user!.userType === UserType.ADMIN) {
    // Staff/Admin can filter by doctor/patient
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
  }

  if (status) where.status = { in: status };
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      skip,
      take: limit,
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
        slot: true,
        prescriptions: { select: { id: true } },
      },
      orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
    }),
    prisma.appointment.count({ where }),
  ]);

  // Create audit log for list access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'APPOINTMENTS_LISTED',
      resource: 'Appointment',
    },
  });

  res.json(buildSuccessResponse(buildPaginatedResponse(appointments, { page, limit }, total)));
});

// Update appointment
router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const parseResult = AppointmentUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { slot: true },
  });

  if (!appointment) {
    throw new AppError('NOT_FOUND', 'Appointment not found', 404);
  }

  // Check permissions
  const isDoctor = appointment.doctorId === req.user!.id;
  const isPatient = appointment.patientId === req.user!.id;
  const isAdminOrStaff = [UserType.ADMIN, UserType.STAFF].includes(req.user!.userType);

  // Patients can only cancel their own appointments
  if (isPatient && !isAdminOrStaff) {
    if (parseResult.data.status && parseResult.data.status !== AppointmentStatus.CANCELLED) {
      throw new AppError('FORBIDDEN', 'Patients can only cancel appointments', 403);
    }
    // Remove fields patients can't update
    delete parseResult.data.paymentStatus;
    delete parseResult.data.consultationType;
  }

  // Doctors can update status, notes, payment status
  if (isDoctor && !isAdminOrStaff) {
    // Allow all fields for doctors
  }

  const oldStatus = appointment.status;
  const oldPaymentStatus = appointment.paymentStatus;

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: parseResult.data,
    include: {
      patient: { select: { id: true, firstName: true, lastName: true } },
      doctor: { select: { id: true, firstName: true, lastName: true } },
      slot: true,
    },
  });

  // Handle slot status changes
  if (parseResult.data.status && parseResult.data.status !== oldStatus) {
    let newSlotStatus = SlotStatus.AVAILABLE;

    switch (parseResult.data.status) {
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        newSlotStatus = SlotStatus.AVAILABLE;
        break;
      case AppointmentStatus.COMPLETED:
        newSlotStatus = SlotStatus.BOOKED;
        break;
    }

    await prisma.schedule.update({
      where: { id: appointment.slotId },
      data: { status: newSlotStatus },
    });
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'APPOINTMENT_UPDATED',
      resource: 'Appointment',
      resourceId: appointment.id,
      oldData: { status: oldStatus, paymentStatus: oldPaymentStatus },
      newData: parseResult.data,
    },
  });

  res.json(buildSuccessResponse(updated));
});

// Cancel appointment (Patient/Doctor/Admin)
router.post('/:id/cancel', async (req: AuthenticatedRequest, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { slot: true },
  });

  if (!appointment) {
    throw new AppError('NOT_FOUND', 'Appointment not found', 404);
  }

  const isPatient = appointment.patientId === req.user!.id;
  const isDoctor = appointment.doctorId === req.user!.id;
  const isAdminOrStaff = [UserType.ADMIN, UserType.STAFF].includes(req.user!.userType);

  if (!isPatient && !isDoctor && !isAdminOrStaff) {
    throw new AppError('FORBIDDEN', 'Access denied', 403);
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError('CONFLICT', 'Appointment already cancelled', 409);
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError('CONFLICT', 'Cannot cancel completed appointment', 409);
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Update appointment
    const updated = await tx.appointment.update({
      where: { id: req.params.id },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
        slot: true,
      },
    });

    // Free up the slot
    await tx.schedule.update({
      where: { id: appointment.slotId },
      data: { status: SlotStatus.AVAILABLE },
    });

    return updated;
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'APPOINTMENT_CANCELLED',
      resource: 'Appointment',
      resourceId: appointment.id,
    },
  });

  res.json(buildSuccessResponse(updated));
});

export { router as appointmentRouter };
