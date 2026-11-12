'use client';

import { useMemo, useState } from 'react';
import {
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  History,
  Pill,
  Printer,
  Search,
  Upload,
  X,
} from 'lucide-react';

type Category = 'Prescriptions' | 'Diagnostic Reports' | 'Lab Results' | 'Visit History';

type Prescription = {
  id: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medications: number;
  tests: string;
  created: string;
};
const prescriptions: Prescription[] = [
  {
    id: 'RX-2026-003988',
    doctor: 'Dr. Sarah Williams',
    date: 'Aug 18, 2026',
    diagnosis: 'Annual wellness check-up',
    medications: 3,
    tests: 'CBC, Lipid profile',
    created: 'Aug 18, 2026',
  },
  {
    id: 'RX-2026-003741',
    doctor: 'Dr. James Patel',
    date: 'Jul 31, 2026',
    diagnosis: 'Recurring headaches',
    medications: 1,
    tests: 'MRI recommended',
    created: 'Jul 31, 2026',
  },
];

export function PatientRecords() {
  const [category, setCategory] = useState<Category>('Prescriptions');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(false);
  const filtered = useMemo(
    () =>
      prescriptions.filter((item) =>
        `${item.id} ${item.doctor} ${item.diagnosis}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <div className="space-y-5">
      <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black">Medical records</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Securely access prescriptions, reports, labs, and visit history.
          </p>
        </div>
        <label className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search records"
            className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none sm:w-60"
          />
        </label>
      </div>
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="border-border bg-card rounded-2xl border p-2 shadow-sm">
          {(
            [
              ['Prescriptions', Pill],
              ['Diagnostic Reports', FileText],
              ['Lab Results', FlaskConical],
              ['Visit History', History],
            ] as const
          ).map(([label, Icon]) => (
            <button
              key={label}
              onClick={() => setCategory(label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${category === label ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
        {category === 'Prescriptions' ? (
          <PrescriptionList items={filtered} onPreview={() => setPreview(true)} />
        ) : (
          <DocumentPlaceholder category={category} onUpload={() => {}} />
        )}
      </div>
      {preview && <PrescriptionPreview onClose={() => setPreview(false)} />}
    </div>
  );
}

function PrescriptionList({ items, onPreview }: { items: Prescription[]; onPreview: () => void }) {
  return (
    <section className="border-border bg-card rounded-2xl border shadow-sm">
      <div className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="font-black">My prescriptions</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {items.length} prescription records available
          </p>
        </div>
        <button className="border-border hover:bg-secondary flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-black">
          <Upload className="size-4" /> Upload document
        </button>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-5 sm:p-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="border-border hover:border-primary/40 rounded-2xl border p-4 transition hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f8f3] text-[#218765]">
                    <Pill className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-black">{item.id}</h4>
                      <span className="text-primary rounded-full bg-[#eaf1ff] px-2 py-1 text-[10px] font-black">
                        Active record
                      </span>
                    </div>
                    <p className="text-primary mt-1 text-xs font-bold">{item.doctor}</p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {item.date} · {item.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 xl:w-[390px]">
                  <Info label="Medications" value={`${item.medications}`} />
                  <Info label="Tests" value={item.tests} />
                  <Info label="Created" value={item.created} />
                </div>
                <div className="border-border flex gap-2 border-t pt-3 xl:border-t-0 xl:pt-0">
                  <button
                    onClick={onPreview}
                    className="border-border hover:bg-secondary flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-black"
                  >
                    <FileText className="size-4" /> View
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-black hover:opacity-90"
                  >
                    <Download className="size-4" /> PDF
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <FileText className="text-primary/50 mx-auto size-8" />
          <h3 className="mt-4 font-black">No records found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Try another search or upload a new document.
          </p>
        </div>
      )}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-xl p-3">
      <p className="text-muted-foreground text-[10px] font-black tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-black">{value}</p>
    </div>
  );
}
function DocumentPlaceholder({ category, onUpload }: { category: Category; onUpload: () => void }) {
  return (
    <section className="border-border bg-card rounded-2xl border p-8 text-center shadow-sm">
      <div className="bg-secondary text-primary mx-auto grid size-14 place-items-center rounded-2xl">
        <FileText className="size-6" />
      </div>
      <h3 className="mt-5 text-lg font-black">{category}</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        Your {category.toLowerCase()} will appear here when they are added to your secure record.
      </p>
      <button
        onClick={onUpload}
        className="bg-primary text-primary-foreground mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-black"
      >
        <Upload className="size-4" /> Upload document
      </button>
    </section>
  );
}
function PrescriptionPreview({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Prescription preview"
        className="bg-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-black tracking-wider uppercase">Prescription</p>
            <h2 className="mt-2 text-2xl font-black">RX-2026-003988</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-secondary rounded-xl p-2"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="bg-secondary mt-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-2">
          <Info label="Doctor" value="Dr. Sarah Williams · General Medicine" />
          <Info label="Patient" value="Sarah Johnson" />
          <Info label="Diagnosis" value="Annual wellness check-up" />
          <Info label="Created" value="August 18, 2026" />
        </div>
        <div className="mt-7 overflow-x-auto">
          <h3 className="mb-3 font-black">Medication</h3>
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-xs">
                <th className="pb-3">Medication</th>
                <th className="pb-3">Dosage</th>
                <th className="pb-3">Frequency</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Instructions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-border border-b">
                <td className="py-4 font-black">Amoxicillin</td>
                <td className="py-4">500 mg</td>
                <td className="py-4">3 times daily</td>
                <td className="py-4">7 days</td>
                <td className="py-4">After meals</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-7">
          <h3 className="font-black">Test recommendations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-secondary rounded-full px-3 py-2 text-xs font-bold">CBC</span>
            <span className="bg-secondary rounded-full px-3 py-2 text-xs font-bold">ECG</span>
            <span className="bg-secondary rounded-full px-3 py-2 text-xs font-bold">
              Lipid Profile
            </span>
          </div>
        </div>
        <div className="border-border mt-8 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
          <button className="border-border hover:bg-secondary flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black">
            <Printer className="size-4" /> Print
          </button>
          <button className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black">
            <Download className="size-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
