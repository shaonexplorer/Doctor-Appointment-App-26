import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { PatientDirectory } from '@/components/doctor-patients';

export default function DoctorPatientsPage() {
  return (
    <DoctorPortalShell active="Patients">
      <PatientDirectory />
    </DoctorPortalShell>
  );
}
