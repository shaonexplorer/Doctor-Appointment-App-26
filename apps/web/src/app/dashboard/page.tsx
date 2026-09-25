'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@doctor-appointment-app/shared';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      switch (user.userType) {
        case UserType.PATIENT:
          router.push('/dashboard/patient');
          break;
        case UserType.DOCTOR:
          router.push('/dashboard/doctor');
          break;
        case UserType.STAFF:
          router.push('/dashboard/staff');
          break;
        case UserType.ADMIN:
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/patient');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}