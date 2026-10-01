export interface DoctorAppointment {
  id: string;
  patient: string;
  initials: string;
  time: string;
  symptoms: string;
  status: 'Confirmed' | 'Checked in' | 'Completed' | 'Cancelled' | 'No-show';
  payment: 'Pending' | 'Paid' | 'Refunded';
  date: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  specialty: string;
  clinic: string;
}

export type AppointmentTab = 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'No-show';

export interface AppointmentTabsProps {
  activeTab: AppointmentTab;
  onChange: (tab: AppointmentTab) => void;
  counts: Record<AppointmentTab, number>;
  className?: string;
}

export interface AppointmentTableProps {
  appointments: DoctorAppointment[];
  onView: (appointment: DoctorAppointment) => void;
  onStartConsultation: (appointment: DoctorAppointment) => void;
  onReschedule: (appointment: DoctorAppointment) => void;
  className?: string;
}

export interface AppointmentCardProps {
  appointment: DoctorAppointment;
  onView: () => void;
  onStartConsultation: () => void;
  onReschedule: () => void;
  className?: string;
}

export interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onStartConsultation?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  className?: string;
}

export interface CancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointment: DoctorAppointment | null;
  isLoading?: boolean;
  className?: string;
}

export interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string) => void;
  appointment: DoctorAppointment | null;
  availableSlots: Array<{ id: string; time: string }>;
  isLoading?: boolean;
  className?: string;
}

export interface EmptyStateProps {
  tab: AppointmentTab;
  onClearFilters?: () => void;
  className?: string;
}

export interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface NoticeProps {
  message: string;
  onDismiss: () => void;
  className?: string;
}
