'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import {
  useUsers,
  transformUsersToAdminFormat,
  getStatusBadgeTone,
  type AdminUserData,
} from '@/hooks/useUsers';
import { DataTable } from './data-table';
import { createUserColumns } from './columns';
import { AddUserDialog } from './AddUserDialog';

import type { ColumnFiltersState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toast';

const roles = ['ADMIN', 'STAFF', 'DOCTOR', 'PATIENT'] as const;

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
        tone === 'green'
          ? 'bg-primary/30 text-primary'
          : tone === 'red'
            ? 'bg-destructive/50 text-destructive-foreground'
            : tone === 'amber'
              ? 'bg-warning/50 text-warning-foreground'
              : 'bg-primary/30 text-primary'
      }`}
    >
      {children}
    </span>
  );
}

export function AdminUsers() {
  const [role, setRole] = useState('All roles');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<AdminUserData | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [_modal, _setModal] = useState<'edit' | 'confirm' | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // No tab filter - show all users
  const userTypeFilter = undefined;

  // Fetch users from API
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    userType: userTypeFilter,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    // Column filters are passed as individual query params
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  });

  const users = usersResponse?.data || [];
  const totalUsers = usersResponse?.meta.total || 0;

  // Transform API data to admin format
  const transformedUsers = useMemo(() => transformUsersToAdminFormat(users), [users]);

  // Column definitions with action handlers
  const columns = createUserColumns(
    (user) => setDrawer(user), // onViewUser
    (user) => setDrawer(user), // onEditUser (will use drawer edit button)
    (user) => setDrawer(user), // onChangeRole (will use drawer button)
    (user) => setDrawer(user) // onSuspendUser (will use drawer button)
  );

  return (
    <div className="mt-8 space-y-5">
      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-primary/10 text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold">
          {selected.length} selected
          <button
            onClick={() => alert(`Bulk action applied to ${selected.length} users`)}
            className="ml-auto rounded-lg bg-white px-3 py-2"
          >
            Suspend selected
          </button>
        </div>
      )}

      {/* Users Table - Using TanStack Table v9 with shadcn/ui */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <DataTable
          columns={columns}
          data={transformedUsers}
          rowCount={totalUsers}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading && users.length === 0}
          showColumnVisibility={true}
          showGlobalFilter={true}
          globalFilterPlaceholder="Search by name, email, or phone..."
          toolbarLeading={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <label className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  aria-label="Search users"
                  value={globalFilter}
                  onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    setSelected([]);
                  }}
                  placeholder="Search by name, email, or phone..."
                  className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 pl-9 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <Select
                aria-label="Filter by role"
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  setSelected([]);
                }}
              >
                <SelectTrigger className="h-10 w-[160px] min-w-[160px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All roles">All roles</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          toolbarTrailing={
            <Button onClick={() => setAddUserDialogOpen(true)} className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Add user
            </Button>
          }

          className="p-4"
        />

        {/* Error state */}
        {isError && users.length === 0 && (
          <div className="text-destructive flex items-center justify-center p-12">
            <p>Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <button onClick={() => refetch()} className="text-primary ml-3 text-sm hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* User Detail Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="bg-card/30 absolute inset-0" onClick={() => setDrawer(null)} />
          <aside className="bg-card absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setDrawer(null)}
              aria-label="Close user details"
              className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
            <div className="mt-8">
              <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl text-xl font-black">
                {drawer.initials}
              </div>
              <h2 className="mt-4 text-xl font-black">{drawer.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{drawer.email}</p>
              <div className="mt-4 flex gap-2">
                <Badge>{drawer.role}</Badge>
                <Badge tone={getStatusBadgeTone(drawer.status)}>{drawer.status}</Badge>
              </div>
              <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                <p>
                  <strong>Phone</strong>
                  <br />
                  <span className="text-slate-500">{drawer.phone}</span>
                </p>
                <p>
                  <strong>Created</strong>
                  <br />
                  <span className="text-slate-500">{drawer.created}</span>
                </p>
                <p>
                  <strong>Last activity</strong>
                  <br />
                  <span className="text-slate-500">{drawer.activity}</span>
                </p>
                <p>
                  <strong>Email Verified</strong>
                  <br />
                  <span className="text-slate-500">{drawer.raw.emailVerified ? 'Yes' : 'No'}</span>
                </p>
              </div>
              <div className="mt-6 grid gap-2">
                <button
                  onClick={() => _setModal('edit')}
                  className="rounded-xl border px-4 py-3 text-sm font-bold"
                >
                  Edit user
                </button>
                <button
                  onClick={() => _setModal('confirm')}
                  className="bg-primary rounded-xl px-4 py-3 text-sm font-bold text-white"
                >
                  {drawer.status === 'SUSPENDED' ? 'Activate user' : 'Suspend user'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Add User Dialog */}
      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSuccess={() => {
          // The useCreateUser hook already invalidates queries, so just close the dialog
          // We could add a toast here if needed
        }}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AdminUsers;
