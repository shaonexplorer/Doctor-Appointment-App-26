'use client';

import { useCallback, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import {
  CategoryNav,
  DocumentPlaceholder,
  PrescriptionList,
  PrescriptionPreview,
  type Prescription,
  type RecordCategory,
} from '@/components/patient-records';
import { EmptyState } from '@/components/patient-records/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientPrescriptions, type PatientPrescription } from '@/hooks/usePatientPrescriptions';
import { useDownloadPrescriptionPDF } from '@/hooks/useDoctorPrescriptions';

export default function PatientRecordsPage() {
  const [category, setCategory] = useState<RecordCategory>('Prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [preview, setPreview] = useState(false);
  const [previewPrescription, setPreviewPrescription] = useState<PatientPrescription | null>(null);

  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    search: string | undefined;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>({ page: 1, limit: 10, search: undefined, sortBy: 'createdAt', sortOrder: 'desc' });

  const { data, isLoading, error, refetch } = usePatientPrescriptions(filters);
  const downloadPDF = useDownloadPrescriptionPDF();

  const prescriptions: PatientPrescription[] = data?.data ?? [];

  const isEmpty = !isLoading && prescriptions.length === 0;
  const isSearchEmpty = isEmpty && Boolean(filters.search);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, page: 1, search: query || undefined }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters((prev) => ({ ...prev, page: 1, search: undefined }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleViewPrescription = (item: Prescription) => {
    setPreviewPrescription(item as PatientPrescription);
    setPreview(true);
  };

  const handleDownloadPrescription = (item: Prescription) => {
    downloadPDF.mutate(item.id);
  };

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Medical Records">
        <div className="space-y-5">
          {/* Header with Search */}
          <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black">Medical records</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Securely access prescriptions, reports, labs, and visit history.
              </p>
            </div>
            <label className="relative">
              <Search
                className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search prescriptions by diagnosis, doctor, or record ID"
                className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none sm:w-60"
                aria-label="Search prescriptions"
              />
            </label>
          </div>

          {/* Error banner */}
          {error && !isLoading && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-xs font-semibold shadow-sm">
              Failed to load prescriptions.
              <button
                type="button"
                onClick={handleRetry}
                className="ml-2 underline underline-offset-4 hover:opacity-80"
                aria-label="Retry loading prescriptions"
              >
                Retry
              </button>
            </div>
          )}

          {/* Category Navigation & Content */}
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <CategoryNav activeCategory={category} onCategoryChange={setCategory} />

            {category === 'Prescriptions' ? (
              <>
                {isLoading ? (
                  <div className="space-y-3 p-5 sm:p-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-border rounded-2xl border p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="size-11 rounded-full" />
                          <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {[...Array(3)].map((_, j) => (
                            <Skeleton key={j} className="h-6 rounded-xl" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : prescriptions.length ? (
                  <PrescriptionList
                    items={prescriptions}
                    onPreview={handleViewPrescription}
                    onDownload={handleDownloadPrescription}
                    onPrint={() => console.log('Print prescription')}
                    onUpload={() => console.log('Upload clicked')}
                  />
                ) : (
                  <EmptyState
                    type={isSearchEmpty ? 'search' : 'empty'}
                    onClear={isSearchEmpty ? handleClearSearch : undefined}
                  />
                )}
              </>
            ) : (
              <DocumentPlaceholder
                category={category}
                onUpload={() => console.log('Upload', category)}
              />
            )}
          </div>

          {/* Pagination */}
          {data && !isEmpty && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                disabled={(filters.page ?? 1) <= 1}
                className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50"
              >
                <RefreshCw className="size-4 -rotate-180" aria-hidden="true" />
                Previous
              </button>
              <span className="text-muted-foreground text-sm font-medium">
                Page {filters.page ?? 1} of {data.meta.totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                disabled={(filters.page ?? 1) >= data.meta.totalPages}
                className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50"
              >
                Next
                <RefreshCw className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Prescription Preview Modal */}
          {preview && previewPrescription && (
            <PrescriptionPreview
              isOpen={preview}
              onClose={() => {
                setPreview(false);
                setPreviewPrescription(null);
              }}
              prescription={
                previewPrescription && {
                  id: previewPrescription.id,
                  doctor: previewPrescription.doctor,
                  patient: previewPrescription.patient,
                  diagnosis: previewPrescription.diagnosis,
                  created: previewPrescription.created,
                  medications: previewPrescription.medicationsList,
                  tests: previewPrescription.testsList,
                }
              }
              onDownload={() => previewPrescription && downloadPDF.mutate(previewPrescription.id)}
              onPrint={() => console.log('Print prescription')}
            />
          )}
        </div>
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
