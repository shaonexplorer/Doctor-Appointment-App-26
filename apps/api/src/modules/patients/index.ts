/**
 * Patients Module
 * Self-contained patients module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { PatientService, createPatientService } from './services/patientService';
export {
  PatientController,
  createPatientController,
} from './controllers/patientController';
export { createPatientRoutes } from './routes/patientRoutes';

// Module factory for dependency injection
import type { AppointmentRepository, PrescriptionRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { PatientService } from './services/patientService';
import { PatientController } from './controllers/patientController';
import { createPatientRoutes } from './routes/patientRoutes';

export interface PatientsModule {
  service: PatientService;
  controller: PatientController;
  routes: ReturnType<typeof createPatientRoutes>;
}

export function createPatientsModule(
  appointmentRepository: AppointmentRepository,
  prescriptionRepository: PrescriptionRepository,
  prisma: PrismaClient
): PatientsModule {
  const service = new PatientService(appointmentRepository, prescriptionRepository, prisma);
  const controller = new PatientController(service);
  const routes = createPatientRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}