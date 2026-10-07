export interface PatientInfo {
  name: string;
  initials: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: string;
  medicalHistory: string[];
  allergies: string[];
  previousVisits: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsultationNotesData {
  chiefComplaint: string;
  symptoms: string;
  clinicalNotes: string;
  diagnosis: string;
  treatmentPlan: string;
}

export interface ConsultationData {
  patient: PatientInfo;
  notes: ConsultationNotesData;
  medications: Medication[];
  testRecommendations: string[];
  isSaved: boolean;
  isCompleted: boolean;
}

export interface ConsultationSidebarProps {
  patient: PatientInfo;
  className?: string;
}

export interface ConsultationNotesProps {
  notes: ConsultationNotesData;
  onChange: (field: keyof ConsultationNotesData, value: string) => void;
  className?: string;
}

export interface PrescriptionBuilderProps {
  medications: Medication[];
  onMedicationsChange: (medications: Medication[]) => void;
  diagnosis: string;
  onDiagnosisChange: (value: string) => void;
  testRecommendations: string[];
  onTestRecommendationsChange: (recommendations: string[]) => void;
  className?: string;
}

export interface ConsultationFooterProps {
  onSaveDraft: () => void;
  onIssuePrescription: () => void;
  onCompleteConsultation: () => void;
  className?: string;
}

export interface ConsultationCompletionProps {
  patientName: string;
  onBack: () => void;
  className?: string;
}

export const CONSULTATION_FIELDS = [
  'Chief complaint',
  'Symptoms',
  'Clinical notes',
  'Diagnosis',
  'Treatment plan',
] as const;

export type ConsultationField = (typeof CONSULTATION_FIELDS)[number];

export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Every 8 hours',
  'Three times daily',
  'Four times daily',
  'As needed',
] as const;

export type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number];
