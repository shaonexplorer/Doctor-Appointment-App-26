import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Calendar, Users, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Stethoscope,
      title: 'Doctor Discovery',
      description:
        'Search and filter doctors by specialty, location, availability, and consultation type.',
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description:
        'Book appointments in real-time with atomic slot locking to prevent double-booking.',
    },
    {
      icon: Users,
      title: 'Role-Based Portals',
      description: 'Dedicated dashboards for Patients, Doctors, Staff, and Administrators.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'HIPAA-ready with audit logging, role-based access control, and encrypted data.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-cobalt-50 px-3 py-1 text-sm font-medium text-cobalt-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt-500"></span>
              </span>
              Clinical Precision Design System
            </span>
            <h1 className="mb-6 text-display-md font-bold text-foreground">
              Healthcare Appointments
              <br />
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-body-xl text-muted-foreground">
              A modern, secure platform for managing doctor appointments, prescriptions, and patient
              care. Built with clinical precision for healthcare professionals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cobalt-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-border py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-1 text-display-sm font-bold text-primary">99.9%</div>
              <div className="text-body-md text-muted-foreground">Uptime SLA</div>
            </div>
            <div>
              <div className="mb-1 text-display-sm font-bold text-primary">256-bit</div>
              <div className="text-body-md text-muted-foreground">Encryption</div>
            </div>
            <div>
              <div className="mb-1 text-display-sm font-bold text-primary">HIPAA</div>
              <div className="text-body-md text-muted-foreground">Compliant</div>
            </div>
            <div>
              <div className="mb-1 text-display-sm font-bold text-primary">24/7</div>
              <div className="text-body-md text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-display-sm font-bold text-foreground">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Comprehensive features designed for clinical workflows
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="medical-card-hover h-full">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cobalt-100 text-cobalt-700">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-heading-md">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cobalt-800 py-20 text-white md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-display-sm font-bold">Ready to Transform Your Practice?</h2>
            <p className="mb-8 text-body-lg text-cobalt-200">
              Join thousands of healthcare providers who trust our platform for their appointment
              management needs.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 bg-white text-cobalt-800 hover:bg-cobalt-50">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container-page">
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="hover:text-foreground">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-foreground">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 Doctor Appointment App. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.724h-3.308l-7.227-8.26-8.502 9.724h-3.308l8.502-9.724-7.227-8.26h3.308l7.227 8.26-8.502-9.724z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
