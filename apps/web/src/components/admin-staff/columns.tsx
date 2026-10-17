'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { type DataTableFeatures } from '@/components/admin-users/data-table-features';
import { type AdminUserData } from '@/hooks/useUsers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Column helper with feature types and data type
const columnHelper = createColumnHelper<DataTableFeatures, AdminUserData>();

/**
 * Creates the column definitions for the Admin Staff table.
 * Uses server-side sorting and filtering - the column declarations
 * declare which columns support these operations.
 */
export function createStaffColumns(
  onViewStaff: (staff: AdminUserData) => void,
  onEditStaff: (staff: AdminUserData) => void,
  onToggleStatus: (staff: AdminUserData) => void
): ColumnDef<DataTableFeatures, AdminUserData>[] {
  return columnHelper.columns([
    // Name column with avatar
    columnHelper.accessor('name', {
      header: 'Staff',
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <button
            onClick={() => onViewStaff(staff)}
            className="hover:text-primary flex w-full items-center gap-2 text-left font-medium transition-colors"
          >
            <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              {staff.initials}
            </span>
            <span className="font-semibold">{staff.name}</span>
          </button>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Email column
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Phone column
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Status column with badge
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as AdminUserData['status'];
        const statusColors: Record<AdminUserData['status'], string> = {
          ACTIVE: 'bg-emerald/50 text-emerald-700',
          PENDING: 'bg-amber/50 text-amber-700',
          SUSPENDED: 'bg-rose/50 text-rose-700',
        };
        return (
          <Badge className={cn('text-xs font-medium', statusColors[status])} variant="outline">
            {status}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Joined date column
    columnHelper.accessor('created', {
      header: 'Joined',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
    }),

    // Last activity column
    columnHelper.accessor('activity', {
      header: 'Last Activity',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
    }),

    // Actions column
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewStaff(staff)}
                className="flex items-center gap-2"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditStaff(staff)}
                className="flex items-center gap-2"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(staff)}
                className="text-destructive flex items-center gap-2"
              >
                {staff.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}

// Re-export for convenience
export type { AdminUserData };
