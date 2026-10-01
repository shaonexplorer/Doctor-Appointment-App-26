'use client';

import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import type { PrescriptionBuilderProps, Medication, FrequencyOption } from './types';

const MEDICATION_FIELDS = [
  ['Medicine name', 'name', 'Amoxicillin 500mg'],
  ['Dosage', 'dosage', '1 tablet'],
  ['Instructions', 'instructions', 'After meals'],
] as const;

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  'Once daily',
  'Twice daily',
  'Every 8 hours',
  'Three times daily',
  'Four times daily',
  'As needed',
];

export function PrescriptionBuilder({
  medications,
  onMedicationsChange,
  diagnosis,
  onDiagnosisChange,
  testRecommendations,
  onTestRecommendationsChange,
  className,
}: PrescriptionBuilderProps) {
  const updateMedication = (index: number, key: keyof Medication, value: string) => {
    onMedicationsChange(
      medications.map((med, i) => (i === index ? { ...med, [key]: value } : med))
    );
  };

  const addMedication = () => {
    onMedicationsChange([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: '',
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length <= 1) return;
    onMedicationsChange(medications.filter((_, i) => i !== index));
  };

  const addTestRecommendation = () => {
    const newTest = prompt('Enter diagnostic test name:');
    if (newTest?.trim()) {
      onTestRecommendationsChange([...testRecommendations, newTest.trim()]);
    }
  };

  const removeTestRecommendation = (index: number) => {
    onTestRecommendationsChange(testRecommendations.filter((_, i) => i !== index));
  };

  return (
    <aside
      className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
            Prescription builder
          </p>
          <h2 className="mt-1 text-xl font-black">Issue prescription</h2>
        </div>
        <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold">
          Draft
        </span>
      </div>
      <div className="mt-5 grid gap-4">
        {medications.map((medication, index) => (
          <div key={index} className="border-border bg-background rounded-xl border p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold">Medication {index + 1}</p>
              {medications.length > 1 && (
                <button
                  onClick={() => removeMedication(index)}
                  aria-label="Remove medication"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <div className="grid gap-2">
              {MEDICATION_FIELDS.map(([label, key, placeholder]) => (
                <input
                  key={key}
                  value={medication[key]}
                  onChange={(event) => updateMedication(index, key, event.target.value)}
                  placeholder={placeholder}
                  aria-label={label}
                  className="border-border bg-card focus:border-primary h-9 rounded-lg border px-3 text-xs outline-none"
                />
              ))}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={medication.frequency}
                  onChange={(event) => updateMedication(index, 'frequency', event.target.value)}
                  aria-label="Frequency"
                  className="border-border bg-card h-9 rounded-lg border px-2 text-xs"
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  value={medication.duration}
                  onChange={(event) => updateMedication(index, 'duration', event.target.value)}
                  aria-label="Duration"
                  className="border-border bg-card h-9 rounded-lg border px-3 text-xs"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addMedication}
          className="border-primary/40 text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl border border-dashed py-2.5 text-xs font-bold"
        >
          <Plus className="size-4" />
          Add medication
        </button>
        <div>
          <label className="text-xs font-bold">Test recommendations</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {testRecommendations.map((test, index) => (
              <span
                key={index}
                className="border-border bg-background flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
              >
                {test}
                <button
                  onClick={() => removeTestRecommendation(index)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${test}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </span>
            ))}
            <button
              onClick={addTestRecommendation}
              className="border-border text-muted-foreground hover:bg-secondary flex items-center gap-2 rounded-xl border p-2 text-xs font-semibold"
            >
              <Plus className="text-primary size-4" />
              Add diagnostic test
            </button>
          </div>
        </div>
        <label className="grid gap-1.5 text-xs font-bold">
          Diagnosis
          <textarea
            rows={3}
            placeholder="Enter diagnosis..."
            value={diagnosis}
            onChange={(event) => onDiagnosisChange(event.target.value)}
            className="border-border bg-background focus:border-primary resize-none rounded-xl border p-3 text-sm font-normal outline-none"
          />
        </label>
      </div>
    </aside>
  );
}
