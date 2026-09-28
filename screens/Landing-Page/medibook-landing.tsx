'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  ['Dentistry', Dental],
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
    <main className="min-h-screen overflow-hidden bg-[#f7fafc] text-[#17324d]">
      <header className="sticky top-0 z-20 border-b border-[#e1ebf1]/80 bg-[#f7fafc]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5" aria-label="MediBook home">
            <span className="flex size-10 items-center justify-center rounded-[13px] bg-[#2563eb] text-white shadow-[0_8px_18px_rgba(37,99,235,.2)]">
              <HeartPulse className="size-5" />
            </span>
            <span>
              <span className="block text-[17px] font-extrabold tracking-[-.03em]">MediBook</span>
              <span className="block text-[10px] font-medium text-[#7890a1]">Care, connected.</span>
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
                className="text-[13px] font-semibold text-[#60798b] transition-colors hover:text-[#2563eb]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2.5 sm:flex">
            <Button variant="ghost" size="sm">
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
            className="border-t border-[#e1ebf1] bg-white px-5 py-4 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {['Find Doctors', 'How It Works', 'For Doctors', 'For Clinics', 'About'].map(
                (label) => (
                  <a
                    key={label}
                    href={`#${label === 'Find Doctors' ? 'find-doctors' : label === 'How It Works' ? 'how-it-works' : label === 'About' ? 'about' : 'for-doctors'}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-[#60798b] hover:bg-[#f3f7fa]"
                  >
                    {label}
                  </a>
                )
              )}
              <div className="mt-2 flex gap-2 border-t border-[#edf2f5] pt-3">
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
        <div className="absolute top-0 -right-24 -z-0 size-80 rounded-full bg-[#dff1ff] blur-3xl" />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9e1f2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#2563eb]">
              <span className="size-1.5 rounded-full bg-[#39b88a]" />
              Trusted care, on your terms
            </div>
            <h1 className="max-w-xl text-[clamp(2.7rem,6vw,5rem)] leading-[.98] font-extrabold tracking-[-.065em] text-[#17324d]">
              Healthcare appointments, <span className="text-[#2563eb]">made simple.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#668093]">
              Find qualified doctors, see real-time availability, and book the care you need online.
              MediBook makes every step feel clear and human.
            </p>
            <form
              id="find-doctors"
              onSubmit={handleSearch}
              className="mt-8 rounded-2xl border border-[#dce8ee] bg-white p-2 shadow-[0_14px_35px_rgba(30,73,104,.09)]"
            >
              <div className="grid gap-1 md:grid-cols-[1.3fr_1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 focus-within:bg-[#f5f9fc]">
                  <Search className="size-4 shrink-0 text-[#8ba2af]" />
                  <span className="sr-only">Search doctor</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9aadb8]"
                    placeholder="Doctor or specialty"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-xl border-t border-[#edf2f5] px-3 py-2.5 md:border-t-0 md:border-l">
                  <Stethoscope className="size-4 shrink-0 text-[#8ba2af]" />
                  <span className="sr-only">Specialty</span>
                  <select className="min-w-0 flex-1 bg-transparent text-sm text-[#60798b] outline-none">
                    <option>Any specialty</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Pediatrics</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-xl border-t border-[#edf2f5] px-3 py-2.5 md:border-t-0 md:border-l">
                  <MapPin className="size-4 shrink-0 text-[#8ba2af]" />
                  <span className="sr-only">Location</span>
                  <select className="min-w-0 flex-1 bg-transparent text-sm text-[#60798b] outline-none">
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
              <p role="status" className="mt-3 text-xs font-semibold text-[#2563eb]">
                {searchNotice}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#7890a1]">
              <span className="flex items-center gap-2">
                <Check className="size-4 text-[#39b88a]" />
                Verified doctors
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#39b88a]" />
                Private by design
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4 text-[#39b88a]" />
                Flexible appointments
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto max-w-[510px] overflow-hidden rounded-[28px] border border-[#d8e8ee] bg-[#e8f4f7] p-3 shadow-[0_26px_60px_rgba(42,91,116,.16)]">
              <div className="rounded-[21px] bg-white p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[.16em] text-[#8ba2af] uppercase">
                      Your care dashboard
                    </p>
                    <p className="mt-1 text-xl font-extrabold tracking-tight">
                      Good morning, Sarah
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#dcecff] text-[#2563eb]">
                    <CircleUserRound className="size-5" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-[#eef7ff] p-3">
                    <CalendarCheck2 className="size-4 text-[#2563eb]" />
                    <p className="mt-3 text-lg font-extrabold">02</p>
                    <p className="text-[10px] text-[#7890a1]">Upcoming visits</p>
                  </div>
                  <div className="rounded-xl bg-[#effbf6] p-3">
                    <FileText className="size-4 text-[#39a77f]" />
                    <p className="mt-3 text-lg font-extrabold">08</p>
                    <p className="text-[10px] text-[#7890a1]">Health records</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e9] p-3">
                    <Pill className="size-4 text-[#c48a2b]" />
                    <p className="mt-3 text-lg font-extrabold">03</p>
                    <p className="text-[10px] text-[#7890a1]">Prescriptions</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-[#e6eef2] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[.12em] text-[#8ba2af] uppercase">
                        Next appointment
                      </p>
                      <p className="mt-1 text-sm font-extrabold">Dr. Emily Carter</p>
                      <p className="mt-1 text-xs text-[#7890a1]">
                        Cardiology · Tue, Sep 22 at 10:30 AM
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e9f8f2] px-2.5 py-1 text-[10px] font-bold text-[#2e9170]">
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5f9fc] px-3 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#60798b]">
                      <VideoIcon /> Video visit
                    </span>
                    <ArrowRight className="size-4 text-[#2563eb]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-[#dce8ee] bg-white p-3 shadow-[0_12px_28px_rgba(42,91,116,.14)]">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#e8f7f2] text-[#2e9170]">
                <CalendarCheck2 className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#7890a1]">Appointments booked</p>
                <p className="text-sm font-extrabold">12,400+ this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5eef2] bg-white py-5">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-xs font-semibold text-[#7890a1] lg:justify-between lg:px-8">
          <span>Trusted by patients and care teams at</span>
          <span className="tracking-wide text-[#9bb0bc]">NORTHSTAR HEALTH</span>
          <span className="tracking-wide text-[#9bb0bc]">wellpoint clinics</span>
          <span className="tracking-wide text-[#9bb0bc]">HEARTLAND MEDICAL</span>
          <span className="tracking-wide text-[#9bb0bc]">carebridge</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#2563eb] uppercase">
              Find the right care
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              Care for every part of you.
            </h2>
          </div>
          <a
            href="#find-doctors"
            className="flex items-center gap-2 text-sm font-bold text-[#2563eb]"
          >
            Browse all specialties <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {specialties.map(([name, Icon]) => (
            <a
              key={name}
              href="#find-doctors"
              className="group rounded-2xl border border-[#e0ebf0] bg-white p-4 transition-all hover:-translate-y-1 hover:border-[#aacbf0] hover:shadow-[0_10px_25px_rgba(30,73,104,.08)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#eef5ff] text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-xs leading-4 font-bold">{name}</p>
              <p className="mt-1 text-[10px] text-[#8ba2af]">Explore care</p>
            </a>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[.18em] text-[#2563eb] uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              Care is easier in four simple steps.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#7890a1]">
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
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eaf2ff] text-lg font-extrabold text-[#2563eb] md:mx-0">
                  {number}
                </div>
                <h3 className="mt-5 text-base font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7890a1]">{copy}</p>
                {index < 3 && (
                  <ArrowRight className="absolute top-5 right-[-20px] hidden size-5 text-[#c3d8e2] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[.18em] text-[#2563eb] uppercase">
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
              className="rounded-2xl border border-[#e0ebf0] bg-white p-6 transition-shadow hover:shadow-[0_12px_28px_rgba(30,73,104,.07)]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#eef5ff] text-[#2563eb]">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#7890a1]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="for-doctors" className="bg-[#17324d] py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#9bc9ff] uppercase">
              For doctors and clinics
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">
              More time for care. Less time on admin.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#c5d7e8]">
              Give your team a clearer way to manage availability, appointments, and patient
              relationships from one calm workspace.
            </p>
            <Button className="mt-8 bg-white text-[#2563eb] hover:bg-[#eef5ff]">
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
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[.07] p-5">
                <Check className="size-5 text-[#7fe0ba]" />
                <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#b5cadb]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <blockquote className="rounded-3xl bg-[#eaf4ff] p-8 sm:p-10">
            <div className="flex gap-1 text-[#f0ae43]">★★★★★</div>
            <p className="mt-6 text-xl leading-8 font-bold tracking-[-.02em]">
              “I found a cardiologist who had an opening that worked with my schedule. Booking took
              less than two minutes.”
            </p>
            <footer className="mt-8 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#2563eb]">
                <UserRound className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">Maya R.</strong>
                <span className="text-xs text-[#7890a1]">MediBook patient</span>
              </span>
            </footer>
          </blockquote>
          <blockquote className="rounded-3xl bg-[#eff9f5] p-8 sm:p-10">
            <div className="flex gap-1 text-[#f0ae43]">★★★★★</div>
            <p className="mt-6 text-xl leading-8 font-bold tracking-[-.02em]">
              “MediBook gives our front desk one source of truth. We spend less time coordinating
              and more time welcoming patients.”
            </p>
            <footer className="mt-8 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#2e9170]">
                <Stethoscope className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">Dr. Daniel Kim</strong>
                <span className="text-xs text-[#7890a1]">Clinic director</span>
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="border-y border-[#e1ebf1] bg-white py-10">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-5 text-center sm:flex-row sm:text-left">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f7f2] text-[#2e9170]">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h2 className="text-base font-extrabold">Your health information deserves care.</h2>
            <p className="mt-1 text-sm leading-6 text-[#7890a1]">
              MediBook uses secure authentication, protected medical information, and role-based
              access so the right people see the right information.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-[#2563eb] px-6 py-12 text-center text-white sm:px-10 lg:py-16">
          <p className="text-xs font-bold tracking-[.18em] text-[#bfdbff] uppercase">
            Start feeling in control
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-5xl">
            Take control of your
            <br className="hidden sm:block" /> healthcare journey.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#dceaff]">
            Find the care that fits your life and make your next appointment the easiest one yet.
          </p>
          <Button className="mt-8 bg-white text-[#2563eb] hover:bg-[#eef5ff]">
            Get started today <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-[#e1ebf1] bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:px-8">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#2563eb] text-white">
                <HeartPulse className="size-4" />
              </span>
              <span className="text-base font-extrabold">MediBook</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#7890a1]">
              A simpler way to connect people with the care they need.
            </p>
          </div>
          {[
            ['Product', 'Find doctors', 'Book an appointment', 'Patient portal'],
            ['Company', 'About MediBook', 'For doctors', 'For clinics'],
            ['Resources', 'How it works', 'Help center', 'Care guides'],
            ['Support', 'Contact us', 'Privacy', 'Terms'],
          ].map(([heading, ...links]) => (
            <div key={heading}>
              <h3 className="text-xs font-extrabold tracking-[.12em] text-[#17324d] uppercase">
                {heading}
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <a key={link} href="#top" className="text-sm text-[#7890a1] hover:text-[#2563eb]">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#edf2f5] px-5 py-5 text-center text-xs text-[#9aadb8] lg:px-8">
          © 2026 MediBook. Care, connected.
        </div>
      </footer>
    </main>
  );
}

function VideoIcon() {
  return (
    <span className="flex size-4 items-center justify-center rounded bg-[#dcecff] text-[8px] font-bold text-[#2563eb]">
      ▶
    </span>
  );
}
function Dental() {
  return <Cross className="size-5" />;
}
