/**
 * Prescription Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import type { AuthenticatedRequest } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import {
  PrescriptionCreateSchema,
  PrescriptionUpdateSchema,
  PaginationParamsSchema,
} from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';
import { UserType, AppointmentStatus } from '@doctor-appointment-app/shared';

const router = Router();

// Create prescription (Doctor only)
router.post('/', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = PrescriptionCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const data = parseResult.data;

  // Verify appointment exists and is completed
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    include: { patient: true },
  });

  if (!appointment) {
    throw new AppError('NOT_FOUND', 'Appointment not found', 404);
  }

  // Check if doctor owns this appointment
  if (appointment.doctorId !== req.user!.id) {
    throw new AppError(
      'FORBIDDEN',
      'Not authorized to create prescription for this appointment',
      403
    );
  }

  // Check appointment status
  if (appointment.status !== AppointmentStatus.COMPLETED) {
    throw new AppError(
      'CONFLICT',
      'Prescription can only be created for completed appointments',
      409
    );
  }

  // Get doctor profile
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: req.user!.id },
  });

  if (!doctorProfile) {
    throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
  }

  const prescription = await prisma.prescription.create({
    data: {
      appointmentId: data.appointmentId,
      doctorId: req.user!.id,
      patientId: appointment.patientId,
      diagnosis: data.diagnosis,
      medications: data.medications,
      tests: data.tests,
      notes: data.notes,
    },
    include: {
      appointment: {
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  // Create audit log for PHI access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'PRESCRIPTION_CREATED',
      resource: 'Prescription',
      resourceId: prescription.id,
      newData: { appointmentId: data.appointmentId, diagnosis: data.diagnosis },
    },
  });

  res.status(201).json(buildSuccessResponse(prescription));
});

// Get prescription by ID
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const prescription = await prisma.prescription.findUnique({
    where: { id: req.params.id },
    include: {
      appointment: {
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      doctor: { select: { id: true, firstName: true, lastName: true } },
      patient: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!prescription) {
    throw new AppError('NOT_FOUND', 'Prescription not found', 404);
  }

  // Check permissions
  const isDoctor = prescription.doctorId === req.user!.id;
  const isPatient = prescription.patientId === req.user!.id;
  const isAdminOrStaff = [UserType.ADMIN, UserType.STAFF].includes(req.user!.userType);

  if (!isDoctor && !isPatient && !isAdminOrStaff) {
    throw new AppError('FORBIDDEN', 'Access denied', 403);
  }

  // Create audit log for PHI access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'PRESCRIPTION_VIEWED',
      resource: 'Prescription',
      resourceId: prescription.id,
    },
  });

  res.json(buildSuccessResponse(prescription));
});

// List prescriptions
router.get('/', async (req: AuthenticatedRequest, res) => {
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

  const where: any = {};

  // Role-based filtering
  if (req.user!.userType === UserType.PATIENT) {
    where.patientId = req.user!.id;
  } else if (req.user!.userType === UserType.DOCTOR) {
    where.doctorId = req.user!.id;
  }

  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      skip,
      take: limit,
      where,
      include: {
        appointment: {
          select: { id: true, createdAt: true },
        },
        doctor: { select: { id: true, firstName: true, lastName: true } },
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
    }),
    prisma.prescription.count({ where }),
  ]);

  // Create audit log for list access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'PRESCRIPTIONS_LISTED',
      resource: 'Prescription',
    },
  });

  res.json(buildSuccessResponse(buildPaginatedResponse(prescriptions, { page, limit }, total)));
});

// Update prescription (Doctor only)
router.patch('/:id', requireRole(UserType.DOCTOR), async (req: AuthenticatedRequest, res) => {
  const parseResult = PrescriptionUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid input',
      400,
      parseResult.error.flatten().fieldErrors
    );
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: req.params.id },
  });

  if (!prescription) {
    throw new AppError('NOT_FOUND', 'Prescription not found', 404);
  }

  if (prescription.doctorId !== req.user!.id) {
    throw new AppError('FORBIDDEN', 'Not authorized to update this prescription', 403);
  }

  const updated = await prisma.prescription.update({
    where: { id: req.params.id },
    data: parseResult.data,
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'PRESCRIPTION_UPDATED',
      resource: 'Prescription',
      resourceId: prescription.id,
      newData: parseResult.data,
    },
  });

  res.json(buildSuccessResponse(updated));
});

// Get prescriptions for an appointment
router.get('/appointment/:appointmentId', async (req: AuthenticatedRequest, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.appointmentId },
  });

  if (!appointment) {
    throw new AppError('NOT_FOUND', 'Appointment not found', 404);
  }

  const isDoctor = appointment.doctorId === req.user!.id;
  const isPatient = appointment.patientId === req.user!.id;
  const isAdminOrStaff = [UserType.ADMIN, UserType.STAFF].includes(req.user!.userType);

  if (!isDoctor && !isPatient && !isAdminOrStaff) {
    throw new AppError('FORBIDDEN', 'Access denied', 403);
  }

  const prescriptions = await prisma.prescription.findMany({
    where: { appointmentId: req.params.appointmentId },
    orderBy: { createdAt: 'desc' },
  });

  // Create audit log for PHI access
  await prisma.auditLog.create({
    data: {
      userId: req.user!.id,
      action: 'PRESCRIPTIONS_LISTED',
      resource: 'Prescription',
      resourceId: req.params.appointmentId,
    },
  });

  res.json(buildSuccessResponse(prescriptions));
});

export { router as prescriptionRouter };
