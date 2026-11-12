/**
 * AI Assistant types for the Doctor Appointment App
 * Types for generative UI blocks, agent status, and conversation management
 */

export type AgentStatus =
  'idle' | 'thinking' | 'tool_running' | 'awaiting_confirmation' | 'completed' | 'error';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  ui?: GenUIBlock[];
  status?: AgentStatus;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

export interface DoctorResult {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  clinic: string;
  fee: string;
  rating: string;
  availability: string;
  initials: string;
}

export interface DoctorProfileData {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  clinic: string;
  fee: string;
  rating: string;
  availability: string;
  initials: string;
}

export interface AppointmentSlotsData {
  doctor: string;
  date: string;
  slots: string[];
}

export interface AppointmentReview {
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  visitType: string;
  fee: string;
}

export interface AppointmentSummary {
  reference: string;
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
}

export interface AppointmentSuccessData {
  doctor: string;
  date: string;
  time: string;
  clinic: string;
  reference: string;
  status: string;
}

export interface HealthcareFAQData {
  title: string;
  answer: string;
}

export interface HumanSupportData {
  message: string;
  contact: string;
}

export interface MedicalSafetyNoticeData {
  message: string;
}

export type GenUIBlock =
  | { type: 'doctor_results'; data: DoctorResult[] }
  | { type: 'doctor_profile'; data: DoctorProfileData }
  | { type: 'appointment_slots'; data: AppointmentSlotsData }
  | { type: 'appointment_review'; data: AppointmentReview }
  | { type: 'appointment_success'; data: AppointmentSuccessData }
  | { type: 'appointment_list'; data: AppointmentSummary[] }
  | { type: 'appointment_details'; data: AppointmentSummary }
  | { type: 'cancel_appointment'; data: AppointmentSummary }
  | { type: 'healthcare_faq'; data: HealthcareFAQData }
  | { type: 'human_support'; data: HumanSupportData }
  | { type: 'medical_safety_notice'; data: MedicalSafetyNoticeData };

export interface AgentResponse {
  threadId: string;
  message?: string;
  ui?: GenUIBlock[];
  status: AgentStatus;
}

export interface AgentRequest {
  threadId: string;
  message: string;
  uiContext?: {
    currentPage: string;
  };
}
