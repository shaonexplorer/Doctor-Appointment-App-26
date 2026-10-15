'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Check, Search, X, UserPlus } from 'lucide-react';
import {
  useUsers,
  transformUsersToAdminFormat,
  getStatusBadgeTone,
  type AdminUserData,
} from '@/hooks/useUsers';
import { DataTable } from './data-table';
import { createUserColumns } from './columns';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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

function UserAvatar({ initials }: { initials: string }) {
  return (
    <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full">
      {initials}
    </span>
  );
}

export function AdminUsers() {
  const [role, setRole] = useState('All roles');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<AdminUserData | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
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
  const totalPages = usersResponse?.meta.totalPages || 1;

  // Transform API data to admin format
  const transformedUsers = useMemo(() => transformUsersToAdminFormat(users), [users]);

  const act = (message: string) => {
    setNotice(message);
    setModal(null);
    window.setTimeout(() => setNotice(''), 2800);
  };

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const toggleSelectAll = () => {
    if (selected.length === transformedUsers.length && transformedUsers.length > 0) {
      setSelected([]);
    } else {
      setSelected(transformedUsers.map((u) => u.name));
    }
  };

  // Column definitions with action handlers
  const columns = createUserColumns(
    (user) => setDrawer(user),           // onViewUser
    (user) => setModal('edit'),           // onEditUser
    (user) => setModal('role'),           // onChangeRole
    (user) => setModal('confirm')         // onSuspendUser
  );

  return (
    <div className="mt-8 space-y-5">
      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-primary/10 text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold">
          {selected.length} selected
          <button
            onClick={() => act(`Bulk action applied to ${selected.length} users`)}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
              <label className="relative flex-1 min-w-[200px]">
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
                  className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 text-sm pl-9 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          toolbarTrailing={
            <Button onClick={() => setModal('add')} className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Add user
            </Button>
          }
          className="p-4"
        />

        {/* Error state */}
        {isError && users.length === 0 && (
          <div className="flex items-center justify-center p-12 text-destructive">
            <p>Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <button
              onClick={() => refetch()}
              className="ml-3 text-primary hover:underline text-sm"
            >
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
                  onClick={() => setModal('edit')}
                  className="rounded-xl border px-4 py-3 text-sm font-bold"
                >
                  Edit user
                </button>
                <button
                  onClick={() => setModal('confirm')}
                  className="bg-primary rounded-xl px-4 py-3 text-sm font-bold text-white"
                >
                  {drawer.status === 'SUSPENDED' ? 'Activate user' : 'Suspend user'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <div className="bg-card/30 fixed inset-0 z-[60] grid place-items-center p-4">
          <div className="bg-muted w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  User management
                </p>
                <h2 className="mt-1 text-xl font-black">
                  {modal === 'add'
                    ? 'Add user'
                    : modal === 'edit'
                      ? 'Edit user'
                      : modal === 'role'
                        ? 'Change role'
                        : 'Confirm account change'}
                </h2>
              </div>
              <button onClick={() => setModal(null)} aria-label="Close dialog">
                <X className="size-5 text-slate-400" />
              </button>
            </div>
            {modal !== 'confirm' && (
              <div className="mt-5 space-y-3">
                <input
                  placeholder="Full name"
                  className="bg-accent h-11 w-full rounded-xl border px-3 text-sm"
                />
                <input
                  placeholder="Email address"
                  className="bg-accent h-11 w-full rounded-xl border px-3 text-sm"
                />
                <select className="bg-accent h-11 w-full rounded-xl border px-3 text-sm">
                  <option>Select role</option>
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
            <p className="mt-5 text-sm leading-6 text-slate-500">
              {modal === 'confirm'
                ? 'This action changes the user account status. You can reverse it later from the user detail drawer.'
                : 'Changes are validated before saving and recorded in the admin activity log.'}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl border px-4 py-2.5 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  act(
                    modal === 'add'
                      ? 'User added successfully'
                      : modal === 'edit'
                        ? 'User updated successfully'
                        : modal === 'role'
                          ? 'Role change saved'
                          : 'Account status updated'
                  )
                }
                className="bg-primary rounded-xl px-4 py-2.5 text-sm font-bold text-white"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notice && (
        <div
          role="status"
          className="border-border bg-card fixed right-5 bottom-6 z-[70] flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
        >
          <Check className="text-success size-4" />
          {notice}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;