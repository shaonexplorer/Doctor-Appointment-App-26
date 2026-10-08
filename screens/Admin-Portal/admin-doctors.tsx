'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  CalendarDays,
  Check,
  Clock3,
  DollarSign,
  Edit3,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

const seed = [
  {
    name: 'Dr. Michael Anderson',
    specialty: 'Cardiology',
    designation: 'Senior Consultant',
    clinic: 'MediBook Downtown',
    fee: '$180',
    appointments: 248,
    utilization: 88,
    status: 'ACTIVE',
    review: 'Approved',
    bio: 'Board-certified cardiologist focused on preventive heart care and patient education.',
    qualifications: 'MD, FACC',
    symptoms: 'Chest pain, hypertension, palpitations',
    availability: 'Mon–Fri · 9:00 AM–5:00 PM',
    revenue: '$44,640',
  },
  {
    name: 'Dr. Priya Shah',
    specialty: 'Dermatology',
    designation: 'Consultant Dermatologist',
    clinic: 'MediBook Westside',
    fee: '$145',
    appointments: 196,
    utilization: 82,
    status: 'ACTIVE',
    review: 'Approved',
    bio: 'Specialist in clinical and cosmetic dermatology with a patient-first approach.',
    qualifications: 'MD, FAAD',
    symptoms: 'Acne, eczema, skin lesions',
    availability: 'Mon, Wed, Fri · 10:00 AM–4:00 PM',
    revenue: '$28,420',
  },
  {
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    designation: 'Neurologist',
    clinic: 'MediBook Downtown',
    fee: '$210',
    appointments: 84,
    utilization: 54,
    status: 'PENDING',
    review: 'Needs review',
    bio: 'Neurologist specializing in migraine care and neurological diagnostics.',
    qualifications: 'MD, PhD',
    symptoms: 'Migraines, dizziness, neuropathy',
    availability: 'Tue–Thu · 8:30 AM–3:30 PM',
    revenue: '$17,640',
  },
  {
    name: 'Dr. Emily Chen',
    specialty: 'Pediatrics',
    designation: 'Pediatrician',
    clinic: 'MediBook North',
    fee: '$120',
    appointments: 220,
    utilization: 76,
    status: 'ACTIVE',
    review: 'Approved',
    bio: 'Pediatrician supporting children and families through every stage of development.',
    qualifications: 'MD, FAAP',
    symptoms: 'Fever, cough, wellness checks',
    availability: 'Mon–Sat · 8:00 AM–2:00 PM',
    revenue: '$26,400',
  },
  {
    name: 'Dr. Robert Kim',
    specialty: 'Orthopedics',
    designation: 'Orthopedic Surgeon',
    clinic: 'MediBook East',
    fee: '$240',
    appointments: 68,
    utilization: 42,
    status: 'SUSPENDED',
    review: 'Approved',
    bio: 'Orthopedic surgeon specializing in sports injuries and mobility restoration.',
    qualifications: 'MD, FAAOS',
    symptoms: 'Joint pain, fractures, sports injuries',
    availability: 'Mon, Thu · 9:00 AM–1:00 PM',
    revenue: '$16,320',
  },
];
function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${tone === 'green' ? 'bg-[#e7f7f0] text-[#2e9675]' : tone === 'red' ? 'bg-[#fdecec] text-[#be6467]' : tone === 'amber' ? 'bg-[#fff3e2] text-[#b57a2f]' : 'bg-[#eaf0ff] text-[#5577c8]'}`}
    >
      {children}
    </span>
  );
}
export function AdminDoctors() {
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [drawer, setDrawer] = useState<(typeof seed)[number] | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(
    () =>
      rows.filter(
        (d) =>
          `${d.name} ${d.specialty} ${d.clinic}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All statuses' || d.status === status)
      ),
    [rows, query, status]
  );
  const act = (message: string) => {
    setNotice(message);
    setModal(null);
    window.setTimeout(() => setNotice(''), 2800);
  };
  const update = (next: (typeof seed)[number]) => {
    setRows((items) => items.map((item) => (item.name === next.name ? next : item)));
    setDrawer(next);
  };
  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Total doctors" value="486" icon={Stethoscope} tone="blue" />
        <Metric title="Active" value="462" icon={ShieldCheck} tone="green" />
        <Metric title="Pending review" value="12" icon={Clock3} tone="amber" />
        <Metric title="Avg utilization" value="74.8%" icon={Activity} tone="purple" />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search doctors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, specialties, or clinics..."
            className="h-10 w-full rounded-xl border border-[#e5e9f2] bg-[#f8faff] pr-3 pl-9 text-xs outline-none focus:border-[#6b8bd6]"
          />
        </label>
        <select
          aria-label="Filter doctor status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl border border-[#e5e9f2] bg-white px-3 text-xs font-semibold"
        >
          <option>All statuses</option>
          <option>ACTIVE</option>
          <option>PENDING</option>
          <option>SUSPENDED</option>
        </select>
        <button
          onClick={() => setModal('add')}
          className="rounded-xl bg-[#5d83d8] px-4 py-2.5 text-xs font-bold text-white"
        >
          Add doctor
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e5e9f2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs">
            <thead className="bg-[#f8faff] text-[10px] tracking-wider text-slate-400 uppercase">
              <tr>
                {[
                  'Doctor',
                  'Specialty',
                  'Designation',
                  'Clinic',
                  'Consultation fee',
                  'Appointments',
                  'Slot utilization',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th key={h} className="p-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f6]">
              {filtered.map((doctor) => (
                <tr key={doctor.name} className="hover:bg-[#fbfcff]">
                  <td className="p-4">
                    <button
                      onClick={() => setDrawer(doctor)}
                      className="flex items-center gap-3 text-left"
                    >
                      <span className="grid size-9 place-items-center rounded-full bg-[#eaf0ff] font-bold text-[#5577c8]">
                        {doctor.name
                          .replace('Dr. ', '')
                          .split(' ')
                          .map((x) => x[0])
                          .join('')}
                      </span>
                      <span>
                        <strong className="block text-[#17233d]">{doctor.name}</strong>
                        <span className="text-[11px] text-slate-400">{doctor.review}</span>
                      </span>
                    </button>
                  </td>
                  <td className="p-4 font-semibold">{doctor.specialty}</td>
                  <td className="p-4 text-slate-500">{doctor.designation}</td>
                  <td className="p-4 text-slate-500">{doctor.clinic}</td>
                  <td className="p-4 font-bold">{doctor.fee}</td>
                  <td className="p-4 font-semibold">{doctor.appointments}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-[#edf0f6]">
                        <div
                          className="h-2 rounded-full bg-[#5d83d8]"
                          style={{ width: `${doctor.utilization}%` }}
                        />
                      </div>
                      <span className="font-bold">{doctor.utilization}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      tone={
                        doctor.status === 'ACTIVE'
                          ? 'green'
                          : doctor.status === 'PENDING'
                            ? 'amber'
                            : 'red'
                      }
                    >
                      {doctor.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setDrawer(doctor)}
                      aria-label={`Open ${doctor.name}`}
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
      </div>
      {drawer && (
        <Drawer
          doctor={drawer}
          onClose={() => setDrawer(null)}
          onEdit={() => setModal('edit')}
          onAvailability={() => act(`Availability opened for ${drawer.name}`)}
          onToggle={() => {
            const next = {
              ...drawer,
              status: drawer.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED',
            };
            update(next);
            act(`${next.name} is now ${next.status.toLowerCase()}`);
          }}
          onReview={() => act(`${drawer.name} approved successfully`)}
        />
      )}
      {modal && (
        <Modal
          title={modal === 'add' ? 'Add doctor' : 'Edit doctor profile'}
          onClose={() => setModal(null)}
          onSave={() => act(modal === 'add' ? 'Doctor invitation sent' : 'Doctor profile updated')}
        />
      )}
      {notice && (
        <div
          role="status"
          className="fixed right-5 bottom-6 z-50 rounded-xl border border-[#dce2ee] bg-white px-4 py-3 text-sm font-semibold shadow-lg"
        >
          <Check className="mr-2 inline size-4 text-[#43ae91]" />
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
  tone,
}: {
  title: string;
  value: string;
  icon: typeof Activity;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <span
          className={`grid size-8 place-items-center rounded-lg ${tone === 'green' ? 'bg-[#e7f7f0] text-[#2e9675]' : tone === 'amber' ? 'bg-[#fff3e2] text-[#b57a2f]' : tone === 'purple' ? 'bg-[#f1edff] text-[#826fd1]' : 'bg-[#eaf0ff] text-[#5577c8]'}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
function Drawer({
  doctor,
  onClose,
  onEdit,
  onAvailability,
  onToggle,
  onReview,
}: {
  doctor: (typeof seed)[number];
  onClose: () => void;
  onEdit: () => void;
  onAvailability: () => void;
  onToggle: () => void;
  onReview: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#17233d]/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#6b8bd6] uppercase">
              Doctor profile
            </p>
            <h2 className="mt-2 text-2xl font-black">{doctor.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {doctor.specialty} · {doctor.designation}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close doctor profile"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge
            tone={
              doctor.status === 'ACTIVE' ? 'green' : doctor.status === 'PENDING' ? 'amber' : 'red'
            }
          >
            {doctor.status}
          </Badge>
          <Badge tone={doctor.review === 'Approved' ? 'green' : 'amber'}>{doctor.review}</Badge>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Qualifications" value={doctor.qualifications} />
          <Info label="Clinic" value={doctor.clinic} />
          <Info label="Consultation fee" value={doctor.fee} />
          <Info label="Availability" value={doctor.availability} />
          <Info label="Appointments" value={`${doctor.appointments} this month`} />
          <Info label="Revenue" value={doctor.revenue} />
        </div>
        <section className="mt-6 rounded-2xl bg-[#f8faff] p-4">
          <h3 className="text-sm font-bold">Personal information</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{doctor.bio}</p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            <span className="text-[#17233d]">Symptoms handled:</span> {doctor.symptoms}
          </p>
        </section>
        <section className="mt-5 rounded-2xl border border-[#e5e9f2] p-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-[#5d83d8]" />
            <h3 className="text-sm font-bold">Performance analytics</h3>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-black">{doctor.utilization}%</p>
              <p className="text-[10px] text-slate-400">Utilization</p>
            </div>
            <div>
              <p className="text-lg font-black">4.9</p>
              <p className="text-[10px] text-slate-400">Rating</p>
            </div>
            <div>
              <p className="text-lg font-black">91%</p>
              <p className="text-[10px] text-slate-400">Completion</p>
            </div>
          </div>
        </section>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            onClick={onEdit}
            className="rounded-xl bg-[#5d83d8] px-4 py-3 text-xs font-bold text-white"
          >
            <Edit3 className="mr-2 inline size-4" />
            Edit doctor
          </button>
          <button
            onClick={onAvailability}
            className="rounded-xl border border-[#dce2ee] px-4 py-3 text-xs font-bold"
          >
            <CalendarDays className="mr-2 inline size-4" />
            Manage availability
          </button>
          <button
            onClick={onToggle}
            className="rounded-xl border border-[#f1caca] px-4 py-3 text-xs font-bold text-[#be6467]"
          >
            {doctor.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
          </button>
          {doctor.review !== 'Approved' && (
            <button
              onClick={onReview}
              className="rounded-xl border border-[#c7eadb] px-4 py-3 text-xs font-bold text-[#2e9675]"
            >
              Approve doctor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e5e9f2] p-3">
      <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
function Modal({
  title,
  onClose,
  onSave,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#17233d]/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{title}</h2>
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
            aria-label="Doctor name"
            placeholder="Doctor name"
            className="h-11 rounded-xl border border-[#e5e9f2] px-3 text-sm"
          />
          <input
            aria-label="Specialty"
            placeholder="Specialty"
            className="h-11 rounded-xl border border-[#e5e9f2] px-3 text-sm"
          />
          <input
            aria-label="Clinic"
            placeholder="Clinic"
            className="h-11 rounded-xl border border-[#e5e9f2] px-3 text-sm"
          />
          <input
            aria-label="Consultation fee"
            placeholder="Consultation fee"
            className="h-11 rounded-xl border border-[#e5e9f2] px-3 text-sm"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#dce2ee] px-4 py-2.5 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-[#5d83d8] px-4 py-2.5 text-xs font-bold text-white"
          >
            Save doctor
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminDoctors;
