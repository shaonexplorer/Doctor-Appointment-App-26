/**
 * Authentication Routes
 */

import type { Request, Response } from 'express';
import { Router } from 'express';
import { auth } from '../index';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildErrorResponse } from '@doctor-appointment-app/shared';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  const parseResult = RegisterSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const data = parseResult.data;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        userType: data.userType,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    // Create profile based on user type
    if (data.userType === 'DOCTOR') {
      await auth.$prisma.doctorProfile.create({
        data: {
          userId: result.user.id,
          specialty: data.specialty!,
          designation: data.designation!,
          licenseNo: data.licenseNo!,
          bio: data.bio,
          fee: data.fee!,
        },
      });
    } else if (data.userType === 'PATIENT') {
      await auth.$prisma.patientProfile.create({
        data: {
          userId: result.user.id,
          dob: data.dob ? new Date(data.dob) : null,
          gender: data.gender || null,
          address: data.address,
          emergencyContact: data.emergencyContact,
        },
      });
    }

    // Set cookies
    res.cookie('session_token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(
      buildSuccessResponse({
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType,
          emailVerified: result.user.emailVerified,
        },
        session: {
          id: result.session.id,
          expiresAt: result.session.expiresAt,
        },
      })
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('REGISTRATION_FAILED', 'Registration failed', 500);
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const { email, password } = parseResult.data;

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
    });

    // Set cookies
    res.cookie('session_token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(
      buildSuccessResponse({
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType,
          emailVerified: result.user.emailVerified,
        },
        session: {
          id: result.session.id,
          expiresAt: result.session.expiresAt,
        },
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.session_token;

  if (sessionToken) {
    try {
      await auth.api.signOut({
        headers: new Headers({
          cookie: `session_token=${sessionToken}`,
        }),
      });
    } catch {
      // Ignore errors
    }
  }

  res.clearCookie('session_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.json(buildSuccessResponse({ message: 'Logged out successfully' }));
});

// Get current session
router.get('/me', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.session_token;

  if (!sessionToken) {
    return res.json(buildSuccessResponse({ user: null, session: null }));
  }

  try {
    const result = await auth.api.getSession({
      headers: new Headers({
        cookie: `session_token=${sessionToken}`,
      }),
    });

    if (!result) {
      return res.json(buildSuccessResponse({ user: null, session: null }));
    }

    res.json(
      buildSuccessResponse({
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType,
          emailVerified: result.user.emailVerified,
        },
        session: {
          id: result.session.id,
          expiresAt: result.session.expiresAt,
        },
      })
    );
  } catch {
    res.json(buildSuccessResponse({ user: null, session: null }));
  }
});

// Forgot password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const parseResult = ForgotPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const { email } = parseResult.data;

  try {
    await auth.api.forgetPassword({
      body: { email, redirectTo: `${process.env.FRONTEND_URL}/reset-password` },
    });

    // Always return success to prevent email enumeration
    res.json(buildSuccessResponse({ message: 'If the email exists, a reset link has been sent' }));
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json(buildSuccessResponse({ message: 'If the email exists, a reset link has been sent' }));
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  const parseResult = ResetPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const { token, password } = parseResult.data;

  try {
    await auth.api.resetPassword({
      body: { token, password },
    });

    res.json(buildSuccessResponse({ message: 'Password reset successfully' }));
  } catch (error) {
    console.error('Reset password error:', error);
    throw new AppError('INVALID_TOKEN', 'Invalid or expired reset token', 400);
  }
});

// Verify email
router.post('/verify-email', async (req: Request, res: Response) => {
  const parseResult = VerifyEmailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const { token } = parseResult.data;

  try {
    await auth.api.verifyEmail({
      body: { token },
    });

    res.json(buildSuccessResponse({ message: 'Email verified successfully' }));
  } catch (error) {
    console.error('Verify email error:', error);
    throw new AppError('INVALID_TOKEN', 'Invalid or expired verification token', 400);
  }
});

// Resend verification email
router.post('/resend-verification', async (req: Request, res: Response) => {
  const parseResult = ForgotPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json(
        buildErrorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          parseResult.error.flatten().fieldErrors
        )
      );
  }

  const { email } = parseResult.data;

  try {
    await auth.api.sendVerificationEmail({
      body: { email, redirectTo: `${process.env.FRONTEND_URL}/verify-email` },
    });

    res.json(
      buildSuccessResponse({ message: 'If the email exists, a verification link has been sent' })
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    res.json(
      buildSuccessResponse({ message: 'If the email exists, a verification link has been sent' })
    );
  }
});

export { router as authRouter };
