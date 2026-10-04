/**
 * Notification Service
 * Stub methods for booking confirmations, cancellations, and reminders
 * Ready for BullMQ integration in Phase 6
 */

export interface NotificationPayload {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  startTime: Date;
  endTime: Date;
  doctorName: string;
  specialty: string;
  clinic: string;
  consultationType: string;
}

export interface ReminderPayload extends NotificationPayload {
  hoursBefore: number;
}

export interface ReschedulePayload extends NotificationPayload {
  oldSlotId: string;
  newSlotId: string;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
}

export interface CheckInPayload extends NotificationPayload {
  // Future: add check-in specific fields (e.g., checkInTime, location)
  checkInTime?: Date;
}

export interface CompletionPayload extends NotificationPayload {
  diagnosis?: string | null;
  notes?: string | null;
}

export class NotificationService {
  /**
   * Send booking confirmation notification
   * In production: queue to BullMQ for email/SMS/push delivery
   */
  async sendBookingConfirmation(payload: NotificationPayload): Promise<void> {
    console.log('[NotificationService] Booking confirmation queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'booking_confirmation',
      channels: ['email', 'sms', 'push'],
    });

    // TODO: Implement actual notification delivery
    // await this.queue.add('notification', {
    //   type: 'booking_confirmation',
    //   payload,
    // });
  }

  /**
   * Send booking cancellation notification
   * In production: queue to BullMQ for email/SMS/push delivery
   */
  async sendBookingCancellation(payload: NotificationPayload): Promise<void> {
    console.log('[NotificationService] Booking cancellation queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'booking_cancellation',
      channels: ['email', 'sms', 'push'],
    });

    // TODO: Implement actual notification delivery
  }

  /**
   * Send 24-hour reminder notification
   * In production: scheduled job queues this 24h before appointment
   */
  async sendReminder24h(payload: ReminderPayload): Promise<void> {
    console.log('[NotificationService] 24h reminder queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'reminder_24h',
      hoursBefore: 24,
      channels: ['email', 'sms', 'push'],
    });

    // TODO: Implement actual notification delivery
  }

  /**
   * Send 2-hour reminder notification
   * In production: scheduled job queues this 2h before appointment
   */
  async sendReminder2h(payload: ReminderPayload): Promise<void> {
    console.log('[NotificationService] 2h reminder queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'reminder_2h',
      hoursBefore: 2,
      channels: ['email', 'sms', 'push'],
    });

    // TODO: Implement actual notification delivery
  }

  /**
   * Queue all appointment notifications
   * Called after successful booking
   */
  async queueAppointmentNotifications(payload: NotificationPayload): Promise<void> {
    // Immediate confirmation
    await this.sendBookingConfirmation(payload);

    // Schedule reminders
    // In production: use BullMQ delayed jobs or a scheduler
    console.log(
      '[NotificationService] Reminders scheduled for appointment:',
      payload.appointmentId
    );
  }

  /**
   * Send booking reschedule notification
   * In production: queue to BullMQ for email/SMS/push delivery
   */
  async sendBookingReschedule(payload: ReschedulePayload): Promise<void> {
    console.log('[NotificationService] Booking reschedule queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'booking_reschedule',
      channels: ['email', 'sms', 'push'],
      oldSlotId: payload.oldSlotId,
      newSlotId: payload.newSlotId,
      oldStartTime: payload.oldStartTime,
      newStartTime: payload.newStartTime,
    });

    // TODO: Implement actual notification delivery
  }

  /**
   * Send check-in confirmation notification
   * In production: queue to BullMQ for email/SMS/push delivery
   */
  async sendCheckInConfirmation(payload: CheckInPayload): Promise<void> {
    console.log('[NotificationService] Check-in confirmation queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'check_in_confirmation',
      channels: ['email', 'sms', 'push'],
    });

    // TODO: Implement actual notification delivery
  }

  /**
   * Send appointment completion notification
   * In production: queue to BullMQ for email/SMS/push delivery
   */
  async sendAppointmentCompletion(payload: CompletionPayload): Promise<void> {
    console.log('[NotificationService] Appointment completion queued:', {
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      type: 'appointment_completion',
      channels: ['email', 'sms', 'push'],
      diagnosis: payload.diagnosis,
      notes: payload.notes,
    });

    // TODO: Implement actual notification delivery
  }
}

// Factory function for dependency injection
export function createNotificationService(): NotificationService {
  return new NotificationService();
}
