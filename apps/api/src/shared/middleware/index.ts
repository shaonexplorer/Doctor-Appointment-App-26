/**
 * Shared Middleware Exports
 * Common middleware used across modules
 */

export {
  authMiddleware,
  requireAuth,
  requireRole,
  requireAnyRole,
  requireMinimumRole,
  optionalAuth,
  type AuthenticatedRequest,
} from './auth';
export { errorHandler, notFoundHandler, AppError } from './errorHandler';
export { requestLogger } from './requestLogger';
export {
  createAuditLogger,
  auditUserProfileAccess,
  auditUserProfileUpdate,
  auditUserProfileDelete,
  auditPrescriptionAccess,
  auditPrescriptionCreate,
  auditPrescriptionUpdate,
  auditPrescriptionDelete,
  auditAppointmentAccess,
  auditAppointmentCreate,
  auditAppointmentUpdate,
  auditAppointmentDelete,
  auditDoctorProfileAccess,
  auditDoctorProfileUpdate,
  auditPatientProfileAccess,
  auditPatientProfileUpdate,
  logAuthEvent,
  getUserAuditLogs,
  getResourceAuditLogs,
} from './auditLogger';
