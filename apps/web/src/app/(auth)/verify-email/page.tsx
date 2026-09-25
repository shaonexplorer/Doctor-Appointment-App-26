'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { VerifyEmailSchema, type VerifyEmailInput } from '@doctor-appointment-app/shared';
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
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-sm font-bold text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);

  const token = searchParams.get('token') || '';

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      setFocusedIndex(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
    }
    if (e.key === 'ArrowRight' && index < 5) {
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pasted.split('').map((d) => d || '');
    while (newCode.length < 6) newCode.push('');
    setCode(newCode);
    setFocusedIndex(Math.min(pasted.length, 5));
  };

  const onSubmit = async () => {
    const tokenValue = code.join('');
    if (tokenValue.length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenValue }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: result.error?.message || 'Invalid or expired verification code',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Email verified!',
        description: 'Your account has been successfully verified.',
      });

      router.push('/login');
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

  const handleResend = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }), // The API will get email from session
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Resend failed',
          description: result.error?.message || 'Could not resend code',
        });
        return;
      }

      toast({
        variant: 'success',
        title: 'Code sent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <AuthShell
        eyebrow="Almost there"
        title="Verify your email"
        copy="We sent a 6-digit verification code to your email address. Enter it below to continue."
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <input
                key={n}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Verification digit ${n + 1}`}
                value={code[n]}
                onChange={(e) => handleCodeChange(n, e.target.value)}
                onKeyDown={(e) => handleKeyDown(n, e)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(n)}
                autoFocus={n === 0}
                className={`size-12 rounded-xl border bg-background text-center text-xl font-bold text-foreground outline-none transition-colors ${
                  focusedIndex === n
                    ? 'border-primary ring-4 ring-primary/10'
                    : code[n]
                    ? 'border-primary'
                    : 'border-input'
                }`}
              />
            ))}
          </div>
          <Button
            onClick={onSubmit}
            disabled={loading || code.some((c) => !c)}
            className="h-11 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
          >
            {loading ? 'Verifying...' : 'Verify email'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            <button onClick={handleResend} className="font-bold text-primary hover:underline">
              Resend code
            </button>
          </p>
        </div>
      </AuthShell>
    </main>
  );
}