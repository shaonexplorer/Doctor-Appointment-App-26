'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  type RegisterInput,
  UserBaseSchema,
  UserType,
  Gender,
  VALIDATION,
} from '@doctor-appointment-app/shared';
import { z } from 'zod';

// Build form schema by extending UserBaseSchema with all RegisterSchema fields + form-only fields
// This avoids issues with extending a ZodEffects (refined) schema
const RegisterFormSchema = UserBaseSchema.extend({
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
  // Doctor-specific fields
  specialty: z.string().optional(),
  designation: z.string().optional(),
  licenseNo: z.string().optional(),
  bio: z
    .string()
    .max(VALIDATION.BIO_MAX_LENGTH, { message: 'Bio is too long' })
    .optional()
    .nullable(),
  fee: z.number().positive().optional(),
  // Patient-specific fields
  // Transform empty strings to undefined before date validation to allow optional date fields for non-patient roles
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
  // Form-only fields
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  terms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms and conditions' }),
}).superRefine((data, ctx) => {
  // Doctor validation
  if (data.userType === UserType.DOCTOR) {
    if (!data.specialty)
      ctx.addIssue({
        code: 'custom',
        message: 'Doctor registration requires specialty, designation, license number, and fee',
        path: ['specialty'],
      });
    if (!data.designation)
      ctx.addIssue({
        code: 'custom',
        message: 'Doctor registration requires specialty, designation, license number, and fee',
        path: ['designation'],
      });
    if (!data.licenseNo)
      ctx.addIssue({
        code: 'custom',
        message: 'Doctor registration requires specialty, designation, license number, and fee',
        path: ['licenseNo'],
      });
    if (data.fee === undefined)
      ctx.addIssue({
        code: 'custom',
        message: 'Doctor registration requires specialty, designation, license number, and fee',
        path: ['fee'],
      });
  }
  // Password match validation
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['confirmPassword'] });
  }
});

type RegisterFormInput = z.infer<typeof RegisterFormSchema>;

const roles = [
  {
    id: 'patient',
    title: 'Patient',
    copy: 'Book appointments and manage your care.',
    icon: UserRound,
  },
  {
    id: 'doctor',
    title: 'Doctor',
    copy: 'Manage your practice and consultations.',
    icon: Stethoscope,
  },
  { id: 'staff', title: 'Staff', copy: 'Support your clinic operations.', icon: UsersRound },
] as const;

type Role = (typeof roles)[number]['id'];
type Screen = 'role' | 'signup';

function Field({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  required = true,
  error,
  ...props
}: {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: typeof Mail;
  required?: boolean;
  error?: string;
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
        {isPassword && (
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

function AuthShell({
  eyebrow,
  title,
  copy,
  children,
  backAction,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  backAction?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full">
      <div className="mb-10 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground shadow-primary/20 grid size-9 place-items-center rounded-xl shadow-lg">
            <Stethoscope className="size-5" />
          </span>
          <span className="text-foreground text-xl font-bold tracking-tight">
            Medi<span className="text-primary">Book</span>
          </span>
        </Link>
      </div>
      {backAction && <div className="mb-8">{backAction}</div>}
      <p className="text-primary text-sm font-bold">{eyebrow}</p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{copy}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function RoleChoice({ onSelectRole }: { onSelectRole: (role: Role) => void }) {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="How will you use MediBook?"
      copy="Choose the option that best describes you. You can update your profile later."
    >
      <div className="flex flex-col gap-3">
        {roles.map(({ id, title, copy, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelectRole(id)}
            className="group border-input bg-background hover:border-primary hover:shadow-primary/10 flex items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:shadow-lg"
          >
            <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground grid size-11 place-items-center rounded-xl">
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <strong className="text-foreground block text-sm">{title}</strong>
              <span className="text-muted-foreground mt-1 block text-xs">{copy}</span>
            </span>
            <ArrowRight className="text-muted-foreground/50 group-hover:text-primary size-4" />
          </button>
        ))}
      </div>
      <p className="text-muted-foreground mt-8 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function Signup({
  role,
  onBack,
  onSubmit,
  loading,
}: {
  role: Role;
  onBack: () => void;
  onSubmit: (data: RegisterFormInput) => Promise<void>;
  loading: boolean;
}) {
  const roleTitle = role[0].toUpperCase() + role.slice(1);
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    // @ts-expect-error - Zod v3 ZodEffects compatibility with zodResolver
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userType: role.toUpperCase() as RegisterInput['userType'],
      // Doctor fields
      specialty: '',
      designation: '',
      licenseNo: '',
      bio: '',
      fee: isDoctor ? 0 : undefined,
      // Patient fields
      dob: '',
      gender: undefined,
      address: '',
      emergencyContact: '',
      terms: false,
    },
  });

  return (
    <AuthShell
      eyebrow={`${roleTitle} account`}
      title="Create your account"
      copy="Set up your profile to get started with MediBook."
      backAction={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground gap-2 text-sm font-bold"
        >
          <ArrowLeft className="size-4" /> Choose a different account
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit(
          async (data) => {
            await onSubmit(data);
          },
          (formErrors) => {
            console.error('Form Validation Failed:', formErrors);
          }
        )}
        className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1"
      >
        {/* First Name & Last Name */}
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
            placeholder="you@example.com"
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
        </div>

        {/* Password & Confirm Password (Rendered for ALL roles) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Password"
            type="password"
            placeholder="Create a password"
            icon={LockKeyhole}
            {...register('password')}
            error={errors.password?.message}
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            icon={LockKeyhole}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        {isPatient && (
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
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.gender.message}
                </p>
              )}
            </label>
            <Field
              label="Address"
              placeholder="Your address"
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
        )}

        {isDoctor && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Designation"
              placeholder="e.g. MD, MBBS"
              {...register('designation')}
              error={errors.designation?.message}
            />
            <Field
              label="Specialty"
              placeholder="e.g. Cardiology"
              {...register('specialty')}
              error={errors.specialty?.message}
            />
            <Field
              label="License Number"
              placeholder="e.g. MD-123456"
              {...register('licenseNo')}
              error={errors.licenseNo?.message}
            />
            <Field
              label="Consultation fee"
              placeholder="$ 0.00"
              type="number"
              step="0.01"
              {...register('fee', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' || isNaN(v) ? undefined : Number(v)),
              })}
              error={errors.fee?.message}
            />
            <Field
              label="Bio / Qualifications"
              placeholder="e.g. FACC, PhD"
              {...register('bio')}
              error={errors.bio?.message}
            />
          </div>
        )}

        <Label className="text-muted-foreground flex items-start gap-2 text-xs leading-5">
          <input
            type="checkbox"
            className="border-border accent-primary mt-1 size-4 rounded"
            required
            {...register('terms')}
          />
          I agree to the{' '}
          <Link href="/terms" className="text-primary font-bold hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary font-bold hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground shadow-primary/20 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-lg disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'} <ArrowRight className="size-4" />
        </Button>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('role');
  const [role, setRole] = useState<Role>('patient');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setScreen('signup');
  };

  const handleBack = () => {
    setScreen('role');
  };

  const handleSignup = async (data: RegisterFormInput): Promise<void> => {
    // Strip form-only fields before sending to API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, terms, ...apiData } = data;

    // Determine if doctor from userType (comes from form data)
    const isDoctor = apiData.userType === 'DOCTOR';

    // Clean up optional fields: convert empty strings to undefined
    const cleanedData = Object.fromEntries(
      Object.entries(apiData).map(([key, value]) => {
        if (value === '') return [key, undefined];
        if (value === 0 && key === 'fee' && !isDoctor) return [key, undefined];
        return [key, value];
      })
    );

    console.log('Submitting registration data:', cleanedData);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: result.error?.message || 'An error occurred',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });

      // Pass email as query parameter for verification page
      const email = cleanedData.email as string;
      void router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      router.refresh();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const content =
    screen === 'role' ? (
      <RoleChoice onSelectRole={handleRoleSelect} />
    ) : (
      <Signup role={role} onBack={handleBack} onSubmit={handleSignup} loading={loading} />
    );

  return (
    <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
      {content}
    </section>
  );
}
