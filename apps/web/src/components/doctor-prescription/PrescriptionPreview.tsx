'use client';

import { Download, FileText, Printer } from 'lucide-react';
import type { PrescriptionPreviewProps } from './types';

export function PrescriptionPreview({
  diagnosis,
  notes,
  medications,
  testRecommendations,
  appointmentId,
  patientName,
  patientDob,
  patientBloodGroup,
  doctorName,
  doctorTitle,
  clinicName,
  clinicAddress,
  clinicPhone,
  clinicEmail,
  prescriptionId,
  date,
}: PrescriptionPreviewProps) {
  return (
    <section className="border-border bg-card rounded-2xl border p-3 shadow-sm">
      <div className="border-border flex items-center justify-between border-b px-3 pb-3">
        <p className="flex items-center gap-2 text-sm font-black">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          Medi<span className="text-primary">Book</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.print()}
            aria-label="Print prescription"
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2 transition-colors"
          >
            <Printer className="size-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => window.print()}
            aria-label="Download PDF"
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2 transition-colors"
          >
            <Download className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <article className="prescription-paper mt-3 rounded-xl border border-[#dbe5eb] bg-white p-5 text-[#243b53] shadow-inner sm:p-7">
        <div className="border-primary flex items-start justify-between border-b-2 pb-4">
          <div>
            <h3 className="text-primary text-lg font-black">{clinicName}</h3>
            <p className="mt-1 text-[10px] text-[#607d8b]">
              {clinicAddress} &middot; {clinicPhone} &middot; {clinicEmail}
            </p>
          </div>
          <div className="text-right text-[10px] text-[#607d8b]">
            <p>Rx No. {prescriptionId}</p>
            <p>{date}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b border-[#dbe5eb] py-4 text-[10px]">
          <p>
            <b>Patient</b>
            <br />
            {patientName}
            <br />
            DOB: {patientDob} &middot; Blood group: {patientBloodGroup}
          </p>
          <p className="text-right">
            <b>Doctor</b>
            <br />
            {doctorName}
            <br />
            {doctorTitle}
          </p>
        </div>
        <div className="py-4 text-[10px]">
          <p className="text-primary font-bold tracking-wider uppercase">Diagnosis</p>
          <p className="mt-1 font-semibold">{diagnosis || '—'}</p>
        </div>
        <table className="w-full text-left text-[9px]">
          <thead>
            <tr className="text-primary border-y border-[#dbe5eb]">
              <th className="py-2">Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication, index) => (
              <tr key={index} className="border-b border-[#edf1f3]">
                <td className="py-2 font-bold">
                  {medication.medicine || '—'}
                  {medication.instructions && (
                    <span className="block font-normal text-[#607d8b]">
                      {medication.instructions}
                    </span>
                  )}
                </td>
                <td>{medication.dosage || '—'}</td>
                <td>{medication.frequency || '—'}</td>
                <td>{medication.duration || '—'}</td>
              </tr>
            ))}
            {medications.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground py-4 text-center">
                  No medications added
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="grid gap-3 border-b border-[#dbe5eb] py-4 text-[10px] sm:grid-cols-2">
          <p>
            <b>Test recommendations</b>
            <br />
            {testRecommendations || '—'}
          </p>
          <p>
            <b>Additional notes</b>
            <br />
            {notes || '—'}
          </p>
        </div>
        <div className="flex items-end justify-between pt-8 text-[10px]">
          <p className="text-[#607d8b]">
            Valid for 30 days
            <br />
            Appointment: {appointmentId}
          </p>
          <p className="text-center font-semibold">
            /s/ {doctorName.replace('Dr. ', '')}
            <br />
            <span className="text-[#607d8b]">Doctor signature</span>
          </p>
        </div>
      </article>
    </section>
  );
}
