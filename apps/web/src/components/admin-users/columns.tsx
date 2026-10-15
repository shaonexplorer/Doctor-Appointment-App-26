'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal } from 'lucide-react';
import { type DataTableFeatures } from './data-table-features';
import { transformUsersToAdminFormat, type AdminUserData } from '@/hooks/useUsers';
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
 * Creates the column definitions for the Admin Users table.
 * Uses server-side sorting and filtering - the column definitions
 * declare which columns support these operations.
 */
export function createUserColumns(
  onViewUser: (user: AdminUserData) => void,
  onEditUser: (user: AdminUserData) => void,
  onChangeRole: (user: AdminUserData) => void,
  onSuspendUser: (user: AdminUserData) => void
): ColumnDef<DataTableFeatures, AdminUserData>[] {
  return columnHelper.columns([
    // Selection column
    // columnHelper.display({
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // }),

    // Name column with avatar
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.initials;
        return (
          <button
            onClick={() => onViewUser(user)}
            className="hover:text-primary flex w-full items-center gap-2 text-left font-medium transition-colors"
          >
            <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full text-xs font-bold">
              {initials}
            </span>
            <span>{user.name}</span>
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

    // Role column with badge
    columnHelper.accessor('role', {
      header: 'Role',
      cell: ({ getValue }) => {
        const role = getValue() as AdminUserData['role'];
        const roleColors: Record<AdminUserData['role'], string> = {
          ADMIN: 'bg-purple/20 text-purple',
          STAFF: 'bg-blue/20 text-blue',
          DOCTOR: 'bg-emerald/20 text-emerald',
          PATIENT: 'bg-amber/20 text-amber',
        };
        return (
          <Badge className={cn('text-xs font-medium', roleColors[role])} variant="outline">
            {role}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Status column with badge
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as AdminUserData['status'];
        const statusColors: Record<AdminUserData['status'], string> = {
          ACTIVE: 'bg-green/20 text-green',
          PENDING: 'bg-amber/20 text-amber',
          SUSPENDED: 'bg-red/20 text-red',
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

    // Created date column
    columnHelper.accessor('created', {
      header: 'Created',
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
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewUser(user)}
                className="flex items-center gap-2"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditUser(user)}
                className="flex items-center gap-2"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangeRole(user)}
                className="flex items-center gap-2"
              >
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSuspendUser(user)}
                className="text-destructive flex items-center gap-2"
              >
                {user.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
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
export { transformUsersToAdminFormat };
