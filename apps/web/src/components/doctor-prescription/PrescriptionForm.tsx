'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Save, Printer } from 'lucide-react';
import { MedicationRow } from './MedicationRow';
import type { Medication, PrescriptionFormData } from './types';
import { PrescriptionPreview } from './PrescriptionPreview';

interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionFormData>;
  onSave?: (data: PrescriptionFormData) => void;
  onPrint?: () => void;
  onIssue?: (data: PrescriptionFormData) => void;
  patientName?: string;
  patientDob?: string;
  patientBloodGroup?: string;
  doctorName?: string;
  doctorTitle?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  appointmentId?: string;
  prescriptionId?: string;
}

const defaultMedication: Medication = {
  medicine: '',
  dosage: '',
  frequency: 'Once daily',
  duration: '7 days',
  instructions: '',
};

export function PrescriptionForm({
  initialData = {},
  onSave,
  onPrint,
  onIssue,
  patientName = 'Sarah Johnson',
  patientDob = '14 Feb 1988',
  patientBloodGroup = 'O+',
  doctorName = 'Dr. Michael Anderson',
  doctorTitle = 'Senior Consultant Cardiologist',
  clinicName = 'MediBook Health Clinic',
  clinicAddress = '12 Park Avenue',
  clinicPhone = '+91 98765 43210',
  clinicEmail = 'care@medibook.health',
  appointmentId = 'APT-2026-004821',
  prescriptionId = 'RX-2026-00914',
}: PrescriptionFormProps) {
  const [diagnosis, setDiagnosis] = useState(initialData.diagnosis || '');
  const [appointmentIdState, setAppointmentId] = useState(
    initialData.appointmentId || appointmentId
  );
  const [medications, setMedications] = useState<Medication[]>(
    initialData.medications && initialData.medications.length > 0
      ? initialData.medications
      : [defaultMedication]
  );
  const [testRecommendations, setTestRecommendations] = useState(
    initialData.testRecommendations || 'Lipid profile, ECG'
  );
  const [notes, setNotes] = useState(initialData.notes || '');
  const [saved, setSaved] = useState(false);
  const [issued, setIssued] = useState(false);

  const updateMedication = (index: number, key: keyof Medication, value: string) => {
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

  const handleSave = () => {
    const formData: PrescriptionFormData = {
      diagnosis,
      appointmentId: appointmentIdState,
      medications,
      testRecommendations,
      notes,
    };
    onSave?.(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleIssue = () => {
    const formData: PrescriptionFormData = {
      diagnosis,
      appointmentId: appointmentIdState,
      medications,
      testRecommendations,
      notes,
    };
    onIssue?.(formData);
    setIssued(true);
  };

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
            Digital prescription
          </p>
          <h2 className="mt-1 text-2xl font-black">Create prescription</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Draft, preview, and issue a secure prescription for {patientName}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              'border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors',
              saved && 'bg-primary/10 text-primary border-primary/20'
            )}
          >
            <Save className="size-4" aria-hidden="true" />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <Printer className="size-4" aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            onClick={handleIssue}
            className={cn(
              'bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold transition-colors hover:opacity-90',
              issued && 'bg-secondary text-secondary-foreground'
            )}
          >
            {issued ? 'Issued' : 'Issue Prescription'}
          </button>
        </div>
      </div>

      {issued && (
        <div className="border-success/30 bg-success/10 text-success rounded-xl border px-4 py-3 text-xs font-bold">
          Prescription issued securely. Patient notification queued and prescription ID
          {prescriptionId} created.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Diagnosis
              <input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="Enter diagnosis"
              />
            </label>
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Appointment ID
              <input
                value={appointmentIdState}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="Auto-generated"
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between">
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

          <div className="mt-4 grid gap-3">
            {medications.map((medication, index) => (
              <MedicationRow
                key={index}
                index={index}
                medication={medication}
                onUpdate={updateMedication}
                onRemove={removeMedication}
                canRemove={medications.length > 1}
              />
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
              Test recommendations
              <textarea
                value={testRecommendations}
                onChange={(e) => setTestRecommendations(e.target.value)}
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

        <PrescriptionPreview
          diagnosis={diagnosis}
          notes={notes}
          medications={medications}
          testRecommendations={testRecommendations}
          appointmentId={appointmentIdState}
          patientName={patientName}
          patientDob={patientDob}
          patientBloodGroup={patientBloodGroup}
          doctorName={doctorName}
          doctorTitle={doctorTitle}
          clinicName={clinicName}
          clinicAddress={clinicAddress}
          clinicPhone={clinicPhone}
          clinicEmail={clinicEmail}
          prescriptionId={prescriptionId}
          date={new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        />
      </div>
    </div>
  );
}
