'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDoctorAppointments } from '@/hooks/useDoctorAppointments';
import { useCreatePrescription } from '@/hooks/useDoctorPrescriptions';
import { PrescriptionPDFPreview } from './PrescriptionPDFPreview';
import type { PrescriptionCreateInput } from '@/lib/api';

const defaultMedication = {
  name: '',
  dosage: '',
  frequency: 'Once daily',
  duration: '7 days',
  instructions: '',
};

const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Every 8 hours',
  'Three times daily',
  'Four times daily',
  'As needed',
];

interface CreatePrescriptionFormProps {
  initialAppointmentId?: string;
  onBack?: () => void;
}

export function CreatePrescriptionForm({
  initialAppointmentId,
  onBack,
}: CreatePrescriptionFormProps) {
  const router = useRouter();
  const createPrescription = useCreatePrescription();

  // Fetch completed appointments for the dropdown
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useDoctorAppointments({
    status: ['COMPLETED'],
    limit: 100,
  });

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(initialAppointmentId || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState<(typeof defaultMedication)[]>([defaultMedication]);
  const [tests, setTests] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [previewPrescription, setPreviewPrescription] = useState<PrescriptionCreateInput | null>(
    null
  );

  // Update selected appointment if initialAppointmentId changes
  useEffect(() => {
    if (initialAppointmentId) {
      setSelectedAppointmentId(initialAppointmentId);
    }
  }, [initialAppointmentId]);

  const selectedAppointment = appointmentsData?.data.find(
    (apt) => apt.id === selectedAppointmentId
  );

  // Check if the selected appointment is actually completed
  // If initialAppointmentId was provided but the appointment is not completed, show error
  const isAppointmentCompleted = selectedAppointment?.status === 'Completed';
  const hasInvalidInitialAppointment = Boolean(initialAppointmentId && !isAppointmentCompleted);

  const updateMedication = (index: number, key: keyof typeof defaultMedication, value: string) => {
    setMedications((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const removeMedication = (index: number) => {
    if (medications.length <= 1) return;
    setMedications((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const addMedication = () => {
    setMedications((items) => [...items, { ...defaultMedication }]);
  };

  const validateForm = () => {
    if (!selectedAppointmentId) {
      alert('Please select an appointment');
      return false;
    }
    if (!diagnosis.trim()) {
      alert('Please enter a diagnosis');
      return false;
    }
    if (medications.every((m) => !m.name.trim())) {
      alert('Please add at least one medication');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Check if the appointment is completed before allowing submission
    if (!isAppointmentCompleted) {
      alert(
        'Prescriptions can only be created for completed appointments. Please complete the appointment first.'
      );
      return;
    }

    const input: PrescriptionCreateInput = {
      appointmentId: selectedAppointmentId,
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
      tests: tests.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      await createPrescription.mutateAsync(input);
      setSaved(true);
      setPreviewPrescription(input);
      // Navigate to the prescriptions list after a short delay
      setTimeout(() => {
        router.push('/doctor/prescriptions');
      }, 2000);
    } catch (error) {
      console.error('Failed to create prescription:', error);
      alert('Failed to create prescription. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!validateForm()) return;

    const input: PrescriptionCreateInput = {
      appointmentId: selectedAppointmentId,
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
      tests: tests.trim() || null,
      notes: notes.trim() || null,
    };

    setPreviewPrescription(input);
  };

  if (isLoadingAppointments) {
    return (
      <div className="mt-8 space-y-5">
        <div className="flex justify-center py-12">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
        </div>
      </div>
    );
  }

  const completedAppointments = appointmentsData?.data || [];

  return (
    <div className="mt-8 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack ?? (() => router.back())}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          {/* <div>
            <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
              Digital prescription
            </p>
            <h2 className="mt-1 text-2xl font-black">Create prescription</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Draft and issue a secure prescription for a completed appointment.
            </p>
          </div> */}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={hasInvalidInitialAppointment}
            className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={createPrescription.isPending || hasInvalidInitialAppointment}
            className={cn(
              'bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold transition-colors hover:opacity-90',
              createPrescription.isPending && 'cursor-not-allowed opacity-50',
              hasInvalidInitialAppointment && 'cursor-not-allowed opacity-50'
            )}
          >
            {createPrescription.isPending && <Loader2 className="size-4 animate-spin" />}
            {createPrescription.isPending ? 'Creating...' : 'Create Prescription'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="border-success/30 bg-success/10 text-success rounded-xl border px-4 py-3 text-xs font-bold">
          Prescription created successfully! Redirecting...
        </div>
      )}

      {hasInvalidInitialAppointment && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-xs font-bold">
          The selected appointment is not completed. Prescriptions can only be created for completed
          appointments. Please select a completed appointment from the dropdown or complete the
          appointment first.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        {/* Main Form */}
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          {/* Appointment Selection */}
          <div className="mb-6">
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Select Completed Appointment
              <select
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              >
                <option value="">Select an appointment...</option>
                {completedAppointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patient} · {apt.date} · {apt.time} · {apt.specialty}
                  </option>
                ))}
              </select>
            </label>
            {selectedAppointment && (
              <div className="bg-background border-border mt-3 rounded-lg border p-3">
                <p className="text-sm font-medium">
                  {selectedAppointment.patient} · {selectedAppointment.date} at{' '}
                  {selectedAppointment.time}
                </p>
                <p className="text-muted-foreground text-xs">
                  {selectedAppointment.specialty} · {selectedAppointment.clinic} ·{' '}
                  {selectedAppointment.consultationType}
                </p>
                {selectedAppointment.symptoms &&
                  selectedAppointment.symptoms !== 'No symptoms recorded' && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Symptoms: {selectedAppointment.symptoms}
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Diagnosis */}
          <label className="text-muted-foreground mb-6 grid gap-1.5 text-[11px] font-bold">
            <p>
              Diagnosis <span className="text-destructive">*</span>
            </p>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
              className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              placeholder="Enter diagnosis..."
              required
            />
          </label>

          {/* Medications */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                  Medication table
                </p>
                <h3 className="mt-1 text-lg font-black">Prescribed medicines</h3>
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="border-border hover:bg-accent flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add medicine
              </button>
            </div>

            <div className="grid gap-3">
              {medications.map((medication, index) => (
                <div
                  key={index}
                  className={cn(
                    'border-border bg-background rounded-xl border p-3',
                    index > 0 && 'mt-3'
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold">Medication {index + 1}</p>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        aria-label={`Remove medication ${index + 1}`}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
                      <p>
                        Medicine <span className="text-destructive">*</span>
                      </p>
                      <input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="border-border bg-card focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        placeholder="e.g., Amoxicillin 500mg"
                      />
                    </label>
                    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
                      Dosage
                      <input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="border-border bg-card focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        placeholder="e.g., 1 tablet"
                      />
                    </label>
                    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
                      Frequency
                      <select
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="border-border bg-card h-9 w-full rounded-lg border px-2 text-sm"
                      >
                        {FREQUENCY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
                      Duration
                      <input
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="border-border bg-card focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        placeholder="e.g., 7 days"
                      />
                    </label>
                    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold sm:col-span-2 lg:col-span-3">
                      Instructions
                      <input
                        value={medication.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        className="border-border bg-card focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        placeholder="e.g., After meals, with water"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Recommendations & Notes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Test recommendations
              <textarea
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                rows={3}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="e.g., Lipid profile, ECG"
              />
            </label>
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Additional notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="Additional instructions for patient"
              />
            </label>
          </div>
        </section>

        {/* Preview Panel */}
        <PrescriptionPDFPreview
          prescription={
            previewPrescription
              ? {
                  id: 'preview',
                  patient: selectedAppointment?.patient || 'Patient',
                  diagnosis: previewPrescription.diagnosis,
                  medications: previewPrescription.medications.map((m) => ({
                    name: m.name,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    duration: m.duration,
                    instructions: m.instructions || '',
                  })),
                  tests: previewPrescription.tests ?? null,
                  notes: previewPrescription.notes ?? null,
                  date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                  appointmentId: previewPrescription.appointmentId,
                  doctorName: 'Dr. Current User',
                }
              : null
          }
          onClose={() => setPreviewPrescription(null)}
          onDownload={() => {}}
          onPrint={() => {}}
        />
      </div>
    </div>
  );
}
