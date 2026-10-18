'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
import { type DataTableFeatures } from './data-table-features';
import { cn } from '@/lib/utils';
import type { Clinic } from '@/lib/api';

export type Department = {
  id: string;
  name: string;
  description: string | null;
  clinic: string | null;
  doctors: number;
  appointments: number;
  status: 'ACTIVE' | 'INACTIVE';
};

export type Facility = Clinic | Department;

function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  return (
    <Badge
      variant={status === 'ACTIVE' ? 'success' : 'outline'}
      className={cn(
        'px-2.5 py-1 text-[10px] font-black',
        status !== 'ACTIVE' && 'border-slate-200 bg-slate-50 text-slate-500'
      )}
    >
      {status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </Badge>
  );
}

function createClinicColumns(
  onEdit: (clinic: Clinic) => void,
  onDelete: (id: string) => void
): ColumnDef<DataTableFeatures, Clinic>[] {
  const columnHelper = createColumnHelper<DataTableFeatures, Clinic>();
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Clinic name',
      cell: ({ getValue }) => <span className="font-bold">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: ({ getValue }) => <span className="text-slate-500">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('departments', {
      header: 'Departments',
      cell: ({ getValue }) => <span className="tabular-nums">{getValue() as number}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('doctors', {
      header: 'Doctors',
      cell: ({ getValue }) => <span className="tabular-nums">{getValue() as number}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue() as 'ACTIVE' | 'INACTIVE'} />,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const clinic = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(clinic)}
              aria-label={`Edit ${clinic.name}`}
            >
              <Edit3 className="size-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete clinic "${clinic.name}"?`)) {
                  onDelete(clinic.id);
                }
              }}
              aria-label={`Delete ${clinic.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]) as ColumnDef<DataTableFeatures, Clinic>[];
}

function createDepartmentColumns(
  onEdit: (department: Department) => void,
  onDelete: (id: string) => void
): ColumnDef<DataTableFeatures, Department>[] {
  const columnHelper = createColumnHelper<DataTableFeatures, Department>();
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Department',
      cell: ({ getValue }) => <span className="font-bold">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ getValue }) => <span className="text-slate-500">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('clinic', {
      header: 'Clinic',
      cell: ({ getValue }) => <span className="text-slate-500">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('doctors', {
      header: 'Doctors',
      cell: ({ getValue }) => <span className="tabular-nums">{getValue() as number}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('appointments', {
      header: 'Appointments',
      cell: ({ getValue }) => <span className="tabular-nums">{getValue() as number}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue() as 'ACTIVE' | 'INACTIVE'} />,
      enableSorting: true,
      filterFn: 'includesString',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const department = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(department)}
              aria-label={`Edit ${department.name}`}
            >
              <Edit3 className="size-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete department "${department.name}"?`)) {
                  onDelete(department.id);
                }
              }}
              aria-label={`Delete ${department.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]) as ColumnDef<DataTableFeatures, Department>[];
}

/**
 * Creates the column definitions for the admin facilities table.
 * Column set varies by kind (clinics vs departments).
 */
export function createFacilitiesColumns(
  kind: 'Clinics' | 'Departments',
  onEdit: (name: string) => void,
  onDelete: (id: string) => void
): ColumnDef<DataTableFeatures, Facility>[] {
  return kind === 'Clinics'
    ? (createClinicColumns(onEdit as unknown as (clinic: Clinic) => void, onDelete) as ColumnDef<
        DataTableFeatures,
        Facility
      >[])
    : (createDepartmentColumns(
        onEdit as unknown as (department: Department) => void,
        onDelete
      ) as ColumnDef<DataTableFeatures, Facility>[]);
}
