'use client';

import { useState, type ReactNode } from 'react';
import { Download, FileText, Plus, Printer, Save, Trash2 } from 'lucide-react';

const initialMedication = {
  medicine: 'Amoxicillin 500mg',
  dosage: '1 tablet',
  frequency: 'Twice daily',
  duration: '7 days',
  instructions: 'After meals',
};

export function DoctorPrescription() {
  const [medications, setMedications] = useState([initialMedication]);
  const [diagnosis, setDiagnosis] = useState('Essential hypertension');
  const [notes, setNotes] = useState(
    'Continue monitoring blood pressure at home. Return for review in two weeks.'
  );
  const [saved, setSaved] = useState(false);
  const [issued, setIssued] = useState(false);
  const update = (index: number, key: string, value: string) =>
    setMedications((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
            Digital prescription
          </p>
          <h2 className="mt-1 text-2xl font-black">Create prescription</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Draft, preview, and issue a secure prescription for Sarah Johnson.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSaved(true)}
            className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
          >
            <Save className="size-4" />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => window.print()}
            className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
          >
            <Printer className="size-4" />
            Print
          </button>
          <button
            onClick={() => setIssued(true)}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            {issued ? 'Issued' : 'Issue Prescription'}
          </button>
        </div>
      </div>
      {issued && (
        <div className="rounded-xl border border-[#bde5d7] bg-[#effaf6] px-4 py-3 text-xs font-bold text-[#258c70]">
          Prescription issued securely. Patient notification queued and prescription ID
          RX-2026-00914 created.
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Diagnosis">
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </Field>
            <Field label="Appointment ID">
              <input defaultValue="APT-2026-004821" />
            </Field>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                Medication table
              </p>
              <h3 className="mt-1 text-lg font-black">Prescribed medicines</h3>
            </div>
            <button
              onClick={() =>
                setMedications((items) => [
                  ...items,
                  {
                    medicine: '',
                    dosage: '',
                    frequency: 'Once daily',
                    duration: '7 days',
                    instructions: '',
                  },
                ])
              }
              className="border-border flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold"
            >
              <Plus className="size-4" />
              Add medicine
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            {medications.map((medication, index) => (
              <div key={index} className="border-border bg-background rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold">Medicine {index + 1}</p>
                  {medications.length > 1 && (
                    <button
                      onClick={() =>
                        setMedications((items) =>
                          items.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      aria-label="Remove medicine"
                    >
                      <Trash2 className="text-muted-foreground size-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ['Medicine', 'medicine'],
                      ['Dosage', 'dosage'],
                      ['Frequency', 'frequency'],
                      ['Duration', 'duration'],
                      ['Instructions', 'instructions'],
                    ] as const
                  ).map(([label, key]) => (
                    <Field key={key} label={label}>
                      <input
                        value={medication[key]}
                        onChange={(e) => update(index, key, e.target.value)}
                      />
                    </Field>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Test recommendations">
              <textarea defaultValue="Lipid profile, ECG" rows={3} />
            </Field>
            <Field label="Additional notes">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </Field>
          </div>
        </section>
        <PrescriptionPreview diagnosis={diagnosis} notes={notes} medications={medications} />
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
      {label}
      {children}
    </label>
  );
}
function PrescriptionPreview({
  diagnosis,
  notes,
  medications,
}: {
  diagnosis: string;
  notes: string;
  medications: (typeof initialMedication)[];
}) {
  return (
    <section className="border-border bg-card rounded-2xl border p-3 shadow-sm">
      <div className="border-border flex items-center justify-between border-b px-3 pb-3">
        <p className="flex items-center gap-2 text-sm font-black">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
            <FileText className="size-4" />
          </span>
          Medi<span className="text-primary">Book</span>
        </p>
        <button
          onClick={() => window.print()}
          aria-label="Download PDF"
          className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
        >
          <Download className="size-4" />
        </button>
      </div>
      <article className="prescription-paper mt-3 rounded-xl border border-[#dbe5eb] bg-white p-5 text-[#243b53] shadow-inner sm:p-7">
        <div className="border-primary flex items-start justify-between border-b-2 pb-4">
          <div>
            <h3 className="text-primary text-lg font-black">MediBook Health Clinic</h3>
            <p className="mt-1 text-[10px] text-[#607d8b]">
              12 Park Avenue · +91 98765 43210 · care@medibook.health
            </p>
          </div>
          <div className="text-right text-[10px] text-[#607d8b]">
            <p>Rx No. RX-2026-00914</p>
            <p>Sep 18, 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b border-[#dbe5eb] py-4 text-[10px]">
          <p>
            <b>Patient</b>
            <br />
            Sarah Johnson
            <br />
            DOB: 14 Feb 1988 · Blood group: O+
          </p>
          <p className="text-right">
            <b>Doctor</b>
            <br />
            Dr. Michael Anderson
            <br />
            Senior Consultant Cardiologist
          </p>
        </div>
        <div className="py-4 text-[10px]">
          <p className="text-primary font-bold tracking-wider uppercase">Diagnosis</p>
          <p className="mt-1 font-semibold">{diagnosis}</p>
        </div>
        <table className="w-full text-left text-[9px]">
          <thead>
            <tr className="text-primary border-y border-[#dbe5eb]">
              <th className="py-2">Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication, index) => (
              <tr key={index} className="border-b border-[#edf1f3]">
                <td className="py-2 font-bold">
                  {medication.medicine || '—'}
                  <span className="block font-normal text-[#607d8b]">
                    {medication.instructions}
                  </span>
                </td>
                <td>{medication.dosage}</td>
                <td>{medication.frequency}</td>
                <td>{medication.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-3 border-b border-[#dbe5eb] py-4 text-[10px] sm:grid-cols-2">
          <p>
            <b>Test recommendations</b>
            <br />
            Lipid profile · ECG
          </p>
          <p>
            <b>Additional notes</b>
            <br />
            {notes}
          </p>
        </div>
        <div className="flex items-end justify-between pt-8 text-[10px]">
          <p className="text-[#607d8b]">
            Valid for 30 days
            <br />
            Appointment: APT-2026-004821
          </p>
          <p className="text-center font-semibold">
            /s/ Michael Anderson
            <br />
            <span className="text-[#607d8b]">Doctor signature</span>
          </p>
        </div>
      </article>
    </section>
  );
}
