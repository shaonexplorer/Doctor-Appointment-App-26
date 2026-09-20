/**
 * Audit Logging Middleware
 * Tracks PHI access and sensitive operations for compliance
 */

import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../index';
import type { AuthenticatedRequest } from './auth';

export interface AuditLogOptions {
  action: string;
  resource: string;
  resourceIdParam?: string; // e.g., ':id' to extract from req.params
  getResourceId?: (req: AuthenticatedRequest) => string | null;
  captureOldData?: boolean;
  captureNewData?: boolean;
  getOldData?: (req: AuthenticatedRequest) => Promise<Record<string, unknown> | null>;
  getNewData?: (req: AuthenticatedRequest) => Promise<Record<string, unknown> | null>;
  isPHI?: boolean;
}

/**
 * Creates audit logging middleware for PHI access tracking
 */
export function createAuditLogger(options: AuditLogOptions) {
  const {
    action,
    resource,
    resourceIdParam,
    getResourceId,
    captureOldData = false,
    captureNewData = false,
    getOldData,
    getNewData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isPHI,
  } = options;

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Store original send to capture response data
    const originalSend = res.send;
    let responseBody: unknown = null;

    res.send = function (body?: unknown): Response {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Capture response finish to log after response is sent
    res.on('finish', () => {
      void (async () => {
        try {
          // Only log successful responses (2xx) or explicitly for failed auth attempts
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const userId = req.user?.id || null;

            // Determine resource ID
            let resourceId: string | null = null;
            if (resourceIdParam) {
              resourceId = req.params[resourceIdParam.replace(':', '')] || null;
            } else if (getResourceId) {
              resourceId = getResourceId(req);
            } else if (req.params.id) {
              resourceId = req.params.id;
            }

            // Capture old/new data if requested
            let oldData: Record<string, unknown> | null = null;
            let newData: Record<string, unknown> | null = null;

            if (captureOldData && getOldData) {
              oldData = await getOldData(req);
            }

            if (captureNewData && getNewData) {
              newData = await getNewData(req);
            } else if (captureNewData && responseBody) {
              // Try to extract from response body
              try {
                const parsed =
                  typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
                if (parsed && typeof parsed === 'object' && 'data' in parsed) {
                  newData = parsed.data as Record<string, unknown>;
                }
              } catch {
                // Ignore parsing errors
              }
            }

            // Get client info
            const ipAddress = req.ip || req.socket.remoteAddress || null;
            const userAgent = req.get('user-agent') || null;

            // Write audit log
            await prisma.auditLog.create({
              data: {
                userId,
                action,
                resource,
                resourceId,
                oldData,
                newData,
                ipAddress,
                userAgent,
              },
            });
          }
        } catch (error) {
          // Log audit errors but don't block the response
          console.error('Audit logging error:', error);
        }
      })();
    });

    next();
  };
}

/**
 * Predefined audit loggers for common operations
 */

// User profile access (PHI)
export const auditUserProfileAccess = createAuditLogger({
  action: 'READ',
  resource: 'user-profile',
  resourceIdParam: ':id',
  isPHI: true,
});

export const auditUserProfileUpdate = createAuditLogger({
  action: 'UPDATE',
  resource: 'user-profile',
  resourceIdParam: ':id',
  isPHI: true,
  captureOldData: true,
  captureNewData: true,
});

export const auditUserProfileDelete = createAuditLogger({
  action: 'DELETE',
  resource: 'user-profile',
  resourceIdParam: ':id',
  isPHI: true,
});

// Prescription access (PHI)
export const auditPrescriptionAccess = createAuditLogger({
  action: 'READ',
  resource: 'prescription',
  resourceIdParam: ':id',
  isPHI: true,
});

export const auditPrescriptionCreate = createAuditLogger({
  action: 'CREATE',
  resource: 'prescription',
  isPHI: true,
  captureNewData: true,
});

export const auditPrescriptionUpdate = createAuditLogger({
  action: 'UPDATE',
  resource: 'prescription',
  resourceIdParam: ':id',
  isPHI: true,
  captureOldData: true,
  captureNewData: true,
});

export const auditPrescriptionDelete = createAuditLogger({
  action: 'DELETE',
  resource: 'prescription',
  resourceIdParam: ':id',
  isPHI: true,
});

// Appointment access (PHI)
export const auditAppointmentAccess = createAuditLogger({
  action: 'READ',
  resource: 'appointment',
  resourceIdParam: ':id',
  isPHI: true,
});

export const auditAppointmentCreate = createAuditLogger({
  action: 'CREATE',
  resource: 'appointment',
  isPHI: true,
  captureNewData: true,
});

export const auditAppointmentUpdate = createAuditLogger({
  action: 'UPDATE',
  resource: 'appointment',
  resourceIdParam: ':id',
  isPHI: true,
  captureOldData: true,
  captureNewData: true,
});

export const auditAppointmentDelete = createAuditLogger({
  action: 'DELETE',
  resource: 'appointment',
  resourceIdParam: ':id',
  isPHI: true,
});

// Doctor profile access (PHI)
export const auditDoctorProfileAccess = createAuditLogger({
  action: 'READ',
  resource: 'doctor-profile',
  resourceIdParam: ':id',
  isPHI: true,
});

export const auditDoctorProfileUpdate = createAuditLogger({
  action: 'UPDATE',
  resource: 'doctor-profile',
  resourceIdParam: ':id',
  isPHI: true,
  captureOldData: true,
  captureNewData: true,
});

// Patient profile access (PHI)
export const auditPatientProfileAccess = createAuditLogger({
  action: 'READ',
  resource: 'patient-profile',
  resourceIdParam: ':id',
  isPHI: true,
});

export const auditPatientProfileUpdate = createAuditLogger({
  action: 'UPDATE',
  resource: 'patient-profile',
  resourceIdParam: ':id',
  isPHI: true,
  captureOldData: true,
  captureNewData: true,
});

/**
 * Middleware to log authentication events
 */
export async function logAuthEvent(
  userId: string | null,
  action: string,
  resource: string,
  req: Request,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId: metadata?.resourceId as string | null,
        newData: metadata || null,
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: req.get('user-agent') || null,
      },
    });
  } catch (error) {
    console.error('Auth audit logging error:', error);
  }
}

/**
 * Get audit logs for a user (admin/staff only)
 */
export async function getUserAuditLogs(
  userId: string,
  page = 1,
  limit = 50
): Promise<{
  data: Array<{
    id: string;
    userId: string | null;
    action: string;
    resource: string;
    resourceId: string | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where: { userId } }),
  ]);

  return {
    data: logs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get audit logs for a resource (admin only)
 */
export async function getResourceAuditLogs(
  resource: string,
  resourceId: string,
  page = 1,
  limit = 50
): Promise<{
  data: Array<{
    id: string;
    userId: string | null;
    action: string;
    resource: string;
    resourceId: string | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { resource, resourceId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where: { resource, resourceId } }),
  ]);

  return {
    data: logs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
