import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffAppointments } from '@/components/staff-portal/StaffAppointments';

export default function StaffAppointmentsPage() {
  return (
    <StaffPortalShell active="Appointments">
      <StaffAppointments />
    </StaffPortalShell>
  );
}