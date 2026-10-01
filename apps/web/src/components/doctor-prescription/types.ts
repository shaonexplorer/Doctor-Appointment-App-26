export interface Medication {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionFormData {
  diagnosis: string;
  appointmentId: string;
  medications: Medication[];
  testRecommendations: string;
  notes: string;
}

export interface PrescriptionPreviewProps {
  diagnosis: string;
  notes: string;
  medications: Medication[];
  testRecommendations: string;
  appointmentId: string;
  patientName: string;
  patientDob: string;
  patientBloodGroup: string;
  doctorName: string;
  doctorTitle: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  prescriptionId: string;
  date: string;
}
