'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Check, Edit3, MoreHorizontal, Search, UserRound, X } from 'lucide-react';

const seed = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (415) 555-0182',
    role: 'PATIENT',
    status: 'ACTIVE',
    created: 'Sep 18, 2026',
    activity: 'Today, 10:42 AM',
  },
  {
    name: 'Dr. Michael Anderson',
    email: 'm.anderson@medibook.com',
    phone: '+1 (415) 555-0108',
    role: 'DOCTOR',
    status: 'ACTIVE',
    created: 'Aug 12, 2026',
    activity: 'Today, 9:18 AM',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan.lee@medibook.com',
    phone: '+1 (415) 555-0144',
    role: 'STAFF',
    status: 'ACTIVE',
    created: 'Jul 29, 2026',
    activity: 'Yesterday',
  },
  {
    name: 'Robert Williams',
    email: 'robert.williams@example.com',
    phone: '+1 (415) 555-0197',
    role: 'PATIENT',
    status: 'PENDING',
    created: 'Sep 20, 2026',
    activity: 'Never',
  },
  {
    name: 'Alex Morgan',
    email: 'alex.morgan@medibook.com',
    phone: '+1 (415) 555-0122',
    role: 'ADMIN',
    status: 'ACTIVE',
    created: 'Jan 06, 2026',
    activity: 'Today, 8:02 AM',
  },
  {
    name: 'Dr. Priya Shah',
    email: 'p.shah@medibook.com',
    phone: '+1 (415) 555-0161',
    role: 'DOCTOR',
    status: 'SUSPENDED',
    created: 'May 14, 2026',
    activity: 'Sep 12, 2026',
  },
];

const roles = ['ADMIN', 'STAFF', 'DOCTOR', 'PATIENT'];

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
  const [rows] = useState(seed);
  const [tab, setTab] = useState('All Users');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All roles');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<(typeof seed)[number] | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(
    () =>
      rows.filter(
        (u) =>
          (tab === 'All Users' || u.role === tab.slice(0, -1).toUpperCase()) &&
          (role === 'All roles' || u.role === role) &&
          `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, tab, role, query]
  );

  const act = (message: string) => {
    setNotice(message);
    setModal(null);
    window.setTimeout(() => setNotice(''), 2800);
  };

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  return (
    <div className="mt-8 space-y-5">
      <div className="border-border flex flex-wrap gap-2 border-b">
        {['All Users', 'Doctors', 'Staff', 'Patients'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`border-b-2 px-4 py-3 text-xs font-bold ${
              tab === item
                ? 'border-primary text-primary'
                : 'text-muted-foreground border-transparent'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="border-border bg-accent focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none"
          />
        </label>
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border-border bg-accent h-10 rounded-xl border px-3 text-xs font-semibold"
        >
          <option className="border-border border">All roles</option>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button
          onClick={() => setModal('add')}
          className="bg-primary rounded-xl px-4 py-2.5 text-xs font-bold text-white"
        >
          Add user
        </button>
      </div>

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

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-xs">
            <thead className="bg-accent text-[10px] tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="w-10 p-4">
                  <input
                    type="checkbox"
                    aria-label="Select all users"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={() =>
                      setSelected(
                        selected.length === filtered.length ? [] : filtered.map((u) => u.name)
                      )
                    }
                  />
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created date</th>
                <th className="p-4">Last activity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((u) => (
                <tr key={u.name} className="hover:bg-[var(--muted)]">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${u.name}`}
                      checked={selected.includes(u.name)}
                      onChange={() => toggle(u.name)}
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setDrawer(u)}
                      className="text-foreground hover:text-primary flex items-center gap-2 font-bold"
                    >
                      <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full">
                        <UserRound className="size-4" />
                      </span>
                      {u.name}
                    </button>
                  </td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4 text-slate-500">{u.phone}</td>
                  <td className="p-4">
                    <Badge>{u.role}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      tone={
                        u.status === 'ACTIVE' ? 'green' : u.status === 'SUSPENDED' ? 'red' : 'amber'
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{u.created}</td>
                  <td className="p-4 text-slate-500">{u.activity}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDrawer(u)}
                        className="text-primary hover:bg-primary/10 rounded-lg px-2 py-1.5 font-bold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setModal('edit')}
                        aria-label={`Edit ${u.name}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        onClick={() => setModal('role')}
                        aria-label={`Change role for ${u.name}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-border flex items-center justify-between border-t px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {rows.length} users
          </span>
          <div className="flex gap-1">
            <button className="rounded-lg border px-3 py-1.5">Previous</button>
            <button className="bg-primary rounded-lg px-3 py-1.5 font-bold text-white">1</button>
            <button className="rounded-lg border px-3 py-1.5">2</button>
            <button className="rounded-lg border px-3 py-1.5">Next</button>
          </div>
        </div>
      </div>

      {/* Conditional overlays */}
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
                {drawer.name
                  .split(' ')
                  .map((x) => x[0])
                  .join('')}
              </div>
              <h2 className="mt-4 text-xl font-black">{drawer.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{drawer.email}</p>
              <div className="mt-4 flex gap-2">
                <Badge>{drawer.role}</Badge>
                <Badge
                  tone={
                    drawer.status === 'ACTIVE'
                      ? 'green'
                      : drawer.status === 'SUSPENDED'
                        ? 'red'
                        : 'amber'
                  }
                >
                  {drawer.status}
                </Badge>
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
