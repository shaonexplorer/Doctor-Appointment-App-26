'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
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
  type DoctorAppointmentUI,
} from '@/hooks/useDoctorAppointments';
import { useDoctorPatientDetail, type DoctorPatientDetail } from '@/hooks/useDoctorPatients';
import { useCreatePrescription } from '@/hooks/useDoctorPrescriptions';
import { useCompleteAppointmentAsDoctor } from '@/hooks/useDoctorAppointments';
import { useRouter, useParams } from 'next/navigation';
import { toast } from '@/components/ui/toast';

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
    dosage: '1 Tablet',
    frequency: 'Once daily',
    duration: '7 days',
    instructions: 'After meals',
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
  const createPrescription = useCreatePrescription();
  const completeAppointment = useCompleteAppointmentAsDoctor();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update patient info when both appointment and patient detail are loaded
  useEffect(() => {
    if (appointmentData && patientDetail) {
      setPatientInfo(mapPatientToConsultationInfo(appointmentData, patientDetail));

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

  const handleIssuePrescription = async () => {
    if (!diagnosis.trim() || medications.every((m) => !m.name.trim())) {
      setShowValidation(true);
      return;
    }

    if (!appointmentData) {
      toast.add({ title: 'Error', description: 'Appointment data not loaded', type: 'error' });
      return;
    }

    setShowValidation(false);
    setIsSubmitting(true);

    try {
      const input = {
        appointmentId: appointmentData.id,
        diagnosis,
        medications: medications
          .filter((m) => m.name.trim())
          .map((m) => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions || null,
          })),
        tests: testRecommendations.length > 0 ? testRecommendations.join(', ') : null,
        notes: notes.treatmentPlan || notes.clinicalNotes || null,
      };

      await createPrescription.mutateAsync(input);
      toast.add({
        title: 'Success',
        description: 'Prescription issued successfully!',
        type: 'success',
      });
      setSaved(true);
    } catch (error) {
      console.error('Failed to issue prescription:', error);
      toast.add({
        title: 'Error',
        description: 'Failed to issue prescription. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!diagnosis.trim() || medications.every((m) => !m.name.trim())) {
      setShowValidation(true);
      return;
    }

    if (!appointmentData) {
      toast.add({ title: 'Error', description: 'Appointment data not loaded', type: 'error' });
      return;
    }

    setShowValidation(false);
    setIsSubmitting(true);

    try {
      // Combine all consultation notes into a comprehensive note
      const consultationNotes = [
        notes.chiefComplaint && `Chief Complaint: ${notes.chiefComplaint}`,
        notes.symptoms && `Symptoms: ${notes.symptoms}`,
        notes.clinicalNotes && `Clinical Notes: ${notes.clinicalNotes}`,
        notes.diagnosis && `Diagnosis: ${notes.diagnosis}`,
        notes.treatmentPlan && `Treatment Plan: ${notes.treatmentPlan}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      // Complete the appointment via API
      await completeAppointment.mutateAsync({
        id: appointmentData.id,
        notes: consultationNotes || null,
        diagnosis: diagnosis.trim() || null,
      });

      // Mark as completed locally
      setCompleted(true);
      setSaved(true);
      toast.add({
        title: 'Success',
        description: 'Consultation completed successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to complete consultation:', error);
      toast.add({
        title: 'Error',
        description: 'Failed to complete consultation. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
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
          {isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-card flex items-center gap-3 rounded-2xl p-6">
                <Loader2 className="text-primary size-6 animate-spin" />
                <span>Creating prescription...</span>
              </div>
            </div>
          )}
        </div>
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
