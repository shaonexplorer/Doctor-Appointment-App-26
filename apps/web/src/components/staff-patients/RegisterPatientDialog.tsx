'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, UserRound, Mail, Phone, Calendar, Shield, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import type { RegisterPatientDialogProps } from './types';
import { Gender, UserType, VALIDATION } from '@doctor-appointment-app/shared';

// Build form schema for patient registration by staff
// Uses the auth register endpoint which requires password and sends verification email
const RegisterPatientSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  firstName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'First name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'First name is too long' })
    .trim(),
  lastName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'Last name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'Last name is too long' })
    .trim(),
  phone: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Phone number is too long' })
    .optional()
    .nullable(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    })
    .max(VALIDATION.PASSWORD_MAX_LENGTH, { message: 'Password is too long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  // Patient-specific fields
  dob: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().date().optional().nullable()
  ),
  gender: z.nativeEnum(Gender).optional().nullable(),
  address: z
    .string()
    .max(VALIDATION.ADDRESS_MAX_LENGTH, { message: 'Address is too long' })
    .optional()
    .nullable(),
  emergencyContact: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Emergency contact is too long' })
    .optional()
    .nullable(),
});

type RegisterPatientFormInput = z.infer<typeof RegisterPatientSchema>;

const GENDER_OPTIONS = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' },
  { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
] as const;

function Field({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  required = true,
  error,
  showPasswordToggle = false,
  ...props
}: {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: typeof Mail;
  required?: boolean;
  error?: string;
  showPasswordToggle?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="text-muted-foreground flex flex-col gap-2 text-sm font-semibold">
      <span>
        {label}
        {required && <span className="text-muted-foreground/60"> *</span>}
      </span>
      <span className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="text-muted-foreground/50 absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
        )}
        <Input
          type={isPassword && visible ? 'text' : type}
          placeholder={placeholder}
          className={`bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 h-11 w-full rounded-xl border px-10 text-sm font-normal transition-colors outline-none focus:ring-4 ${
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/10'
              : 'border-input'
          }`}
          style={{ paddingLeft: Icon ? '2.75rem' : undefined }}
          aria-invalid={!!error}
          {...props}
        />
        {showPasswordToggle && isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </span>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export function RegisterPatientDialog({
  isOpen,
  onClose,
  onSuccess,
}: RegisterPatientDialogProps) {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterPatientFormInput>({
    // @ts-expect-error - Zod v4 compatibility with zodResolver
    resolver: zodResolver(RegisterPatientSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      dob: '',
      gender: undefined,
      address: '',
      emergencyContact: '',
    },
  });

  const onSubmit = async (data: RegisterPatientFormInput): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Clean up optional fields: convert empty strings to undefined
      // Remove confirmPassword if present (not in our schema but just in case)
      const { password, ...restData } = data;
      const cleanedData = Object.fromEntries(
        Object.entries(restData).map(([key, value]) => {
          if (value === '') return [key, undefined];
          return [key, value];
        })
      );

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanedData,
          password,
          userType: UserType.PATIENT,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast.add({
          type: 'error',
          title: 'Registration failed',
          description: result.error?.message || 'An error occurred while creating the patient.',
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Patient registered',
        description: `${data.firstName} ${data.lastName} has been registered. An email has been sent to ${data.email} to verify their account.`,
      });

      reset();
      onClose();
      onSuccess?.();
    } catch {
      toast.add({
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn('bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-5')}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-patient-title"
    >
      <div
        className="border-border bg-card w-full max-w-lg rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="register-patient-title" className="text-lg font-black">
            Register new patient
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="text-muted-foreground mt-2 text-sm">
          Enter the patient's information to create their account. They will receive an email to verify their account and set a secure password.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Name fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              placeholder="John"
              icon={UserRound}
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Field
              label="Last name"
              placeholder="Doe"
              icon={UserRound}
              {...register('lastName')}
              error={errors.lastName?.message}
            />
            <Field
              label="Email address"
              type="email"
              placeholder="patient@example.com"
              icon={Mail}
              {...register('email')}
              error={errors.email?.message}
            />
            <Field
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Field
              label="Password"
              type="password"
              placeholder="Create a temporary password"
              icon={LockKeyhole}
              showPasswordToggle
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          {/* Patient details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Date of birth"
              type="date"
              {...register('dob')}
              error={errors.dob?.message}
            />
            <label className="text-muted-foreground flex flex-col gap-2 text-sm font-semibold">
              <span>Gender</span>
              <select
                {...register('gender')}
                className="border-input bg-background text-foreground focus:border-primary focus:ring-primary/10 h-11 w-full rounded-xl border px-4 text-sm font-normal transition-colors outline-none focus:ring-4"
                aria-invalid={!!errors.gender}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.gender.message}
                </p>
              )}
            </label>
            <Field
              label="Address"
              placeholder="123 Main St, City, State"
              {...register('address')}
              error={errors.address?.message}
            />
            <Field
              label="Emergency contact"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              {...register('emergencyContact')}
              error={errors.emergencyContact?.message}
            />
          </div>

          {/* Info notice */}
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Account setup</p>
                <p className="text-muted-foreground mt-1">
                  The patient will receive an email invitation to complete their registration and set a secure password.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground shadow-primary/20 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? 'Registering...' : 'Register patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}