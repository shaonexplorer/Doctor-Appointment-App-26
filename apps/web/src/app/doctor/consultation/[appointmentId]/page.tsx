'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import {
  ConsultationSidebar,
  ConsultationNotes,
  PrescriptionBuilder,
  ConsultationFooter,
  ConsultationCompletion,
  ValidationAlert,
  UnsavedChangesIndicator,
  type PatientInfo,
  type Medication,
  type ConsultationNotesData,
} from '@/components/doctor-consultation';
import { DoctorPortalShell } from '@/components/doctor-portal';
import {
  useDoctorAppointmentDetail,
  transformDoctorAppointmentToUI,
  type DoctorAppointmentUI,
} from '@/hooks/useDoctorAppointments';
import { useDoctorPatientDetail, type DoctorPatientDetail } from '@/hooks/useDoctorPatients';
import { useRouter, useParams } from 'next/navigation';

const initialNotes: ConsultationNotesData = {
  chiefComplaint: '',
  symptoms: '',
  clinicalNotes: '',
  diagnosis: '',
  treatmentPlan: '',
};

const initialMedications: Medication[] = [
  {
    name: '',
    dosage: '',
    frequency: 'Once daily',
    duration: '7 days',
    instructions: '',
  },
];

function calculateAge(dob: string | null): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function mapPatientToConsultationInfo(
  appointment: DoctorAppointmentUI,
  patientDetail: DoctorPatientDetail | undefined
): PatientInfo {
  const initials =
    `${appointment.patient.charAt(0)}${appointment.patient.split(' ').pop()?.charAt(0) || ''}`.toUpperCase();

  return {
    name: appointment.patient,
    initials,
    age: patientDetail ? calculateAge(patientDetail.dob) : 0,
    gender: (patientDetail?.gender as 'Male' | 'Female' | 'Other') || 'Other',
    bloodGroup: '—', // Not available in current API
    emergencyContact: patientDetail?.emergencyContact || '—',
    medicalHistory: patientDetail?.conditions || [],
    allergies: [], // Not available in current API
    previousVisits: patientDetail
      ? `${patientDetail.completedAppointments} visits · Last ${patientDetail.lastVisit || '—'}`
      : '—',
  };
}

export default function DoctorConsultationPage() {
  const params = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const appointmentId = params.appointmentId;

  const {
    data: appointmentData,
    isLoading: isLoadingAppointment,
    error: appointmentError,
  } = useDoctorAppointmentDetail(appointmentId);
  const { data: patientDetail, isLoading: isLoadingPatient } = useDoctorPatientDetail(
    appointmentData?.patientId
  );

  const [notes, setNotes] = useState<ConsultationNotesData>(initialNotes);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [diagnosis, setDiagnosis] = useState('');
  const [testRecommendations, setTestRecommendations] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  // Update patient info when both appointment and patient detail are loaded
  useEffect(() => {
    if (appointmentData && patientDetail) {
      const uiAppointment = transformDoctorAppointmentToUI(appointmentData);
      setPatientInfo(mapPatientToConsultationInfo(uiAppointment, patientDetail));

      // Pre-fill notes with appointment symptoms if available
      if (appointmentData.symptoms && !notes.symptoms) {
        setNotes((prev) => ({ ...prev, symptoms: appointmentData.symptoms || '' }));
      }
    }
  }, [appointmentData, patientDetail, notes.symptoms]);

  const handleNotesChange = (field: keyof ConsultationNotesData, value: string) => {
    setNotes((prev) => ({ ...prev, [field]: value }));
    if (saved) setSaved(false);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setShowValidation(false);
    // TODO: Save draft to backend
  };

  const handleIssuePrescription = () => {
    if (!diagnosis.trim() || medications.every((m) => !m.name.trim())) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    // TODO: Issue prescription via API
    alert('Prescription issued successfully!');
  };

  const handleCompleteConsultation = () => {
    if (!diagnosis.trim() || medications.every((m) => !m.name.trim())) {
      setShowValidation(true);
      return;
    }
    setCompleted(true);
    setSaved(true);
    setShowValidation(false);
  };

  const handleBack = () => {
    if (completed) {
      setCompleted(false);
      setSaved(false);
      setNotes(initialNotes);
      setMedications(initialMedications);
      setDiagnosis('');
      setTestRecommendations([]);
      setShowValidation(false);
    } else {
      router.back();
    }
  };

  // Show loading state
  if (isLoadingAppointment || isLoadingPatient) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Consultation">
          <div className="flex justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  // Show error state
  if (appointmentError || !appointmentData) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Consultation">
          <div className="mt-8 text-center">
            <AlertCircle className="text-destructive mx-auto mb-4 size-12" />
            <h2 className="mb-2 text-xl font-bold">Appointment not found</h2>
            <p className="text-muted-foreground mb-4">
              The consultation could not be loaded. The appointment may have been removed.
            </p>
            <button
              onClick={handleBack}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-bold"
            >
              Back to appointments
            </button>
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  if (!patientInfo) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Consultation">
          <div className="flex justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          </div>
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  if (completed) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Consultation">
          <ConsultationCompletion patientName={patientInfo.name} onBack={handleBack} />
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <DoctorPortalShell active="Consultation">
        <div className="mt-8 space-y-4">
          {/* Header with back button and save status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold"
            >
              <ChevronLeft className="size-4" />
              Back to appointments
            </button>
            <UnsavedChangesIndicator isSaved={saved} />
          </div>

          {/* Validation Alert */}
          <ValidationAlert isVisible={showValidation} />

          {/* Main three-column layout */}
          <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_390px]">
            {/* Patient Sidebar */}
            <ConsultationSidebar patient={patientInfo} />

            {/* Consultation Notes */}
            <ConsultationNotes notes={notes} onChange={handleNotesChange} />

            {/* Prescription Builder */}
            <PrescriptionBuilder
              medications={medications}
              onMedicationsChange={setMedications}
              diagnosis={diagnosis}
              onDiagnosisChange={setDiagnosis}
              testRecommendations={testRecommendations}
              onTestRecommendationsChange={setTestRecommendations}
            />
          </div>

          {/* Footer Actions */}
          <ConsultationFooter
            onSaveDraft={handleSaveDraft}
            onIssuePrescription={handleIssuePrescription}
            onCompleteConsultation={handleCompleteConsultation}
          />
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
