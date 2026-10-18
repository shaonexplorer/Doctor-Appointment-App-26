'use client';

import * as React from 'react';

import { DataTable } from './data-table';
import { createFacilitiesColumns, type Facility } from './columns';

import { useClinics, type Clinic, type ClinicFilters } from '@/hooks/useClinics';
import { type ColumnFiltersState, type Updater } from '@tanstack/react-table';
import { useCreateClinic, useUpdateClinic, useDeleteClinic } from '@/hooks/useClinics';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const clinicFormSchema = z.object({
  name: z.string().min(2, 'Clinic name must be at least 2 characters').max(100),
  address: z.string().min(2, 'Address is required').max(500),
  phone: z.string().min(1, 'Phone number is required').max(20),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type ClinicFormValues = z.infer<typeof clinicFormSchema>;

interface AdminFacilitiesProps {
  kind: 'Clinics' | 'Departments';
}

export default function AdminFacilities({ kind }: AdminFacilitiesProps) {
  const isClinics = kind === 'Clinics';
  const title = isClinics ? 'Clinics' : 'Departments';

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema as any),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'ACTIVE',
    },
  });

  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingClinic, setEditingClinic] = React.useState<Clinic | null>(null);

  // Server-side table state
  const [pagination, setPagination] = React.useState<{
    pageIndex: number;
    pageSize: number;
  }>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');

  // Debounce search so we don't refetch on every keystroke
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filters/sorting change
  React.useEffect(() => {
    setPagination((prev) => (prev.pageIndex !== 0 ? { ...prev, pageIndex: 0 } : prev));
  }, [debouncedSearch, statusFilter, sorting]);

  // TanStack Query: server-side list with pagination, search, status filter, sorting
  const { data, isLoading, error, refetch } = useClinics({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  } satisfies Partial<ClinicFilters>);

  const clinics: Clinic[] = isClinics ? (data?.data ?? []) : [];
  const meta = data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  const createClinic = useCreateClinic();
  const updateClinic = useUpdateClinic();
  const deleteClinic = useDeleteClinic();

  const onSubmit = async (values: ClinicFormValues) => {
    try {
      if (dialogMode === 'edit' && editingClinic) {
        await updateClinic.mutateAsync({
          id: editingClinic.id,
          data: {
            name: values.name,
            address: values.address ?? null,
            phone: values.phone ?? null,
            email: values.email || null,
            status: values.status,
          },
        });
      } else {
        await createClinic.mutateAsync({
          name: values.name,
          address: values.address ?? null,
          phone: values.phone ?? null,
          email: values.email || null,
          status: values.status,
        });
      }
      form.reset({ status: 'ACTIVE' });
      setEditingClinic(null);
      setDialogMode('create');
      setDialogOpen(false);
      await refetch();
    } catch (err) {
      console.error('Failed to save clinic:', err);
      alert('Failed to save clinic. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) return;
    try {
      await deleteClinic.mutateAsync(id);
      await refetch();
    } catch {
      alert('Failed to delete clinic. Please try again.');
    }
  };

  const onEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setDialogMode('edit');
    form.reset({
      name: clinic.name,
      address: clinic.address ?? '',
      phone: clinic.phone ?? '',
      email: clinic.email ?? '',
      status: clinic.status,
    });
    setDialogOpen(true);
  };

  const onPaginationChange = React.useCallback(
    (updater: Updater<{ pageIndex: number; pageSize: number }>) => {
      setPagination(updater);
    },
    []
  );
  const onSortingChange = React.useCallback((updater: Updater<{ id: string; desc: boolean }[]>) => {
    setSorting((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);
  const onColumnFiltersChange = React.useCallback((updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const columns = React.useMemo(
    () => createFacilitiesColumns(kind, onEdit as unknown as (name: string) => void, handleDelete),
    [kind, onEdit, handleDelete]
  );

  const fieldError = (name: Extract<keyof ClinicFormValues, string>) => form.formState.errors[name];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">
            Manage {title.toLowerCase()} facilities and their status
          </p>
        </div> */}
      </div>

      {!isClinics && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Departments are managed under their parent clinic. A dedicated departments endpoint is not
          yet implemented; use
          <code>/admin/clinics</code> for facility data.
        </div>
      )}

      {/* Data table */}
      <DataTable<Facility>
        columns={columns}
        data={clinics as Facility[]}
        rowCount={meta.total}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
        isLoading={isLoading}
        showColumnVisibility
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search clinics…',
        }}
        statusFilter={{
          value: statusFilter,
          onChange: (value) => setStatusFilter(value as 'all' | 'ACTIVE' | 'INACTIVE'),
          items: [
            { value: 'all', label: 'All statuses' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
          ],
          placeholder: 'All statuses',
        }}
        addAction={
          isClinics
            ? {
                label: 'Add Clinic',
                onClick: () => {
                  setDialogMode('create');
                  form.reset({ status: 'ACTIVE' });
                  setDialogOpen(true);
                },
              }
            : undefined
        }
      />

      {/* Error state */}
      {error && (
        <div className="border-destructive/50 bg-destructive/5 rounded-md border p-3">
          <p className="text-destructive text-sm">
            Failed to load {title.toLowerCase()}.{' '}
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
            Try again
          </Button>
        </div>
      )}

      {/* Create / edit clinic dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Clinic' : 'Add Clinic'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'edit'
                ? 'Update the clinic details below.'
                : 'Add a new clinic facility to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic name</Label>
                <Input id="name" {...form.register('name')} aria-invalid={!!fieldError('name')} />
                {fieldError('name') && (
                  <p className="text-destructive text-sm">{fieldError('name')!.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...form.register('address')}
                  aria-invalid={!!fieldError('address')}
                />
                {fieldError('address') && (
                  <p className="text-destructive text-sm">{fieldError('address')!.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  aria-invalid={!!fieldError('phone')}
                />
                {fieldError('phone') && (
                  <p className="text-destructive text-sm">{fieldError('phone')!.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  aria-invalid={!!fieldError('email')}
                />
                {fieldError('email') && (
                  <p className="text-destructive text-sm">{fieldError('email')!.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.getValues('status')}
                onValueChange={(value) =>
                  form.setValue('status', value as ClinicFormValues['status'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={form.getValues('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {fieldError('status') && (
                <p className="text-destructive text-sm">{fieldError('status')!.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createClinic.isPending || updateClinic.isPending}>
                {createClinic.isPending || updateClinic.isPending
                  ? 'Saving…'
                  : dialogMode === 'edit'
                    ? 'Update Clinic'
                    : 'Create Clinic'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
