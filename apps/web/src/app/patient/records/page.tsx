"use client";

import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import {
  CategoryNav,
  PrescriptionList,
  DocumentPlaceholder,
  PrescriptionPreview,
  type RecordCategory,
  type Prescription,
} from "@/components/patient-records";
import { Search } from "lucide-react";

const prescriptions: Prescription[] = [
  { id: "RX-2026-003988", doctor: "Dr. Sarah Williams", date: "Aug 18, 2026", diagnosis: "Annual wellness check-up", medications: 3, tests: "CBC, Lipid profile", created: "Aug 18, 2026" },
  { id: "RX-2026-003741", doctor: "Dr. James Patel", date: "Jul 31, 2026", diagnosis: "Recurring headaches", medications: 1, tests: "MRI recommended", created: "Jul 31, 2026" },
];

export default function PatientRecordsPage() {
  const [category, setCategory] = useState<RecordCategory>("Prescriptions");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(false);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);

  const filtered = useMemo(
    () => prescriptions.filter((item) => `${item.id} ${item.doctor} ${item.diagnosis}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Medical Records">
        <div className="space-y-5">
          {/* Header with Search */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black">Medical records</h2>
              <p className="mt-1 text-xs text-muted-foreground">Securely access prescriptions, reports, labs, and visit history.</p>
            </div>
            <label className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search records"
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary sm:w-60"
                aria-label="Search records"
              />
            </label>
          </div>

          {/* Category Navigation & Content */}
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <CategoryNav activeCategory={category} onCategoryChange={setCategory} />

            {category === "Prescriptions" ? (
              <PrescriptionList
                items={filtered}
                onPreview={(item) => { setPreviewPrescription(item); setPreview(true); }}
                onDownload={(item) => console.log("Download", item.id)}
                onPrint={(item) => console.log("Print", item.id)}
                onUpload={() => console.log("Upload clicked")}
              />
            ) : (
              <DocumentPlaceholder category={category} onUpload={() => console.log("Upload", category)} />
            )}
          </div>

          {/* Prescription Preview Modal */}
          {preview && (
            <PrescriptionPreview
              isOpen={preview}
              onClose={() => { setPreview(false); setPreviewPrescription(null); }}
              prescription={previewPrescription ? {
                id: previewPrescription.id,
                doctor: `${previewPrescription.doctor} · General Medicine`,
                patient: "Sarah Johnson",
                diagnosis: previewPrescription.diagnosis,
                created: previewPrescription.date,
                medications: [{ name: "Amoxicillin", dosage: "500 mg", frequency: "3 times daily", duration: "7 days", instructions: "After meals" }],
                tests: previewPrescription.tests.split(", ").map(t => t.trim()),
              } : undefined}
              onDownload={() => console.log("Download prescription")}
              onPrint={() => console.log("Print prescription")}
            />
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}