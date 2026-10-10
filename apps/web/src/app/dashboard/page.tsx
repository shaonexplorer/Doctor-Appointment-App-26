'use client';

import { useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@doctor-appointment-app/shared';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  console.log('DashboardRedirectPage: user:', user, 'loading:', loading);

  useEffect(() => {
    if (!loading) {
      if (user) {
        startTransition(() => {
          switch (user.userType) {
            case UserType.PATIENT:
              router.push('/patient/dashboard');
              break;
            case UserType.DOCTOR:
              router.push('/doctor/dashboard');
              break;
            case UserType.STAFF:
              router.push('/staff/dashboard');
              break;
            case UserType.ADMIN:
              router.push('/admin/dashboard');
              break;
            default:
              router.push('/patient/dashboard');
          }
        });
      } else {
        startTransition(() => {
          router.push('/login');
        });
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
