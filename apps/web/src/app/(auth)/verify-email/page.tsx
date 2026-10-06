'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

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

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [email, setEmail] = useState('');

  // Get email from URL query parameter
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

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
    const otpValue = code.join('');
    if (otpValue.length !== 6) return;
    if (!email) {
      toast.add({
        type: 'error',
        title: 'Missing email',
        description: 'Please return to the registration page and try again.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'otp', email, otp: otpValue }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast.add({
          type: 'error',
          title: 'Verification failed',
          description: result.error?.message || 'Invalid or expired verification code',
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Email verified!',
        description: 'Your account has been successfully verified.',
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

  const handleResend = async () => {
    if (!email) {
      toast.add({
        type: 'error',
        title: 'Missing email',
        description: 'Please return to the registration page and try again.',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        toast.add({
          type: 'error',
          title: 'Resend failed',
          description: result.error?.message || 'Could not resend code',
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Code sent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch {
      toast.add({
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-5 py-10">
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
                className={`bg-background text-foreground size-12 rounded-xl border text-center text-xl font-bold transition-colors outline-none ${
                  focusedIndex === n
                    ? 'border-primary ring-primary/10 ring-4'
                    : code[n]
                      ? 'border-primary'
                      : 'border-input'
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() => void onSubmit()}
            disabled={loading || code.some((c) => !c)}
            className="bg-primary text-primary-foreground shadow-primary/20 h-11 rounded-xl text-sm font-bold shadow-lg"
          >
            {loading ? 'Verifying...' : 'Verify email'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Didn't receive a code?{' '}
            <button
              onClick={() => void handleResend()}
              className="text-primary font-bold hover:underline"
            >
              Resend code
            </button>
          </p>
        </div>
      </AuthShell>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-5 py-10">
      <AuthShell
        eyebrow="Almost there"
        title="Verify your email"
        copy="We sent a 6-digit verification code to your email address. Enter it below to continue."
      >
        <div className="flex flex-col items-center gap-6">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </AuthShell>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
