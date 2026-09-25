/**
 * Email Utility
 * Handles sending emails via Nodemailer using SMTP configuration
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Create Nodemailer transporter using environment variables
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    console.warn('Email configuration incomplete. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass: password,
    },
  });
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    // In development, log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV EMAIL] Would send email:');
      console.log(`  To: ${options.to}`);
      console.log(`  Subject: ${options.subject}`);
      console.log(`  Text: ${options.text}`);
      console.log(`  HTML: ${options.html}`);
    }
    return;
  }

  const from = process.env.EMAIL_FROM || 'noreply@doctor-appointment.app';

  try {
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send verification email (link-based - legacy)
 */
export async function sendVerificationEmail({
  user,
  url,
  token,
}: {
  user: { email: string; firstName?: string; lastName?: string };
  url: string;
  token: string;
}): Promise<void> {
  const firstName = user.firstName || 'User';

  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    text: `Hi ${firstName},\n\nPlease click the link below to verify your email address:\n\n${url}\n\nThis link will expire in 1 hour.\n\nIf you didn't create an account, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Doctor Appointment App</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Verify your email address</h2>
            <p style="color: #475569; font-size: 16px;">Hi ${firstName},</p>
            <p style="color: #475569; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${url}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Verify Email Address</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #1e40af; font-size: 14px; word-break: break-all;">${url}</p>
            <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send verification OTP email (6-digit code)
 */
export async function sendVerificationOTP({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: 'email-verification' | 'sign-in' | 'forget-password' | 'change-email';
}): Promise<void> {
  const subject = type === 'email-verification'
    ? 'Your verification code'
    : type === 'sign-in'
      ? 'Your sign-in code'
      : type === 'change-email'
        ? 'Your email change verification code'
        : 'Your password reset code';

  const message = type === 'email-verification'
    ? 'Use the code below to verify your email address:'
    : type === 'sign-in'
      ? 'Use the code below to sign in:'
      : type === 'change-email'
        ? 'Use the code below to verify your new email address:'
        : 'Use the code below to reset your password:';

  await sendEmail({
    to: email,
    subject,
    text: `${message}\n\n${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Doctor Appointment App</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">${subject}</h2>
            <p style="color: #475569; font-size: 16px;">${message}</p>
            <div style="text-align: center; margin: 32px 0;">
              <div style="display: inline-block; background: #f1f5f9; border: 2px solid #1e40af; border-radius: 12px; padding: 20px 40px;">
                <span style="font-size: 32px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'SF Mono', 'Fira Code', monospace;">${otp}</span>
              </div>
            </div>
            <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  user,
  url,
  token,
}: {
  user: { email: string; firstName?: string; lastName?: string };
  url: string;
  token: string;
}): Promise<void> {
  const firstName = user.firstName || 'User';

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Hi ${firstName},\n\nYou requested to reset your password. Please click the link below:\n\n${url}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Doctor Appointment App</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Reset your password</h2>
            <p style="color: #475569; font-size: 16px;">Hi ${firstName},</p>
            <p style="color: #475569; font-size: 16px;">You requested to reset your password. Please click the button below:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${url}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #1e40af; font-size: 14px; word-break: break-all;">${url}</p>
            <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
}