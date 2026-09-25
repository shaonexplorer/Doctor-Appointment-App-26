'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@doctor-appointment-app/shared';

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
          type={type}
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
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    // @ts-expect-error - Zod v4 schema compatibility with zodResolver
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Request failed',
          description: result.error?.message || 'An error occurred',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Reset link sent',
        description: 'If the email exists, a password reset link has been sent.',
      });

      void router.push('/reset-password');
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

  return (
    <main className="min-h-screen bg-background lg:flex">
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <AuthShell
          eyebrow="Account recovery"
          title="Forgot your password?"
          copy="Enter your email and we'll send you a secure link to reset your password."
        >
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Field
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              {...register('email')}
              error={errors.email?.message}
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-blue-600 text-sm font-bold text-primary-foreground shadow-lg shadow-blue-600/20"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void router.push('/login')}
            className="mx-auto mt-7 gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to sign in
          </Button>
        </AuthShell>
      </section>
    </main>
  );
}