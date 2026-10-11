import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffDoctors } from '@/components/staff-portal/StaffDoctors';

export default function StaffDoctorsPage() {
  return (
    <StaffPortalShell active="Doctors">
      <StaffDoctors />
    </StaffPortalShell>
  );
}