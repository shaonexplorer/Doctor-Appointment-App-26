'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, CalendarDays, X } from 'lucide-react';
import { DoctorCard } from '../doctors/DoctorCard';
import { CancelModal } from './CancelModal';

export type RescheduleStep = 'selectDoctor' | 'selectSlot' | 'confirm';

interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
  designation: string;
  rating: number;
  reviewCount: number;
  fee: number;
  nextAvailableSlot: string;
  avatar: string | null;
}

interface OriginalAppointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED' | 'LOCKED';
}

export interface RescheduleFlowProps {
  isOpen: boolean;
  onClose: () => void;
  originalAppointment: OriginalAppointment;
  onRescheduleComplete: (newAppointmentId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function RescheduleFlow({
  isOpen,
  onClose,
  originalAppointment,
  onRescheduleComplete,
  isLoading = false,
  className,
}: RescheduleFlowProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<RescheduleStep>('selectDoctor');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const mockDoctors: DoctorInfo[] = [
    {
      id: 'doc-1',
      name: 'Dr. Michael Anderson',
      specialty: 'Cardiology',
      designation: 'Senior Cardiologist',
      rating: 4.9,
      reviewCount: 127,
      fee: 150,
      nextAvailableSlot: 'Today, 2:30 PM',
      avatar: null,
    },
    {
      id: 'doc-2',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      designation: 'Dermatology Specialist',
      rating: 4.8,
      reviewCount: 89,
      fee: 120,
      nextAvailableSlot: 'Tomorrow, 10:00 AM',
      avatar: null,
    },
    {
      id: 'doc-3',
      name: 'Dr. Sarah Williams',
      specialty: 'General Medicine',
      designation: 'Primary Care Physician',
      rating: 4.7,
      reviewCount: 203,
      fee: 100,
      nextAvailableSlot: 'Tomorrow, 3:30 PM',
      avatar: null,
    },
  ];

  const mockSlots: Slot[] = [
    { id: 'slot-1', startTime: '09:00', endTime: '09:30', status: 'AVAILABLE' },
    { id: 'slot-2', startTime: '09:30', endTime: '10:00', status: 'AVAILABLE' },
    { id: 'slot-3', startTime: '10:00', endTime: '10:30', status: 'AVAILABLE' },
    { id: 'slot-4', startTime: '10:30', endTime: '11:00', status: 'BOOKED' },
    { id: 'slot-5', startTime: '11:00', endTime: '11:30', status: 'AVAILABLE' },
    { id: 'slot-6', startTime: '14:00', endTime: '14:30', status: 'AVAILABLE' },
    { id: 'slot-7', startTime: '14:30', endTime: '15:00', status: 'AVAILABLE' },
    { id: 'slot-8', startTime: '15:00', endTime: '15:30', status: 'AVAILABLE' },
  ];

  const handleBack = () => {
    if (step === 'selectSlot') {
      setStep('selectDoctor');
      setSelectedSlotId(null);
    } else if (step === 'confirm') {
      setStep('selectSlot');
    }
  };

  const handleConfirmReschedule = () => {
    const newAppointmentId = `APT-${Date.now()}`;
    onRescheduleComplete(newAppointmentId);
    onClose();
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={cn('bg-foreground/20 fixed inset-0 z-50 flex flex-col', className)}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
    >
      <div
        className="border-border bg-card w-full max-w-2xl flex-1 overflow-y-auto border-l p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 'selectDoctor'}
            className="text-muted-foreground hover:bg-secondary flex items-center gap-2 rounded-xl p-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span className="hidden font-semibold sm:inline">Back</span>
          </button>

          <div className="flex-1 text-center">
            <h2 id="reschedule-title" className="text-xl font-black">
              Reschedule Appointment
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Step {step === 'selectDoctor' ? 1 : step === 'selectSlot' ? 2 : 3} of 3
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:bg-secondary rounded-xl p-2"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div
          className="mb-6 flex items-center justify-center gap-2"
          role="progressbar"
          aria-valuenow={step === 'selectDoctor' ? 1 : step === 'selectSlot' ? 2 : 3}
          aria-valuemin={1}
          aria-valuemax={3}
        >
          {['Select Doctor', 'Select Slot', 'Confirm'].map((label, index) => {
            const stepNum = index + 1;
            const currentStepNum = step === 'selectDoctor' ? 1 : step === 'selectSlot' ? 2 : 3;
            const isCompleted = stepNum < currentStepNum;
            const isCurrent = stepNum === currentStepNum;

            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-primary border-primary text-primary-foreground ring-primary/20 ring-4'
                        : 'bg-background border-border text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                {index < 2 && (
                  <div
                    className={cn(
                      'h-1 w-12 transition-colors',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {step === 'selectDoctor' && (
          <div>
            <div className="mb-4">
              <p className="text-sm font-bold">Original Appointment</p>
              <div className="border-border bg-background mt-2 rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <div className="text-primary grid size-11 place-items-center rounded-xl bg-blue-100">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">{originalAppointment.doctor}</p>
                    <p className="text-muted-foreground text-xs">{originalAppointment.specialty}</p>
                    <p className="text-muted-foreground text-xs">
                      {originalAppointment.date} at {originalAppointment.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm font-bold">Select a Doctor</p>
            <div className="grid gap-3">
              {mockDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  photo={doctor.avatar || undefined}
                  name={doctor.name}
                  designation={doctor.designation}
                  specialty={doctor.specialty}
                  rating={doctor.rating}
                  reviewCount={doctor.reviewCount}
                  fee={doctor.fee}
                  nextAvailableSlot={doctor.nextAvailableSlot}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep('selectSlot');
                  }}
                  className="hover:border-primary/30 cursor-pointer transition hover:shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {step === 'selectSlot' && selectedDoctor && (
          <div>
            <div className="mb-4">
              <p className="text-sm font-bold">Selected Doctor</p>
              <div className="border-border bg-background mt-2 rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <div className="text-primary grid size-11 place-items-center rounded-xl bg-blue-100">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedDoctor.name}</p>
                    <p className="text-muted-foreground text-xs">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm font-bold">Available Slots for Tomorrow</p>
            <div
              className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4"
              role="listbox"
              aria-label="Available time slots"
            >
              {mockSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  role="option"
                  aria-selected={selectedSlotId === slot.id}
                  aria-disabled={slot.status !== 'AVAILABLE'}
                  onClick={() => slot.status === 'AVAILABLE' && setSelectedSlotId(slot.id)}
                  disabled={slot.status !== 'AVAILABLE'}
                  className={cn(
                    'relative h-16 rounded-xl border text-left transition-all',
                    'focus:ring-primary/20 focus:ring-2 focus:outline-none',
                    selectedSlotId === slot.id
                      ? 'border-primary bg-primary/5 ring-primary/20 shadow-sm ring-2'
                      : slot.status === 'AVAILABLE'
                        ? 'border-border hover:border-primary/30 hover:bg-primary/[0.02]'
                        : 'cursor-not-allowed border-red-200 bg-red-50'
                  )}
                >
                  {slot.status === 'BOOKED' && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      Booked
                    </span>
                  )}
                  <div className="flex h-full flex-col justify-center px-3 py-2">
                    <p className="text-sm font-bold">{formatTime(slot.startTime)}</p>
                    <p className="text-muted-foreground text-[10px]">{formatTime(slot.endTime)}</p>
                  </div>
                  {selectedSlotId === slot.id && (
                    <svg
                      className="text-primary absolute top-1/2 right-2 size-4 -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {selectedSlotId && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setStep('confirm')}
                  className="bg-primary text-primary-foreground w-full rounded-xl py-3 text-sm font-bold hover:opacity-90"
                >
                  Continue to Confirm
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && selectedDoctor && selectedSlotId && (
          <div>
            <p className="mb-4 text-sm font-bold">Confirm Reschedule</p>

            <div className="border-border bg-background mb-4 rounded-xl border p-4">
              <h3 className="font-semibold">Current Appointment</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{originalAppointment.doctor}</span>
                  <span className="font-semibold">
                    {originalAppointment.date} at {originalAppointment.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-primary/20 bg-primary/5 mb-6 rounded-xl border p-4">
              <h3 className="text-primary font-semibold">New Appointment</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-semibold">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty</span>
                  <span className="font-semibold">{selectedDoctor.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold">
                    {mockSlots.find((s) => s.id === selectedSlotId)
                      ? formatTime(mockSlots.find((s) => s.id === selectedSlotId)!.startTime)
                      : 'TBD'}
                  </span>
                </div>
                <div className="border-primary/20 flex justify-between border-t pt-2">
                  <span className="font-semibold">Fee</span>
                  <span className="text-primary font-bold">${selectedDoctor.fee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="border-border hover:bg-secondary rounded-xl border px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={isLoading}
                className="bg-primary text-primary-foreground rounded-xl px-4 py-3 text-sm font-bold hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
              >
                {isLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <CancelModal
          isOpen={showCancelConfirm}
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={() => {
            setShowCancelConfirm(false);
            onClose();
          }}
          appointment={{
            id: originalAppointment.id,
            doctor: originalAppointment.doctor,
            date: originalAppointment.date,
            time: originalAppointment.time,
            clinic: 'Clinic',
            status: 'Confirmed',
            payment: 'Pending',
            refundEligible: true,
          }}
        />
      </div>
    </div>
  );
}
