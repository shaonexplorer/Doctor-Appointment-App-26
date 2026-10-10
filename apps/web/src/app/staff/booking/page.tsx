'use client';

import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffBooking } from '@/components/staff-booking/StaffBooking';
import { useRouter } from 'next/navigation';

export default function StaffBookingPage() {
  const router = useRouter();

  return (
    <StaffPortalShell active="Book appointment">
      <StaffBooking onBack={() => router.push('/staff/dashboard')} />
    </StaffPortalShell>
  );
}