/**
 * Prescription PDF Generation Service
 * Uses PDFKit to generate professional prescription PDFs
 */

import PDFDocument from 'pdfkit';
import type { Prescription } from '../types';

export interface PrescriptionPDFData {
  prescription: Prescription;
  patientName: string;
  patientDob: string | Date;
  patientBloodGroup: string;
  doctorName: string;
  doctorTitle: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  prescriptionId: string;
  date: string;
}

/**
 * Generate a prescription PDF
 */
export async function generatePrescriptionPDF(data: PrescriptionPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Prescription ${data.prescriptionId}`,
        Author: data.doctorName,
        Subject: `Prescription for ${data.patientName}`,
        Keywords: 'prescription, medical, healthcare',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Colors
    const primaryColor = '#1E40AF'; // Clinical Cobalt
    // const secondaryColor = '#059669'; // Vital Emerald
    const textColor = '#0F172A'; // Deep Navy
    const mutedColor = '#64748B';
    const borderColor = '#E2E8F0';
    const lightBorderColor = '#EDF1F3';

    // Header with clinic info
    doc.fontSize(20).font('Helvetica-Bold').fillColor(primaryColor).text(data.clinicName, 50, 50);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedColor)
      .text(`${data.clinicAddress} • ${data.clinicPhone} • ${data.clinicEmail}`, 50, 75);

    // Prescription ID and Date on right (aligned to right margin)
    const pageWidth = doc.page.width;
    const rightMargin = doc.page.margins.right;
    const textWidth = 150;
    const rightX = pageWidth - rightMargin - textWidth;

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedColor)
      .text(`Rx No. ${data.prescriptionId}`, rightX, 50, {
        align: 'right',
        width: textWidth,
        lineBreak: false,
      });
    doc.text(data.date, rightX, 65, { align: 'right', width: textWidth, lineBreak: false });

    // Horizontal line
    doc.strokeColor(primaryColor).lineWidth(2).moveTo(50, 95).lineTo(550, 95).stroke();

    // Patient and Doctor info
    const infoY = 110;
    doc.fontSize(9).fillColor(textColor);

    // Patient info
    doc.font('Helvetica-Bold').fillColor(primaryColor).text('PATIENT', 50, infoY);

    doc
      .font('Helvetica')
      .fillColor(mutedColor)
      .text(data.patientName, 50, infoY + 15);

    const dobStr =
      data.patientDob instanceof Date
        ? data.patientDob.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : data.patientDob;
    doc.text(`DOB: ${dobStr}  •  Blood group: ${data.patientBloodGroup}`, 50, infoY + 30);

    // Doctor info
    doc.font('Helvetica-Bold').fillColor(primaryColor).text('DOCTOR', 300, infoY);

    doc
      .font('Helvetica')
      .fillColor(mutedColor)
      .text(data.doctorName, 300, infoY + 15);
    doc.text(data.doctorTitle, 300, infoY + 30);

    // Horizontal line
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, 160).lineTo(550, 160).stroke();

    // Diagnosis
    doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('DIAGNOSIS', 50, 170);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(textColor)
      .text(data.prescription.diagnosis || '—', 50, 185);

    // Horizontal line
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, 210).lineTo(550, 210).stroke();

    // Medications Table Header
    const tableTop = 220;
    const colWidths = { medicine: 200, dosage: 80, frequency: 100, duration: 80 };
    const colX = {
      medicine: 50,
      dosage: 50 + colWidths.medicine + 10,
      frequency: 50 + colWidths.medicine + 10 + colWidths.dosage + 10,
      duration: 50 + colWidths.medicine + 10 + colWidths.dosage + 10 + colWidths.frequency + 10,
    };

    doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor);

    doc.text('MEDICINE', colX.medicine, tableTop, { width: colWidths.medicine });
    doc.text('DOSAGE', colX.dosage, tableTop, { width: colWidths.dosage });
    doc.text('FREQUENCY', colX.frequency, tableTop, { width: colWidths.frequency });
    doc.text('DURATION', colX.duration, tableTop, { width: colWidths.duration });

    // Table header line
    doc
      .strokeColor(primaryColor)
      .lineWidth(1)
      .moveTo(50, tableTop + 20)
      .lineTo(550, tableTop + 20)
      .stroke();

    // Medications rows
    let rowY = tableTop + 30;
    const medications = data.prescription.medications as Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string | null;
    }>;

    medications.forEach((med, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        doc
          .fillColor('#F8FAFC')
          .rect(50, rowY - 5, 500, 30)
          .fill();
      }

      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor(textColor)
        .text(med.name || '—', colX.medicine, rowY, { width: colWidths.medicine });

      if (med.instructions) {
        doc
          .font('Helvetica')
          .fillColor(mutedColor)
          .fontSize(7)
          .text(med.instructions, colX.medicine, rowY + 12, { width: colWidths.medicine });
      }

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(textColor)
        .text(med.dosage || '—', colX.dosage, rowY, { width: colWidths.dosage })
        .text(med.frequency || '—', colX.frequency, rowY, { width: colWidths.frequency })
        .text(med.duration || '—', colX.duration, rowY, { width: colWidths.duration });

      // Row separator
      doc
        .strokeColor(lightBorderColor)
        .lineWidth(0.5)
        .moveTo(50, rowY + 25)
        .lineTo(550, rowY + 25)
        .stroke();

      rowY += 30;
    });

    if (medications.length === 0) {
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(mutedColor)
        .text('No medications added', 50, rowY, { width: 500, align: 'center' });
      rowY += 20;
    }

    // Horizontal line
    doc
      .strokeColor(borderColor)
      .lineWidth(1)
      .moveTo(50, rowY + 10)
      .lineTo(550, rowY + 10)
      .stroke();

    // Test Recommendations and Notes
    const notesY = rowY + 25;

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('TEST RECOMMENDATIONS', 50, notesY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(textColor)
      .text(data.prescription.tests || '—', 50, notesY + 15, { width: 230 });

    doc.font('Helvetica-Bold').fillColor(primaryColor).text('ADDITIONAL NOTES', 320, notesY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(data.prescription.notes || '—', 320, notesY + 15, { width: 230 });

    // Footer with signature and validity
    const footerY = notesY + 60;

    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, footerY).lineTo(550, footerY).stroke();

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedColor)
      .text('Valid for 30 days', 50, footerY + 15);
    doc.text(`Appointment: ${data.prescription.appointmentId}`, 50, footerY + 30);

    // Signature
    // doc
    //   .font('Helvetica')
    //   .fillColor(textColor)
    //   .text('──────────────────', 400, footerY + 20, { width: 140, align: 'center' });
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(mutedColor)
      .text(`Dr. ${data.doctorName.replace('Dr. ', '')}`, 400, footerY + 40, {
        width: 140,
        align: 'center',
      });
    doc.text('Doctor Signature', 400, footerY + 52, { width: 140, align: 'center' });

    // Watermark (using rotate transformation)
    doc.save();
    doc.translate(300, 400);
    doc.rotate(-45);
    doc
      .fontSize(80)
      .font('Helvetica-Bold')
      .fillColor('#E2E8F0')
      .opacity(0.1)
      .text('MediBook', -100, -20, { align: 'center', width: 200 });
    doc.restore();

    doc.end();
  });
}

/**
 * Generate a simple prescription PDF (for quick generation)
 */
export async function generateSimplePrescriptionPDF(
  prescription: Prescription,
  doctorName: string,
  patientName: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primaryColor = '#1E40AF';
    const textColor = '#0F172A';

    // Simple header
    doc.fontSize(18).font('Helvetica-Bold').fillColor(primaryColor).text('PRESCRIPTION', 50, 50);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor(textColor)
      .text(`Doctor: ${doctorName}`, 50, 80)
      .text(`Patient: ${patientName}`, 50, 95)
      .text(`Date: ${new Date().toLocaleDateString()}`, 50, 110);

    doc.moveDown();

    // Diagnosis
    doc.fontSize(12).font('Helvetica-Bold').text('Diagnosis:');
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(prescription.diagnosis || '—');

    doc.moveDown();

    // Medications
    doc.fontSize(12).font('Helvetica-Bold').text('Medications:');

    const medications = prescription.medications as Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string | null;
    }>;

    medications.forEach((med, index) => {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${med.name}`);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(
          `   Dosage: ${med.dosage}  |  Frequency: ${med.frequency}  |  Duration: ${med.duration}`
        );
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`);
      }
      doc.moveDown(0.5);
    });

    if (medications.length === 0) {
      doc.fontSize(10).font('Helvetica').text('No medications prescribed.');
      doc.moveDown();
    }

    // Tests
    if (prescription.tests) {
      doc.fontSize(12).font('Helvetica-Bold').text('Test Recommendations:');
      doc.fontSize(11).font('Helvetica').text(prescription.tests);
      doc.moveDown();
    }

    // Notes
    if (prescription.notes) {
      doc.fontSize(12).font('Helvetica-Bold').text('Additional Notes:');
      doc.fontSize(11).font('Helvetica').text(prescription.notes);
      doc.moveDown();
    }

    // Signature
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text('──────────────────');
    doc.text(`Dr. ${doctorName.replace('Dr. ', '')}`);
    doc.text('Doctor Signature');

    doc.end();
  });
}

export { PDFDocument };
