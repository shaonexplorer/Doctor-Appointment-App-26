export interface StaffPatient {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  lastVisit: string;
  diagnosis: string;
  nextAppointment: string;
  doctor: string;
  totalVisits: number;
  status: 'Active' | 'Inactive';
  payment: 'Paid' | 'Pending';
}

export interface StaffPatientFilters {
  search: string;
  status: 'All statuses' | 'Active' | 'Inactive';
}

export interface StaffPatientMetrics {
  totalPatients: number;
  activePatients: number;
  newThisMonth: number;
  appointmentsToday: number;
}

export interface PatientTableProps {
  patients: StaffPatient[];
  onViewPatient: (patient: StaffPatient) => void;
}

export interface PatientCardProps {
  patient: StaffPatient;
  onViewPatient: (patient: StaffPatient) => void;
}

export interface PatientDrawerProps {
  patient: StaffPatient | null;
  onClose: () => void;
  onScheduleAppointment?: (patient: StaffPatient) => void;
  onViewFullRecord?: (patient: StaffPatient) => void;
}

export interface EmptyStateProps {
  message?: string;
}