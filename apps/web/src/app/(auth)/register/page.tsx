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
import { RegisterSchema, type RegisterInput } from '@doctor-appointment-app/shared';

// Extend RegisterInput to include confirmPassword and terms
type RegisterFormInput = RegisterInput & { confirmPassword?: string; terms?: boolean };

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
    <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
      <span>
        {label}
        {required && <span className="text-muted-foreground/60"> *</span>}
      </span>
      <span className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
          />
        )}
        <Input
          type={isPassword && visible ? 'text' : type}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border bg-background px-10 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </span>
      {error && (
        <p className="text-sm text-destructive" role="alert">
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
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Stethoscope className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Medi<span className="text-primary">Book</span>
          </span>
        </Link>
      </div>
      {backAction && <div className="mb-8">{backAction}</div>}
      <p className="text-sm font-bold text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
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
            className="group flex items-center gap-4 rounded-2xl border border-input bg-background p-4 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <strong className="block text-sm text-foreground">{title}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{copy}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground/50 group-hover:text-primary" />
          </button>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    // @ts-expect-error - Zod v4 schema compatibility with zodResolver
    resolver: zodResolver(RegisterSchema),
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
      fee: 0,
      // Patient fields
      dob: '',
      gender: undefined,
      address: '',
      emergencyContact: '',
      terms: false,
    },
  });

  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

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
          className="gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Choose a different account
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)} // eslint-disable-line @typescript-eslint/no-misused-promises
        className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            placeholder="Your full name"
            icon={UserRound}
            {...register('firstName')}
            error={errors.firstName?.message}
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
          <Field
            label="Password"
            type="password"
            placeholder="Create a password"
            icon={LockKeyhole}
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        {isPatient && (
          <Field
            label="Date of birth"
            type="date"
            {...register('dob')}
            error={errors.dob?.message}
          />
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
              label="Consultation fee"
              placeholder="$ 0.00"
              type="number"
              step="0.01"
              {...register('fee', { valueAsNumber: true })}
              error={errors.fee?.message}
            />
            <Field
              label="Qualifications"
              placeholder="e.g. FACC, PhD"
              {...register('bio')}
              error={errors.bio?.message}
            />
          </div>
        )}

        {!isDoctor && (
          <Field
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            icon={LockKeyhole}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        )}

        <Label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-border accent-primary"
            required
            {...register('terms')}
          />
          I agree to the{' '}
          <Link href="/terms" className="font-bold text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-bold text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>

        <Button
          type="submit"
          disabled={loading}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-60"
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
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

      void router.push('/verify-email');
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
