'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/patient-dashboard/Panel';
import { Metric } from '@/components/patient-dashboard/Metric';
import {
  ArrowRight,
  Baby,
  Brain,
  CalendarCheck2,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Cross,
  FileText,
  HeartPulse,
  Hospital,
  MapPin,
  Menu,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const specialties = [
  ['Cardiology', HeartPulse],
  ['Dermatology', Sparkles],
  ['Pediatrics', Baby],
  ['Neurology', Brain],
  ['Orthopedics', Stethoscope],
  ['Internal Medicine', Hospital],
  ['Gynecology', UsersRound],
  ['Dentistry', Cross],
] as const;

const features = [
  [
    'Real-time availability',
    'See open slots that fit your schedule, without back-and-forth calls.',
    CalendarCheck2,
  ],
  ['Easy appointment booking', 'Book, reschedule, or cancel visits in a few simple steps.', Clock3],
  [
    'Digital prescriptions',
    'Keep prescriptions accessible and easy to share with your pharmacy.',
    Pill,
  ],
  [
    'Medical history',
    'Bring your health story with you, securely organized in one place.',
    FileText,
  ],
  [
    'Helpful reminders',
    'Get timely updates so important appointments do not slip through the cracks.',
    Check,
  ],
  [
    'Secure patient records',
    'Private information is protected with role-based access controls.',
    ShieldCheck,
  ],
] as const;

export function MediBookLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchNotice, setSearchNotice] = useState('');
  const [query, setQuery] = useState('');

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchNotice(
      query.trim() ? `Searching for ${query.trim()}...` : 'Try searching for a doctor or specialty.'
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <header className="border-border/80 bg-background/95 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5" aria-label="MediBook home">
            <span className="bg-primary flex size-10 items-center justify-center rounded-[13px] text-white shadow-[0_8px_18px_rgba(37,99,235,.2)]">
              <HeartPulse className="size-5" />
            </span>
            <span>
              <span className="block text-[17px] font-extrabold tracking-[-.03em]">MediBook</span>
              <span className="text-muted-foreground block text-[10px] font-medium">
                Care, connected.
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {[
              ['Find Doctors', '#find-doctors'],
              ['How It Works', '#how-it-works'],
              ['For Doctors', '#for-doctors'],
              ['For Clinics', '#for-doctors'],
              ['About', '#about'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-muted-foreground hover:text-primary text-[13px] font-semibold transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2.5 sm:flex">
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm">
              Get started <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav
            className="border-border bg-card border-t px-5 py-4 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {['Find Doctors', 'How It Works', 'For Doctors', 'For Clinics', 'About'].map(
                (label) => (
                  <a
                    key={label}
                    href={`#${label === 'Find Doctors' ? 'find-doctors' : label === 'How It Works' ? 'how-it-works' : label === 'About' ? 'about' : 'for-doctors'}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted-foreground hover:bg-muted rounded-lg px-3 py-3 text-sm font-semibold"
                  >
                    {label}
                  </a>
                )
              )}
              <div className="border-muted mt-2 flex gap-2 border-t pt-3">
                <Button variant="outline" className="flex-1">
                  Log in
                </Button>
                <Button className="flex-1">Get started</Button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section
        id="top"
        className="relative mx-auto max-w-[1240px] px-5 pt-14 pb-16 lg:px-8 lg:pt-24 lg:pb-24"
      >
        <div className="bg-primary/10 absolute top-0 -right-24 -z-0 size-80 rounded-full blur-3xl" />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
          <div>
            <div className="border-muted bg-card text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold">
              <span className="bg-success size-1.5 rounded-full" />
              Trusted care, on your terms
            </div>
            <h1 className="text-foreground max-w-xl text-[clamp(2.7rem,6vw,5rem)] leading-[.98] font-extrabold tracking-[-.065em]">
              Healthcare appointments, <span className="text-primary">made simple.</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-lg text-base leading-7">
              Find qualified doctors, see real-time availability, and book the care you need online.
              MediBook makes every step feel clear and human.
            </p>
            <form
              id="find-doctors"
              onSubmit={handleSearch}
              className="border-muted bg-card mt-8 rounded-2xl border p-2 shadow-[0_14px_35px_rgba(30,73,104,.09)]"
            >
              <div className="grid gap-1 md:grid-cols-[1.3fr_1fr_1fr_auto]">
                <label className="focus-within:bg-muted flex items-center gap-2 rounded-xl px-3 py-2.5">
                  <Search className="text-muted-foreground size-4 shrink-0" />
                  <span className="sr-only">Search doctor</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="placeholder:text-muted-foreground/50 min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Doctor or specialty"
                  />
                </label>
                <label className="border-muted flex items-center gap-2 rounded-xl border-t px-3 py-2.5 md:border-t-0 md:border-l">
                  <Stethoscope className="text-muted-foreground size-4 shrink-0" />
                  <span className="sr-only">Specialty</span>
                  <select className="text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none">
                    <option>Any specialty</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Pediatrics</option>
                  </select>
                </label>
                <label className="border-muted flex items-center gap-2 rounded-xl border-t px-3 py-2.5 md:border-t-0 md:border-l">
                  <MapPin className="text-muted-foreground size-4 shrink-0" />
                  <span className="sr-only">Location</span>
                  <select className="text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none">
                    <option>Any location</option>
                    <option>Downtown clinic</option>
                    <option>Northside clinic</option>
                  </select>
                </label>
                <Button type="submit" className="mt-1 h-11 rounded-xl md:mt-0">
                  Search
                </Button>
              </div>
            </form>
            {searchNotice && (
              <p role="status" className="text-primary mt-3 text-xs font-semibold">
                {searchNotice}
              </p>
            )}
            <div className="text-muted-foreground mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Check className="text-success size-4" />
                Verified doctors
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="text-success size-4" />
                Private by design
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="text-success size-4" />
                Flexible appointments
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="border-muted bg-muted/50 relative mx-auto max-w-[510px] overflow-hidden rounded-[28px] border p-3 shadow-[0_26px_60px_rgba(42,91,116,.16)]">
              <div className="bg-card elevation-1 rounded-[21px] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold tracking-[.16em] uppercase">
                      Your care dashboard
                    </p>
                    <p className="mt-1 text-xl font-extrabold tracking-tight">
                      Good morning, Sarah
                    </p>
                  </div>
                  <div className="bg-primary/20 text-primary flex size-10 items-center justify-center rounded-full">
                    <CircleUserRound className="size-5" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <Metric
                    label="Upcoming visits"
                    value="02"
                    icon={<CalendarCheck2 className="size-4" />}
                    tone="bg-primary/10 text-primary"
                  />
                  <Metric
                    label="Health records"
                    value="08"
                    icon={<FileText className="size-4" />}
                    tone="bg-success/10 text-success"
                  />
                  <Metric
                    label="Prescriptions"
                    value="03"
                    icon={<Pill className="size-4" />}
                    tone="bg-warning/10 text-warning"
                  />
                </div>
                <div className="border-muted mt-6 rounded-2xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold tracking-[.12em] uppercase">
                        Next appointment
                      </p>
                      <p className="mt-1 text-sm font-extrabold">Dr. Emily Carter</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Cardiology · Tue, Sep 22 at 10:30 AM
                      </p>
                    </div>
                    <span className="bg-success/20 text-success rounded-full px-2.5 py-1 text-[10px] font-bold">
                      Confirmed
                    </span>
                  </div>
                  <div className="bg-muted/50 mt-4 flex items-center justify-between rounded-xl px-3 py-2.5">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold">
                      <span className="bg-primary/20 text-primary flex size-4 items-center justify-center rounded text-[8px] font-bold">
                        ▶
                      </span>{' '}
                      Video visit
                    </span>
                    <ArrowRight className="text-primary size-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-muted bg-card absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border p-3 shadow-[0_12px_28px_rgba(42,91,116,.14)]">
              <div className="bg-success/20 text-success flex size-9 items-center justify-center rounded-full">
                <CalendarCheck2 className="size-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px]">Appointments booked</p>
                <p className="text-sm font-extrabold">12,400+ this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-muted bg-card border-y py-5">
        <div className="text-muted-foreground mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-xs font-semibold lg:justify-between lg:px-8">
          <span>Trusted by patients and care teams at</span>
          <span className="text-muted-foreground/50 tracking-wide">NORTHSTAR HEALTH</span>
          <span className="text-muted-foreground/50 tracking-wide">wellpoint clinics</span>
          <span className="text-muted-foreground/50 tracking-wide">HEARTLAND MEDICAL</span>
          <span className="text-muted-foreground/50 tracking-wide">carebridge</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-primary text-xs font-bold tracking-[.18em] uppercase">
              Find the right care
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              Care for every part of you.
            </h2>
          </div>
          <a
            href="#find-doctors"
            className="text-primary flex items-center gap-2 text-sm font-bold"
          >
            Browse all specialties <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {specialties.map(([name, Icon]) => (
            <a
              key={name}
              href="#find-doctors"
              className="group border-muted bg-card hover:border-primary/30 rounded-2xl border p-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(30,73,104,.08)]"
            >
              <span className="bg-primary/20 text-primary group-hover:bg-primary flex size-10 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-xs leading-4 font-bold">{name}</p>
              <p className="text-muted-foreground mt-1 text-[10px]">Explore care</p>
            </a>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-card py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-primary text-xs font-bold tracking-[.18em] uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              Care is easier in four simple steps.
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              From your first search to your follow-up, MediBook keeps the experience
              straightforward.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              ['01', 'Find a doctor', 'Search by specialty, location, insurance, or availability.'],
              ['02', 'Choose a time', 'Compare open slots and choose what works for your day.'],
              ['03', 'Book securely', 'Confirm your visit in seconds with a clear digital record.'],
              ['04', 'Meet your doctor', 'Arrive prepared with reminders and your health history.'],
            ].map(([number, title, copy], index) => (
              <div key={number} className="relative text-center md:text-left">
                <div className="bg-primary/20 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl text-lg font-extrabold md:mx-0">
                  {number}
                </div>
                <h3 className="mt-5 text-base font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{copy}</p>
                {index < 3 && (
                  <ArrowRight className="text-muted-foreground/50 absolute top-5 right-[-20px] hidden size-5 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-bold tracking-[.18em] uppercase">
            One connected experience
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
            Everything you need to stay on top of your care.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, copy, Icon]) => (
            <div
              key={title}
              className="border-muted bg-card rounded-2xl border p-6 transition-shadow hover:shadow-[0_12px_28px_rgba(30,73,104,.07)]"
            >
              <span className="bg-primary/20 text-primary flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-extrabold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="for-doctors" className="bg-muted/50 text-muted-foreground/90 py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-primary text-xs font-bold tracking-[.18em] uppercase">
              For doctors and clinics
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              More time for care. Less time on admin.
            </h2>
            <p className="text-muted-foreground/60 mt-5 max-w-lg text-sm leading-7">
              Give your team a clearer way to manage availability, appointments, and patient
              relationships from one calm workspace.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8">
              Explore MediBook for teams <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Manage availability', 'Set schedules and open slots in minutes.'],
              ['Track patients', 'Keep every visit and follow-up organized.'],
              ['Generate prescriptions', 'Create clear digital prescriptions faster.'],
              ['Monitor performance', 'See appointments and practice analytics.'],
            ].map(([title, copy]) => (
              <Panel
                key={title}
                title={title}
                className="border-muted bg-card/50 rounded-2xl border p-5"
              >
                <Check className="text-success size-5" />
                <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
                <p className="text-muted-foreground/50 mt-2 text-xs leading-5">{copy}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <blockquote className="bg-primary/10 rounded-3xl p-8 sm:p-10">
            <div className="text-warning flex gap-1">★★★★★</div>
            <p className="mt-6 text-xl leading-8 font-extrabold tracking-[-.02em]">
              “I found a cardiologist who had an opening that worked with my schedule. Booking took
              less than two minutes.”
            </p>
            <footer className="mt-8 flex items-center gap-3">
              <span className="bg-card text-primary flex size-10 items-center justify-center rounded-full">
                <UserRound className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">Maya R.</strong>
                <span className="text-muted-foreground text-xs">MediBook patient</span>
              </span>
            </footer>
          </blockquote>
          <blockquote className="bg-success/10 rounded-3xl p-8 sm:p-10">
            <div className="text-warning flex gap-1">★★★★★</div>
            <p className="mt-6 text-xl leading-8 font-extrabold tracking-[-.02em]">
              “MediBook gives our front desk one source of truth. We spend less time coordinating
              and more time welcoming patients.”
            </p>
            <footer className="mt-8 flex items-center gap-3">
              <span className="bg-card text-success flex size-10 items-center justify-center rounded-full">
                <Stethoscope className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">Dr. Daniel Kim</strong>
                <span className="text-muted-foreground text-xs">Clinic director</span>
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="border-muted bg-card border-y py-10">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-5 text-center sm:flex-row sm:text-left">
          <span className="bg-success/20 text-success flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h2 className="text-base font-extrabold">Your health information deserves care.</h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              MediBook uses secure authentication, protected medical information, and role-based
              access so the right people see the right information.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8">
        <div className="bg-primary overflow-hidden rounded-[28px] px-6 py-12 text-center text-white sm:px-10 lg:py-16">
          <p className="text-primary-foreground text-xs font-bold tracking-[.18em] uppercase">
            Start feeling in control
          </p>
          <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-6">
            Join thousands of patients who trust MediBook to simplify their healthcare journey. Book
            your first appointment in under 60 seconds – no forms, no hassle, just care.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get started today <ArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="outline">Learn how it works</Button>
          </div>
        </div>
      </section>

      <footer className="border-muted bg-background/95 border-t py-10 backdrop-blur">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-3 text-center sm:text-left">
              <a href="#top" className="flex items-center gap-2.5">
                <span className="bg-primary flex size-10 items-center justify-center rounded-[13px] text-white shadow-[0_8px_18px_rgba(37,99,235,.2)]">
                  <HeartPulse className="size-5" />
                </span>
                <span>
                  <span className="block text-[17px] font-extrabold tracking-[-.03em]">
                    MediBook
                  </span>
                  <span className="text-muted-foreground block text-[10px] font-medium">
                    Care, connected.
                  </span>
                </span>
              </a>
              <p className="text-muted-foreground text-[12px]">
                © {new Date().getFullYear()} MediBook. All rights reserved.
              </p>
            </div>
            <nav className="flex flex-col gap-2 sm:flex-row sm:gap-8">
              {[
                ['Find Doctors', '#find-doctors'],
                ['How It Works', '#how-it-works'],
                ['For Doctors', '#for-doctors'],
                ['For Patients', '#for-doctors'],
                ['About', '#about'],
                ['Privacy', '#'],
                ['Terms', '#'],
                ['Contact', '#'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-primary text-[12px] font-medium transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <a href="#" className="text-muted-foreground hover:text-primary text-[11px]">
              Accessibility
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-[11px]">
              Security
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-[11px]">
              Status
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
