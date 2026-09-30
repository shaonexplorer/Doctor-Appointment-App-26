'use client';

import { useState, type ReactNode } from 'react';
import { AlertCircle, Check, ChevronLeft, Plus, Save, Trash2 } from 'lucide-react';

const fields = ['Chief complaint', 'Symptoms', 'Clinical notes', 'Diagnosis', 'Treatment plan'];

export function DoctorConsultation({ onBack }: { onBack: () => void }) {
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: 'Once daily', duration: '7 days', instructions: '' },
  ]);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [validation, setValidation] = useState(false);
  const updateMedication = (index: number, key: string, value: string) =>
    setMedications((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  if (completed)
    return (
      <div className="border-border bg-card mt-8 grid min-h-[520px] place-items-center rounded-2xl border p-8 text-center shadow-sm">
        <div>
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f3] text-[#258c70]">
            <Check className="size-8" />
          </div>
          <h2 className="mt-5 text-2xl font-black">Consultation completed</h2>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            Sarah Johnson&apos;s consultation and prescription were securely saved to her medical
            record.
          </p>
          <button
            onClick={onBack}
            className="bg-primary text-primary-foreground mt-6 rounded-xl px-5 py-3 text-xs font-bold"
          >
            Return to appointments
          </button>
        </div>
      </div>
    );
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold"
        >
          <ChevronLeft className="size-4" />
          Back to appointments
        </button>
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold">
          <span className={`size-2 rounded-full ${saved ? 'bg-[#258c70]' : 'bg-[#d68b42]'}`} />
          {saved ? 'All changes saved' : 'Unsaved changes'}
        </div>
      </div>
      {validation && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[#efc9c2] bg-[#fff7f5] px-4 py-3 text-xs font-semibold text-[#b86f63]"
        >
          <AlertCircle className="size-4" />
          Add a diagnosis and at least one medication before issuing the prescription.
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_390px]">
        <aside className="border-border bg-card rounded-2xl border p-5 shadow-sm">
          <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
            Patient information
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="text-primary grid size-12 place-items-center rounded-full bg-[#d9e8ff] font-bold">
              SJ
            </div>
            <div>
              <h2 className="font-black">Sarah Johnson</h2>
              <p className="text-muted-foreground text-xs">38 years · Female</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              ['Blood group', 'O+'],
              ['Emergency', 'David Johnson · +91 98765 43210'],
              ['History', 'Hypertension'],
              ['Allergies', 'Penicillin'],
              ['Previous visits', '12 visits · Last Sep 04'],
            ].map(([label, value]) => (
              <div key={label} className="border-border border-b pb-3">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  {label}
                </p>
                <p className="mt-1 text-xs font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </aside>
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
              Consultation notes
            </p>
            <h2 className="mt-1 text-xl font-black">Today&apos;s clinical assessment</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Sep 18, 2026 · In-person consultation
            </p>
          </div>
          <div className="mt-6 grid gap-4">
            {fields.map((field) => (
              <label key={field} className="grid gap-1.5 text-xs font-bold">
                {field}
                <textarea
                  rows={field === 'Clinical notes' || field === 'Treatment plan' ? 4 : 2}
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  className="border-border bg-background focus:border-primary focus:ring-primary/15 resize-none rounded-xl border p-3 text-sm font-normal outline-none focus:ring-2"
                />
              </label>
            ))}
          </div>
        </section>
        <aside className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
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
                      onClick={() =>
                        setMedications((items) =>
                          items.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      aria-label="Remove medication"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-2">
                  {[
                    ['Medicine name', 'name', 'Amoxicillin 500mg'],
                    ['Dosage', 'dosage', '1 tablet'],
                    ['Instructions', 'instructions', 'After meals'],
                  ].map(([label, key, placeholder]) => (
                    <input
                      key={key}
                      value={medication[key as keyof typeof medication]}
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
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Every 8 hours</option>
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
              onClick={() =>
                setMedications((items) => [
                  ...items,
                  {
                    name: '',
                    dosage: '',
                    frequency: 'Once daily',
                    duration: '7 days',
                    instructions: '',
                  },
                ])
              }
              className="border-primary/40 text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl border border-dashed py-2.5 text-xs font-bold"
            >
              <Plus className="size-4" />
              Add medication
            </button>
            <div>
              <label className="text-xs font-bold">Test recommendations</label>
              <button className="border-border text-muted-foreground mt-2 flex w-full items-center gap-2 rounded-xl border p-3 text-left text-xs font-semibold">
                <Plus className="text-primary size-4" />
                Add diagnostic test
              </button>
            </div>
            <label className="grid gap-1.5 text-xs font-bold">
              Diagnosis
              <textarea
                rows={3}
                placeholder="Enter diagnosis..."
                className="border-border bg-background focus:border-primary resize-none rounded-xl border p-3 text-sm font-normal outline-none"
              />
            </label>
          </div>
        </aside>
      </div>
      <footer className="border-border bg-card/95 sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-2 rounded-2xl border p-3 shadow-lg backdrop-blur">
        <button
          onClick={() => {
            setSaved(true);
            setValidation(false);
          }}
          className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
        >
          <Save className="size-4" />
          Save draft
        </button>
        <button
          onClick={() => setValidation(true)}
          className="border-primary text-primary hover:bg-primary/5 rounded-xl border px-4 py-2.5 text-xs font-bold"
        >
          Issue prescription
        </button>
        <button
          onClick={() => {
            setCompleted(true);
            setSaved(true);
          }}
          className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
        >
          Complete consultation
        </button>
      </footer>
    </div>
  );
}
function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p>{title}</p>
      {children}
    </div>
  );
}
