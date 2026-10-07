'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, FileText, Search, Stethoscope, UsersRound, X } from 'lucide-react';

type Role = 'patient' | 'doctor' | 'staff' | 'admin';
type Result = {
  title: string;
  detail: string;
  category: string;
  icon: typeof UsersRound;
  destination: string;
};

const roleResults: Record<Role, Result[]> = {
  patient: [
    {
      title: 'Dr. Michael Chen',
      detail: 'Cardiology &middot; Video visits available',
      category: 'Doctors',
      icon: Stethoscope,
      destination: 'Find Doctors',
    },
    {
      title: 'Appointment with Dr. Chen',
      detail: 'Thursday, Sep 24 &middot; 10:30 AM',
      category: 'Appointments',
      icon: CalendarDays,
      destination: 'Appointments',
    },
    {
      title: 'Atorvastatin 20mg',
      detail: 'Active prescription &middot; Refill due Oct 12',
      category: 'Prescriptions',
      icon: FileText,
      destination: 'Prescriptions',
    },
    {
      title: 'Blood panel results',
      detail: 'Added Sep 18, 2026',
      category: 'Medical records',
      icon: FileText,
      destination: 'Medical Records',
    },
  ],
  doctor: [
    {
      title: 'Sarah Johnson',
      detail: 'PAT-10482 &middot; Cardiology follow-up',
      category: 'Patients',
      icon: UsersRound,
      destination: 'Patients',
    },
    {
      title: 'Today&apos;s appointment queue',
      detail: '12 appointments &middot; 3 waiting',
      category: 'Appointments',
      icon: CalendarDays,
      destination: 'Appointments',
    },
    {
      title: 'Prescription history',
      detail: 'Recent medications and issued prescriptions',
      category: 'Prescriptions',
      icon: FileText,
      destination: 'Prescriptions',
    },
  ],
  staff: [
    {
      title: 'Sarah Johnson',
      detail: 'PAT-10482 &middot; Checked in today',
      category: 'Patients',
      icon: UsersRound,
      destination: 'Patients',
    },
    {
      title: 'Dr. Michael Anderson',
      detail: 'Cardiology &middot; Room 204',
      category: 'Doctors',
      icon: Stethoscope,
      destination: 'Doctors',
    },
    {
      title: 'APT-2026-004821',
      detail: 'Today &middot; 10:30 AM &middot; Paid',
      category: 'Appointments',
      icon: CalendarDays,
      destination: 'Appointments',
    },
    {
      title: 'Payment #PAY-88421',
      detail: '$120.00 &middot; Paid today',
      category: 'Payments',
      icon: FileText,
      destination: 'Billing',
    },
  ],
  admin: [
    {
      title: 'Sarah Johnson',
      detail: 'Patient &middot; Active &middot; PAT-10482',
      category: 'Users',
      icon: UsersRound,
      destination: 'Users',
    },
    {
      title: 'Dr. Michael Anderson',
      detail: 'Cardiologist &middot; Approved',
      category: 'Doctors',
      icon: Stethoscope,
      destination: 'Doctors',
    },
    {
      title: 'September appointment volume',
      detail: '328 appointments today',
      category: 'Appointments',
      icon: CalendarDays,
      destination: 'Appointments',
    },
    {
      title: 'MediBook Central Clinic',
      detail: '12 departments &middot; Active',
      category: 'Clinics',
      icon: FileText,
      destination: 'Clinics',
    },
    {
      title: 'Cardiology',
      detail: '24 doctors &middot; 1,284 appointments',
      category: 'Departments',
      icon: FileText,
      destination: 'Departments',
    },
  ],
};

export function GlobalSearch({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate: (destination: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(['Sarah Johnson', 'Dr. Michael Anderson']);
  const results = useMemo(
    () =>
      roleResults[role].filter((item) =>
        `${item.title} ${item.detail} ${item.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [role, query]
  );
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const select = (result: Result) => {
    setRecent((items) =>
      [result.title, ...items.filter((item) => item !== result.title)].slice(0, 3)
    );
    setOpen(false);
    setQuery('');
    onNavigate(result.destination);
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-border bg-card text-muted-foreground relative hidden h-10 w-[250px] items-center gap-2 rounded-xl border px-3 text-left text-xs md:flex lg:w-[285px]"
        aria-label="Open global search"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="flex-1">Search anything...</span>
        <kbd className="border-border bg-secondary rounded border px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </button>
      {open && (
        <div
          className="bg-foreground/35 fixed inset-0 z-[80] p-4 sm:p-8"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <div
            className="border-border bg-card mx-auto mt-[5vh] max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            <div className="border-border flex items-center gap-3 border-b px-4">
              <Search className="text-primary size-5" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  role === 'patient'
                    ? 'Search doctors, appointments, records...'
                    : 'Search patients, appointments, payments...'
                }
                className="h-14 flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="border-border text-muted-foreground hidden rounded border px-2 py-1 text-[10px] sm:block">
                ESC
              </kbd>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="hover:bg-secondary rounded-lg p-2"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-3">
              {!query && (
                <div className="mb-4">
                  <p className="text-muted-foreground px-2 pb-2 text-[10px] font-bold tracking-wider uppercase">
                    Recent searches
                  </p>
                  {recent.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="hover:bg-secondary flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm"
                    >
                      <Clock3 className="text-muted-foreground size-4" aria-hidden="true" />
                      {item}
                    </button>
                  ))}
                </div>
              )}
              {query && results.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="text-muted-foreground/50 mx-auto size-8" aria-hidden="true" />
                  <p className="mt-3 font-bold">No results found</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Try a patient name, appointment ID, or category.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(new Set(results.map((item) => item.category))).map((category) => (
                    <section key={category}>
                      <p className="text-muted-foreground px-2 pb-2 text-[10px] font-bold tracking-wider uppercase">
                        {category}
                      </p>
                      {results
                        .filter((item) => item.category === category)
                        .map((result) => {
                          const Icon = result.icon;
                          return (
                            <button
                              key={result.title}
                              onClick={() => select(result)}
                              className="hover:bg-secondary flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left"
                            >
                              <div className="bg-secondary text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                                <Icon className="size-4" aria-hidden="true" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold">{result.title}</p>
                                <p className="text-muted-foreground truncate text-xs">
                                  {result.detail}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </section>
                  ))}
                </div>
              )}
              {!query && (
                <p className="border-border text-muted-foreground border-t px-2 pt-3 text-[11px]">
                  Search is scoped to your {role} portal. Press{' '}
                  <kbd className="border-border rounded border px-1">⌘K</kbd> anytime to open.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
