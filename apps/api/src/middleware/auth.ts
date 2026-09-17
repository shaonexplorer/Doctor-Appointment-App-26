/**
 * Authentication Middleware
 * Validates session and attaches user to request
 */

import type { Request, Response, NextFunction } from 'express';
import { auth } from '../index';
import { UserType } from '@doctor-appointment-app/shared';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    emailVerified: boolean;
  };
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Get session from cookie
    const sessionCookie = req.cookies?.session_token;
    const accessToken = req.cookies?.access_token;

    let session = null;
    let user = null;

    if (sessionCookie) {
      // Validate session via BetterAuth
      const result = await auth.api.getSession({
        headers: new Headers({
          cookie: `session_token=${sessionCookie}`,
        }),
      });
      session = result?.session;
      user = result?.user;
    } else if (accessToken) {
      // Try JWT token validation
      const result = await auth.api.getSession({
        headers: new Headers({
          authorization: `Bearer ${accessToken}`,
        }),
      });
      session = result?.session;
      user = result?.user;
    }

    if (!session || !user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      throw new AppError('SESSION_EXPIRED', 'Session has expired', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType as UserType,
      emailVerified: user.emailVerified,
    };

    req.session = {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('UNAUTHORIZED', 'Invalid or expired session', 401);
  }
}

export function requireRole(...allowedRoles: UserType[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.userType)) {
      throw new AppError('FORBIDDEN', 'Insufficient permissions', 403);
    }

    next();
  };
}

export function requireAnyRole(...allowedRoles: UserType[]) {
  return requireRole(...allowedRoles);
}

// Role hierarchy: ADMIN > STAFF > DOCTOR > PATIENT
const ROLE_HIERARCHY: Record<UserType, number> = {
  [UserType.ADMIN]: 4,
  [UserType.STAFF]: 3,
  [UserType.DOCTOR]: 2,
  [UserType.PATIENT]: 1,
};

export function requireMinimumRole(minimumRole: UserType) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const userLevel = ROLE_HIERARCHY[req.user.userType] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

    if (userLevel < requiredLevel) {
      throw new AppError('FORBIDDEN', 'Insufficient permissions', 403);
    }

    next();
  };
}

export function optionalAuth() {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const sessionCookie = req.cookies?.session_token;
      const accessToken = req.cookies?.access_token;

      let session = null;
      let user = null;

      if (sessionCookie) {
        const result = await auth.api.getSession({
          headers: new Headers({
            cookie: `session_token=${sessionCookie}`,
          }),
        });
        session = result?.session;
        user = result?.user;
      } else if (accessToken) {
        const result = await auth.api.getSession({
          headers: new Headers({
            authorization: `Bearer ${accessToken}`,
          }),
        });
        session = result?.session;
        user = result?.user;
      }

      if (session && user && new Date(session.expiresAt) > new Date()) {
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType as UserType,
          emailVerified: user.emailVerified,
        };
        req.session = {
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt,
        };
      }
    } catch {
      // Ignore auth errors for optional auth
    }

    next();
  };
}
