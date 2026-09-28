import type { Metadata } from 'next';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create an account',
  robots: 'noindex, nofollow',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex h-screen">
      {/* Visual Panel - Hidden on mobile, shown on desktop */}
      <aside className="bg-primary/60 relative hidden overflow-hidden lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-12">
        <div className="bg-primary/30 absolute -top-32 -right-36 size-[520px] rounded-full blur-3xl" />
        <div className="bg-primary/70 absolute -bottom-32 -left-32 size-[440px] rounded-full blur-2xl" />

        <div className="relative z-10">
          <Link href="/" className="mb-10 flex items-center gap-2.5">
            <span className="bg-primary text-primary-foreground shadow-primary/20 grid size-9 place-items-center rounded-xl shadow-lg">
              <Stethoscope className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Medi<span className="text-primary-foreground/80">Book</span>
            </span>
          </Link>
          <p className="max-w-sm text-4xl leading-[1.1] font-semibold tracking-tight text-white">
            Care that feels <span className="text-cobalt-200">personal.</span>
          </p>
          <p className="text-cobalt-200 mt-5 max-w-sm text-base leading-7">
            Your trusted space to find the right care, book appointments, and stay on top of your
            health.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-cobalt-200 text-cobalt-800 grid size-11 place-items-center rounded-2xl">
                  <Stethoscope className="size-5" />
                </div>
                <div>
                  <p className="text-cobalt-200 text-xs">Your next visit</p>
                  <p className="font-semibold text-white">Dr. Emily Carter</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                Confirmed
              </span>
            </div>
            <div className="text-cobalt-200 mt-5 flex items-center gap-3 border-t border-white/15 pt-4 text-xs">
              <span className="rounded-lg bg-white/10 px-3 py-2 font-semibold text-white">
                Wed, 24 Apr
              </span>
              <span>10:30 AM</span>
              <span className="ml-auto">Video visit</span>
            </div>
          </div>
          <div className="text-cobalt-200 mt-4 flex items-center gap-2 text-xs">
            <svg
              className="text-cobalt-300 size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Your health data is private and secure
          </div>
        </div>
      </aside>

      {/* Main Auth Content */}
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full xl:max-w-[60%]">{children}</div>
      </section>
    </div>
  );
}
