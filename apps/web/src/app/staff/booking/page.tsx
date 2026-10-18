'use client';

import { Suspense } from 'react';
import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffBooking } from '@/components/staff-booking/StaffBooking';
import { useRouter } from 'next/navigation';

// StaffBooking reads URL search params, which can't be prerendered statically.
// Suspense lets Next.js prerender the shell and hydrate search params on the client.
export default function StaffBookingPage() {
  const router = useRouter();

  return (
    <StaffPortalShell active="Book appointment">
      <Suspense fallback={<div className="animate-pulse" />}>
        <StaffBooking onBack={() => router.push('/staff/dashboard')} />
      </Suspense>
    </StaffPortalShell>
  );
}