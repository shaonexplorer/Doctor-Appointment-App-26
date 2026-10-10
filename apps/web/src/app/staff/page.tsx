'use client';

import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffDashboard } from '@/components/staff-dashboard/StaffDashboard';
import { useRouter } from 'next/navigation';

export default function StaffPage() {
  const router = useRouter();

  return (
    <StaffPortalShell active="Dashboard">
      <StaffDashboard onAction={(action) => {
        if (action === 'Booking workspace opened') {
          router.push('/staff/booking');
        }
      }} />
    </StaffPortalShell>
  );
}