import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffCheckin } from '@/components/staff-checkin/StaffCheckin';

export default function StaffCheckinPage() {
  return (
    <StaffPortalShell active="Check-in">
      <StaffCheckin />
    </StaffPortalShell>
  );
}