'use client';

import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffDashboard } from '@/components/staff-dashboard/StaffDashboard';
import { useRouter } from 'next/navigation';

export default function StaffDashboardPage() {
  const router = useRouter();

  const handleAction = (action: string) => {
    if (action === 'Booking workspace opened') {
      router.push('/staff/booking');
    }
  };

  return (
    <StaffPortalShell active="Dashboard">
      <StaffDashboard onAction={handleAction} />
    </StaffPortalShell>
  );
}