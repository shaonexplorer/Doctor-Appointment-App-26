'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';

type Clinic = {
  name: string;
  address: string;
  departments: number;
  doctors: number;
  status: 'Active' | 'Inactive';
};
type Department = {
  name: string;
  description: string;
  clinic: string;
  doctors: number;
  appointments: number;
  status: 'Active' | 'Inactive';
};
const clinicSeed: Clinic[] = [
  {
    name: 'MediBook Downtown',
    address: '120 Market Street, San Francisco',
    departments: 8,
    doctors: 42,
    status: 'Active',
  },
  {
    name: 'MediBook Westside',
    address: '84 Valencia Avenue, San Francisco',
    departments: 6,
    doctors: 31,
    status: 'Active',
  },
  {
    name: 'MediBook North',
    address: '410 Pine Road, Oakland',
    departments: 5,
    doctors: 24,
    status: 'Active',
  },
  {
    name: 'MediBook East',
    address: '22 Lakeview Drive, Berkeley',
    departments: 4,
    doctors: 18,
    status: 'Inactive',
  },
];
const departmentSeed: Department[] = [
  {
    name: 'Cardiology',
    description: 'Heart and cardiovascular care',
    clinic: 'MediBook Downtown',
    doctors: 12,
    appointments: 420,
    status: 'Active',
  },
  {
    name: 'Dermatology',
    description: 'Clinical and cosmetic skin care',
    clinic: 'MediBook Westside',
    doctors: 9,
    appointments: 350,
    status: 'Active',
  },
  {
    name: 'Pediatrics',
    description: 'Care for children and families',
    clinic: 'MediBook North',
    doctors: 8,
    appointments: 290,
    status: 'Active',
  },
  {
    name: 'Neurology',
    description: 'Neurological diagnostics and care',
    clinic: 'MediBook Downtown',
    doctors: 6,
    appointments: 240,
    status: 'Active',
  },
  {
    name: 'Orthopedics',
    description: 'Bones, joints, and mobility',
    clinic: 'MediBook East',
    doctors: 5,
    appointments: 180,
    status: 'Inactive',
  },
];
function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'gray' }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${tone === 'green' ? 'bg-[#e7f7f0] text-[#2e9675]' : 'bg-slate-100 text-slate-500'}`}
    >
      {children}
    </span>
  );
}
export function AdminFacilities({ kind }: { kind: 'Clinics' | 'Departments' }) {
  const isClinics = kind === 'Clinics';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const [clinics, setClinics] = useState(clinicSeed);
  const [departments, setDepartments] = useState(departmentSeed);
  const rows = useMemo(
    () =>
      (isClinics ? clinics : departments).filter(
        (item) =>
          `${item.name} ${isClinics ? (item as Clinic).address : (item as Department).clinic}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === 'All statuses' || item.status === status)
      ),
    [isClinics, clinics, departments, query, status]
  );
  const save = () => {
    if (isClinics)
      setClinics((items) => [
        ...items,
        {
          name: 'MediBook Central',
          address: 'New clinic address',
          departments: 0,
          doctors: 0,
          status: 'Active',
        },
      ]);
    else
      setDepartments((items) => [
        ...items,
        {
          name: 'New Department',
          description: 'Department description',
          clinic: 'MediBook Downtown',
          doctors: 0,
          appointments: 0,
          status: 'Active',
        },
      ]);
    setModal(false);
    setNotice(`${kind.slice(0, -1)} created successfully`);
    window.setTimeout(() => setNotice(''), 2500);
  };
  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          title={isClinics ? 'Total clinics' : 'Total departments'}
          value={String(isClinics ? clinics.length : departments.length)}
          icon={Building2}
        />
        <Metric
          title="Active"
          value={String(
            (isClinics ? clinics : departments).filter((x) => x.status === 'Active').length
          )}
          icon={Check}
        />
        <Metric
          title={isClinics ? 'Total doctors' : 'Appointments'}
          value={isClinics ? '115' : '1,480'}
          icon={isClinics ? Stethoscope : Users}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label={`Search ${kind.toLowerCase()}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind.toLowerCase()}...`}
            className="h-10 w-full rounded-xl border border-[#e5e9f2] bg-[#f8faff] pl-9 text-xs outline-none"
          />
        </label>
        <select
          aria-label="Filter status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl border border-[#e5e9f2] px-3 text-xs font-semibold"
        >
          <option>All statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5d83d8] px-4 py-2.5 text-xs font-bold text-white"
        >
          <Plus className="size-4" /> Create {isClinics ? 'clinic' : 'department'}
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e5e9f2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="bg-[#f8faff] text-[10px] tracking-wider text-slate-400 uppercase">
              <tr>
                {(isClinics
                  ? ['Clinic name', 'Address', 'Departments', 'Doctors', 'Status', 'Actions']
                  : [
                      'Department',
                      'Description',
                      'Clinic',
                      'Doctors',
                      'Appointments',
                      'Status',
                      'Actions',
                    ]
                ).map((h) => (
                  <th key={h} className="p-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f6]">
              {rows.map((row) => (
                <tr key={row.name} className="hover:bg-[#fbfcff]">
                  {isClinics ? (
                    <>
                      <td className="p-4 font-bold">{(row as Clinic).name}</td>
                      <td className="p-4 text-slate-500">{(row as Clinic).address}</td>
                      <td className="p-4">{(row as Clinic).departments}</td>
                      <td className="p-4">{(row as Clinic).doctors}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-bold">{(row as Department).name}</td>
                      <td className="p-4 text-slate-500">{(row as Department).description}</td>
                      <td className="p-4">{(row as Department).clinic}</td>
                      <td className="p-4">{(row as Department).doctors}</td>
                      <td className="p-4">{(row as Department).appointments}</td>
                    </>
                  )}
                  <td className="p-4">
                    <Badge tone={row.status === 'Active' ? 'green' : 'gray'}>{row.status}</Badge>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setNotice(`${row.name} edit action opened`)}
                      aria-label={`Edit ${row.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      aria-label={`More actions for ${row.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No {kind.toLowerCase()} match your filters.
          </div>
        )}
        <div className="flex items-center justify-between border-t border-[#eef1f6] px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {rows.length} of {isClinics ? clinics.length : departments.length}
          </span>
          <div className="flex gap-1">
            <button aria-label="Previous page" className="rounded-lg border p-2">
              <ChevronLeft className="size-4" />
            </button>
            <button aria-label="Next page" className="rounded-lg border p-2">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      {modal && <CreateModal kind={kind} onClose={() => setModal(false)} onSave={save} />}
      {notice && (
        <div
          role="status"
          className="fixed right-5 bottom-6 z-50 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Building2;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <span className="grid size-8 place-items-center rounded-lg bg-[#eaf0ff] text-[#5577c8]">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
function CreateModal({
  kind,
  onClose,
  onSave,
}: {
  kind: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const clinic = kind === 'Clinics';
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#17233d]/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#6b8bd6] uppercase">
              New {clinic ? 'clinic' : 'department'}
            </p>
            <h2 className="mt-1 text-lg font-black">Create {clinic ? 'clinic' : 'department'}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            aria-label={clinic ? 'Clinic name' : 'Department name'}
            placeholder={clinic ? 'Clinic name' : 'Department name'}
            className="h-11 rounded-xl border px-3 text-sm sm:col-span-2"
          />
          {clinic ? (
            <>
              <input
                aria-label="Address"
                placeholder="Address"
                className="h-11 rounded-xl border px-3 text-sm sm:col-span-2"
              />
              <input
                aria-label="Phone"
                placeholder="Phone"
                className="h-11 rounded-xl border px-3 text-sm"
              />
              <input
                aria-label="Email"
                placeholder="Email"
                className="h-11 rounded-xl border px-3 text-sm"
              />
              <input
                aria-label="Opening hours"
                placeholder="Opening hours"
                className="h-11 rounded-xl border px-3 text-sm"
              />
              <input
                aria-label="Departments"
                placeholder="Departments"
                className="h-11 rounded-xl border px-3 text-sm"
              />
            </>
          ) : (
            <>
              <textarea
                aria-label="Description"
                placeholder="Description"
                className="min-h-24 rounded-xl border px-3 py-3 text-sm sm:col-span-2"
              />
              <select
                aria-label="Clinic"
                className="h-11 rounded-xl border px-3 text-sm sm:col-span-2"
              >
                <option>MediBook Downtown</option>
                <option>MediBook Westside</option>
              </select>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2.5 text-xs font-bold">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-[#5d83d8] px-4 py-2.5 text-xs font-bold text-white"
          >
            Create {clinic ? 'clinic' : 'department'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminFacilities;
