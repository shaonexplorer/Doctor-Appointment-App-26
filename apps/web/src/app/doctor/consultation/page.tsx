'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { ChevronLeft } from 'lucide-react';
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

const mockPatient: PatientInfo = {
  name: 'Sarah Johnson',
  initials: 'SJ',
  age: 38,
  gender: 'Female',
  bloodGroup: 'O+',
  emergencyContact: 'David Johnson · +91 98765 43210',
  medicalHistory: ['Hypertension'],
  allergies: ['Penicillin'],
  previousVisits: '12 visits · Last Sep 04',
};

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

export default function DoctorConsultationPage() {
  const [notes, setNotes] = useState<ConsultationNotesData>(initialNotes);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [diagnosis, setDiagnosis] = useState('');
  const [testRecommendations, setTestRecommendations] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleNotesChange = (field: keyof ConsultationNotesData, value: string) => {
    setNotes((prev) => ({ ...prev, [field]: value }));
    if (saved) setSaved(false);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setShowValidation(false);
  };

  const handleIssuePrescription = () => {
    if (!diagnosis.trim() || medications.every((m) => !m.name.trim())) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    // Issue prescription logic would go here
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
      // Navigate back to appointments
      window.history.back();
    }
  };

  if (completed) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Consultation">
          <ConsultationCompletion patientName={mockPatient.name} onBack={handleBack} />
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
            <ConsultationSidebar patient={mockPatient} />

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
