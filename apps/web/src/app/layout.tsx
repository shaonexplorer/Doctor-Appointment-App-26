import type { Metadata, Viewport } from 'next';
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  fallback: ['system-ui', 'sans-serif'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: {
    default: 'Doctor Appointment App',
    template: '%s | Doctor Appointment App',
  },
  description: 'Healthcare appointment management platform',
  keywords: ['healthcare', 'appointments', 'doctor', 'patient', 'medical'],
  authors: [{ name: 'Doctor Appointment App' }],
  creator: 'Doctor Appointment App',
  publisher: 'Doctor Appointment App',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://doctor-appointment.app',
    siteName: 'Doctor Appointment App',
    title: 'Doctor Appointment App',
    description: 'Healthcare appointment management platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Appointment App',
    description: 'Healthcare appointment management platform',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} ${mono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
