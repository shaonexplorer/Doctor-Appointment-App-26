'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <AuthShell
        eyebrow="You're all set"
        title="Welcome to MediBook"
        copy="Your account is ready. Let's make your next healthcare visit a little easier."
      >
        <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="size-7" />
          </span>
          <p className="mt-4 text-sm leading-6 text-emerald-800">
            Your account has been successfully created and verified.
          </p>
        </div>
        <Link href="/login">
          <Button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
            Continue to sign in <ArrowRight className="size-4" />
          </Button>
        </Link>
      </AuthShell>
    </main>
  );
}