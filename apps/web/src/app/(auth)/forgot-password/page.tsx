'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@doctor-appointment-app/shared';
import { z } from 'zod';

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
            error ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input'
          }`}
          style={{ paddingLeft: Icon ? '2.75rem' : undefined }}
          aria-invalid={!!error}
          {...props}
        />
      </span>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

  const onSubmit = async (data: ForgotPasswordInput) => {
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

      router.push('/reset-password');
      router.refresh();
    } catch (error) {
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
      <aside className="relative hidden overflow-hidden bg-cobalt-800 lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-36 -top-32 size-[520px] rounded-full bg-cobalt-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-[440px] rounded-full bg-cobalt-900/70 blur-2xl" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Medi<span className="text-primary-foreground/80">Book</span>
            </span>
          </Link>
          <p className="max-w-sm text-4xl font-semibold leading-[1.1] tracking-tight text-white">
            Care that feels <span className="text-cobalt-200">personal.</span>
          </p>
          <p className="mt-5 max-w-sm text-base leading-7 text-cobalt-200">
            Your trusted space to find the right care, book appointments, and stay on top of your health.
          </p>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-sm">
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-cobalt-200 text-cobalt-800">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-cobalt-200">Password reset</p>
                  <p className="font-semibold text-white">Check your email</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                Sent
              </span>
            </div>
          </div>
        </div>
      </aside>
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <AuthShell
          eyebrow="Account recovery"
          title="Forgot your password?"
          copy="Enter your email and we'll send you a secure link to reset your password."
          backAction={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push('/login')}
              className="gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to sign in
            </Button>
          }
        >
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
              className="h-11 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
            className="mx-auto mt-7 gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to sign in
          </Button>
        </AuthShell>
      </section>
    </main>
  );
}