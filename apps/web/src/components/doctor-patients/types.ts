export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  lastVisit: string;
  diagnosis: string;
  nextAppointment: string;
  totalVisits: number;
  condition: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface PatientFilters {
  search: string;
  condition: string;
  status: string;
}

export interface PatientTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
}

export interface PatientCardProps {
  patient: Patient;
  onViewPatient: (patient: Patient) => void;
}

export interface PatientDrawerProps {
  patient: Patient | null;
  onClose: () => void;
  onScheduleAppointment?: (patient: Patient) => void;
  onViewFullRecord?: (patient: Patient) => void;
}

export interface PatientFiltersProps {
  filters: PatientFilters;
  onSearchChange: (search: string) => void;
  onConditionChange: (condition: string) => void;
  onStatusChange: (status: string) => void;
  conditions: string[];
  statuses: string[];
  resultCount: number;
}
