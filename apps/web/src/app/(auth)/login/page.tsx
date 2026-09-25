'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { LoginSchema, type LoginInput } from '@doctor-appointment-app/shared';

// Extend LoginInput to include rememberMe
type LoginFormInput = LoginInput & { rememberMe?: boolean };

function Field({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  required = true,
  ...props
}: {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: typeof Mail;
  required?: boolean;
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
          className="h-11 w-full rounded-xl border border-input bg-background px-10 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
          style={{ paddingLeft: Icon ? '2.75rem' : undefined }}
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
    </label>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-medium text-muted-foreground/60">
      <Separator className="flex-1" />
      <span>or</span>
      <Separator className="flex-1" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    // @ts-expect-error - Zod v4 schema compatibility with zodResolver
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: result.error?.message || 'Invalid credentials',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });

      router.push('/dashboard');
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

      <p className="text-sm font-bold text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        Sign in to your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Manage your appointments and stay connected to your care team.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}

        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={LockKeyhole}
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-medium text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-border accent-primary"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="font-bold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:opacity-60"
          size="lg"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          {!loading && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <Divider />

      <Button
        type="button"
        variant="outline"
        className="flex h-11 items-center justify-center gap-3 rounded-xl border border-input bg-background text-sm font-bold text-foreground hover:bg-muted"
        size="lg"
      >
        <span className="text-base font-bold text-blue-500">G</span>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to MediBook?{' '}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}