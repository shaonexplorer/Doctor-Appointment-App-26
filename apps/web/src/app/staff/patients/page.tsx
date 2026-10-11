import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffPatientDirectory } from '@/components/staff-patients/StaffPatientDirectory';

export default function StaffPatientsPage() {
  return (
    <StaffPortalShell active="Patients">
      <StaffPatientDirectory />
    </StaffPortalShell>
  );
}