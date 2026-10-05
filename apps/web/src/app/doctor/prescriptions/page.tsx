'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { Plus, Search, Filter } from 'lucide-react';
import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import {
  PrescriptionTable,
  PrescriptionCard,
  PrescriptionDrawer,
  CreatePrescriptionForm,
} from '@/components/doctor-prescriptions';
import {
  useDoctorPrescriptions,
  type PrescriptionUI,
  type DoctorPrescriptionFilters,
} from '@/hooks/useDoctorPrescriptions';
import { useDownloadPrescriptionPDF } from '@/hooks/useDoctorPrescriptions';

export default function DoctorPrescriptionsPage() {
  const [filters, setFilters] = useState<DoctorPrescriptionFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionUI | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormAppointmentId, setCreateFormAppointmentId] = useState<string | undefined>();

  const { data, isLoading, error: _error } = useDoctorPrescriptions(filters);
  const downloadPDF = useDownloadPrescriptionPDF();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, page: 1, search: query || undefined }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewPrescription = (prescription: PrescriptionUI) => {
    setSelectedPrescription(prescription);
    setIsDrawerOpen(true);
  };

  const handleDownloadPDF = (id: string) => {
    downloadPDF.mutate(id);
  };

  const handleCreatePrescription = (appointmentId?: string) => {
    setCreateFormAppointmentId(appointmentId);
    setShowCreateForm(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPrescription(null);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setCreateFormAppointmentId(undefined);
  };

  if (showCreateForm) {
    return (
      <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
        <DoctorPortalShell active="Prescriptions">
          <CreatePrescriptionForm
            initialAppointmentId={createFormAppointmentId}
            onBack={handleCloseCreateForm}
          />
        </DoctorPortalShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <DoctorPortalShell active="Prescriptions">
        <div className="mt-8 space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
                Digital prescriptions
              </p>
              <h2 className="mt-1 text-2xl font-black">Prescriptions</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                View and manage all prescriptions issued to patients.
              </p>
            </div>
            <button
              onClick={() => handleCreatePrescription()}
              className="bg-primary text-primary-foreground flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors hover:opacity-90 sm:w-auto"
            >
              <Plus className="size-4" />
              New Prescription
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search prescriptions by patient, diagnosis, medication..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary focus:border-primary h-10 w-full rounded-xl border pr-4 pl-10 text-sm outline-none focus:ring-2"
              />
            </div>
            <button className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors">
              <Filter className="size-4" />
              Filters
            </button>
          </div>

          {/* Prescription List */}
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <PrescriptionTable
                prescriptions={data?.data || []}
                isLoading={isLoading}
                onView={handleViewPrescription}
                onDownloadPDF={handleDownloadPDF}
                emptyMessage="No prescriptions found. Create your first prescription to get started."
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="border-border bg-card animate-pulse rounded-2xl border p-4"
                    >
                      <div className="bg-muted mb-2 h-4 w-1/4 rounded" />
                      <div className="bg-muted mb-1 h-3 w-1/2 rounded" />
                      <div className="bg-muted h-3 w-3/4 rounded" />
                    </div>
                  ))}
                </div>
              ) : data?.data.length === 0 ? (
                <div className="border-border bg-card rounded-2xl border p-8 text-center">
                  <p className="text-muted-foreground">No prescriptions found</p>
                  <button
                    onClick={() => handleCreatePrescription()}
                    className="bg-primary text-primary-foreground mt-4 rounded-xl px-4 py-2 text-sm font-bold"
                  >
                    Create Prescription
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {data?.data.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onView={handleViewPrescription}
                      onDownloadPDF={handleDownloadPDF}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {data && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                  disabled={(filters.page ?? 1) <= 1}
                  className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-muted-foreground text-sm font-medium">
                  Page {filters.page ?? 1} of {data.meta.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                  disabled={(filters.page ?? 1) >= data.meta.totalPages}
                  className="border-border bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Drawer */}
        <PrescriptionDrawer
          prescription={selectedPrescription}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onDownloadPDF={handleDownloadPDF}
        />
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
