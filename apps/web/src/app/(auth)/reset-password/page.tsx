'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { ResetPasswordSchema, type ResetPasswordInput } from '@doctor-appointment-app/shared';

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
  icon?: typeof LockKeyhole;
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

function PasswordStrengthIndicator({ password }: { password: string }) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const bars = [1, 2, 3, 4].map((i) => (
    <span
      key={i}
      className={`h-1.5 flex-1 rounded-full transition-colors ${
        i <= strength ? 'bg-primary' : 'bg-muted'
      }`}
    />
  ));

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const label = strength > 0 ? labels[strength - 1] : '';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">{bars}</div>
      {strength > 0 && (
        <p className="text-muted-foreground -mt-2 text-xs">
          {label} password strength · 8+ characters recommended
        </p>
      )}
    </div>
  );
}

function AuthShell({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-primary text-sm font-bold">{eyebrow}</p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{copy}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    // @ts-expect-error - Zod v4 schema compatibility with zodResolver
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordInput): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast.add({
          type: 'error',
          title: 'Reset failed',
          description: result.error?.message || 'Invalid or expired reset token',
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Password updated',
        description: 'Your password has been reset successfully.',
      });

      void router.push('/login');
      router.refresh();
    } catch {
      toast.add({
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-5 py-10">
      <AuthShell
        eyebrow="Set a new password"
        title="Create a new password"
        copy="Choose a strong password you haven't used before."
      >
        {}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input type="hidden" {...register('token')} />
          <Field
            label="New password"
            type="password"
            placeholder="Enter new password"
            icon={LockKeyhole}
            {...register('password')}
            error={errors.password?.message}
          />
          <PasswordStrengthIndicator password={password} />
          <Field
            label="Confirm new password"
            type="password"
            placeholder="Repeat your new password"
            icon={LockKeyhole}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground shadow-primary/20 mt-2 h-11 rounded-xl text-sm font-bold shadow-lg"
          >
            {loading ? 'Updating...' : 'Update password'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      </AuthShell>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
