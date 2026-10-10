'use client';

import { useState, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { LoginSchema, type LoginInput } from '@doctor-appointment-app/shared';
import { useAuth } from '@/context/AuthContext';

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
          className="border-input bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 h-11 w-full rounded-xl border px-10 text-sm font-normal transition-colors outline-none focus:ring-4"
          style={{ paddingLeft: Icon ? '2.75rem' : undefined }}
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
    </label>
  );
}

function Divider() {
  return (
    <div className="text-muted-foreground/60 my-2 flex items-center gap-3 text-xs font-medium">
      <Separator className="flex-1" />
      <span>or</span>
      <Separator className="flex-1" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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

  const onSubmit = async (data: LoginInput): Promise<void> => {
    setLoading(true);
    try {
      await login(data.email, data.password);

      startTransition(() => {
        router.push('/dashboard');
        router.refresh();
      });
    } catch (err: unknown) {
      toast.add({
        type: 'error',
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Invalid credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground shadow-primary/20 grid size-9 place-items-center rounded-xl shadow-lg">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </span>
          <span className="text-foreground text-xl font-bold tracking-tight">
            Medi<span className="text-primary">Book</span>
          </span>
        </Link>
      </div>
      <div className="mb-8">
        <p className="text-primary text-sm font-bold">Welcome back</p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Enter your email and password to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          {...register('email')}
        />
        {errors.email && <p className="text-destructive -mt-3 text-xs">{errors.email.message}</p>}

        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={LockKeyhole}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive -mt-3 text-xs">{errors.password.message}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="border-border accent-primary size-4 rounded"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-primary font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground shadow-primary/20 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-lg disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-8">
        <Divider />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
