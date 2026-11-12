'use client';

import type {
  AgentResponse,
  AgentRequest,
  GenUIBlock,
  DoctorResult,
  AppointmentReview,
  AppointmentSummary,
} from '@doctor-appointment-app/shared';

const demoDoctors: DoctorResult[] = [
  {
    id: 'doc-1',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    qualifications: 'MD, FACC',
    experience: '15 years',
    clinic: 'Heart Health Center',
    fee: '$250',
    rating: '4.9 ★',
    availability: 'Tomorrow 10:00 AM',
    initials: 'MC',
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Williams',
    specialty: 'Cardiology',
    qualifications: 'MD, PhD',
    experience: '12 years',
    clinic: 'Cardiology Associates',
    fee: '$200',
    rating: '4.8 ★',
    availability: 'Today 2:00 PM',
    initials: 'SW',
  },
  {
    id: 'doc-3',
    name: 'Dr. James Anderson',
    specialty: 'Dermatology',
    qualifications: 'MD, FAAD',
    experience: '10 years',
    clinic: 'Skin Care Clinic',
    fee: '$180',
    rating: '4.7 ★',
    availability: 'Friday 9:00 AM',
    initials: 'JA',
  },
  {
    id: 'doc-4',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    qualifications: 'MD, FAAP',
    experience: '8 years',
    clinic: "Children's Medical Center",
    fee: '$150',
    rating: '4.9 ★',
    availability: 'Monday 11:00 AM',
    initials: 'ER',
  },
  {
    id: 'doc-5',
    name: 'Dr. Robert Kim',
    specialty: 'Orthopedics',
    qualifications: 'MD, FAAOS',
    experience: '20 years',
    clinic: 'Sports Medicine Institute',
    fee: '$300',
    rating: '4.6 ★',
    availability: 'Wednesday 3:00 PM',
    initials: 'RK',
  },
  {
    id: 'doc-6',
    name: 'Dr. Lisa Thompson',
    specialty: 'Neurology',
    qualifications: 'MD, FAAN',
    experience: '14 years',
    clinic: 'Neuro Wellness Center',
    fee: '$280',
    rating: '4.8 ★',
    availability: 'Thursday 10:00 AM',
    initials: 'LT',
  },
];

const demoAppointments: AppointmentSummary[] = [
  {
    reference: 'APT-2026-001',
    doctor: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    clinic: 'Heart Health Center',
    date: 'Sep 24, 2026',
    time: '10:30 AM',
    status: 'Scheduled',
  },
  {
    reference: 'APT-2026-002',
    doctor: 'Dr. Sarah Williams',
    specialty: 'Cardiology',
    clinic: 'Cardiology Associates',
    date: 'Sep 18, 2026',
    time: '2:00 PM',
    status: 'Completed',
  },
  {
    reference: 'APT-2026-003',
    doctor: 'Dr. James Anderson',
    specialty: 'Dermatology',
    clinic: 'Skin Care Clinic',
    date: 'Sep 10, 2026',
    time: '9:00 AM',
    status: 'Completed',
  },
];

export async function respondToPatient(request: AgentRequest): Promise<AgentResponse> {
  const { threadId, message } = request;
  const lower = message.toLowerCase();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  // Cardiology search
  if (lower.includes('cardiologist') || lower.includes('cardiology') || lower.includes('heart')) {
    const cardiologists = demoDoctors.filter((d) => d.specialty === 'Cardiology');
    return {
      threadId,
      message: 'Here are cardiology providers from the demo directory.',
      ui: [{ type: 'doctor_results', data: cardiologists }],
      status: 'completed',
    };
  }

  // Dermatology search
  if (lower.includes('dermatologist') || lower.includes('dermatology') || lower.includes('skin')) {
    const dermatologists = demoDoctors.filter((d) => d.specialty === 'Dermatology');
    return {
      threadId,
      message: 'Here are dermatology providers from the demo directory.',
      ui: [{ type: 'doctor_results', data: dermatologists }],
      status: 'completed',
    };
  }

  // Pediatrics search
  if (lower.includes('pediatrician') || lower.includes('pediatrics') || lower.includes('child')) {
    const pediatricians = demoDoctors.filter((d) => d.specialty === 'Pediatrics');
    return {
      threadId,
      message: 'Here are pediatric providers from the demo directory.',
      ui: [{ type: 'doctor_results', data: pediatricians }],
      status: 'completed',
    };
  }

  // Orthopedics search
  if (
    lower.includes('orthopedic') ||
    lower.includes('orthopedics') ||
    lower.includes('bone') ||
    lower.includes('joint')
  ) {
    const orthopedics = demoDoctors.filter((d) => d.specialty === 'Orthopedics');
    return {
      threadId,
      message: 'Here are orthopedic providers from the demo directory.',
      ui: [{ type: 'doctor_results', data: orthopedics }],
      status: 'completed',
    };
  }

  // Neurology search
  if (
    lower.includes('neurologist') ||
    lower.includes('neurology') ||
    lower.includes('brain') ||
    lower.includes('nerve')
  ) {
    const neurology = demoDoctors.filter((d) => d.specialty === 'Neurology');
    return {
      threadId,
      message: 'Here are neurology providers from the demo directory.',
      ui: [{ type: 'doctor_results', data: neurology }],
      status: 'completed',
    };
  }

  // Book with specific doctor
  if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
    for (const doctor of demoDoctors) {
      const lastName = doctor.name.split(' ').pop() || '';
      if (lower.includes(doctor.name.toLowerCase()) || lower.includes(lastName.toLowerCase())) {
        return {
          threadId,
          message: `Here are available demo times for ${doctor.name}.`,
          ui: [
            {
              type: 'appointment_slots',
              data: {
                doctor: doctor.name,
                date: 'Sep 24, 2026',
                slots: ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '4:00 PM'],
              },
            },
          ],
          status: 'completed',
        };
      }
    }
    return {
      threadId,
      message: 'Which doctor would you like to book with? I can show you available slots.',
      status: 'completed',
    };
  }

  // Upcoming appointments
  if (
    lower.includes('appointment') &&
    (lower.includes('upcoming') || lower.includes('this week') || lower.includes('my'))
  ) {
    return {
      threadId,
      message: 'Here are your upcoming demo appointments.',
      ui: [
        {
          type: 'appointment_list',
          data: demoAppointments.filter((a) => a.status === 'Scheduled'),
        },
      ],
      status: 'completed',
    };
  }

  // All appointments
  if (
    lower.includes('appointment') &&
    (lower.includes('all') || lower.includes('history') || lower.includes('past'))
  ) {
    return {
      threadId,
      message: 'Here are all your demo appointments.',
      ui: [{ type: 'appointment_list', data: demoAppointments }],
      status: 'completed',
    };
  }

  // Reschedule
  if (lower.includes('reschedule') || lower.includes('change')) {
    return {
      threadId,
      message: 'I can help you reschedule. Which appointment would you like to change?',
      status: 'completed',
    };
  }

  // What to bring / preparation
  if (lower.includes('bring') || lower.includes('prepare') || lower.includes('what should i')) {
    return {
      threadId,
      message:
        'For your visit, please bring:\n• Photo ID and insurance card\n• List of current medications\n• Any relevant medical records or test results\n• A list of questions for your doctor\n\nFor video visits, test your camera and microphone beforehand.',
      status: 'completed',
    };
  }

  // Prescriptions
  if (lower.includes('prescription') || lower.includes('medication') || lower.includes('refill')) {
    return {
      threadId,
      message:
        'Your prescriptions from completed visits are available in the Medical Records section. Would you like me to show you recent ones?',
      ui: [
        {
          type: 'healthcare_faq',
          data: {
            title: 'Prescription Refills',
            answer:
              'Contact your pharmacy directly for refills. For new prescriptions, schedule a follow-up with your doctor.',
          },
        },
      ],
      status: 'completed',
    };
  }

  // Insurance / billing
  if (
    lower.includes('insurance') ||
    lower.includes('bill') ||
    lower.includes('cost') ||
    lower.includes('price')
  ) {
    return {
      threadId,
      message:
        'Insurance coverage varies by plan. The fees shown are self-pay rates. Contact your insurance provider for specific coverage details.',
      status: 'completed',
    };
  }

  // Emergency
  if (
    lower.includes('emergency') ||
    lower.includes('urgent') ||
    lower.includes('chest pain') ||
    lower.includes("can't breathe")
  ) {
    return {
      threadId,
      message:
        'This is a demo assistant and cannot provide medical advice. For emergencies, please contact local emergency services immediately.',
      ui: [
        {
          type: 'medical_safety_notice',
          data: {
            message:
              'If you are experiencing a medical emergency, call 911 (US) or your local emergency number immediately. This assistant does not provide medical advice.',
          },
        },
      ],
      status: 'completed',
    };
  }

  // Human support
  if (
    lower.includes('human') ||
    lower.includes('talk to') ||
    lower.includes('speak to') ||
    lower.includes('agent') ||
    lower.includes('support')
  ) {
    return {
      threadId,
      message: 'You can reach our patient support team for assistance.',
      ui: [
        {
          type: 'human_support',
          data: {
            message: 'Our patient support team is available Monday-Friday, 8 AM - 6 PM.',
            contact: 'support@medibook.com · 1-800-MEDIBOOK',
          },
        },
      ],
      status: 'completed',
    };
  }

  // Default: general help
  return {
    threadId,
    message:
      'I can help you find doctors, check appointments, or answer questions about your visits. Try asking:\n• "Find me a cardiologist"\n• "What appointments do I have this week?"\n• "I need to reschedule my appointment"\n• "What should I bring to my visit?"',
    status: 'completed',
  };
}

export function createReview(doctor: string, time: string): GenUIBlock {
  const doc = demoDoctors.find((d) => d.name === doctor) || demoDoctors[0];
  return {
    type: 'appointment_review',
    data: {
      doctor: doc.name,
      specialty: doc.specialty,
      clinic: doc.clinic,
      date: 'Sep 24, 2026',
      time,
      visitType: 'Video visit',
      fee: doc.fee,
    },
  };
}

export function createMockConfirmation(
  review: GenUIBlock & { type: 'appointment_review' }
): GenUIBlock {
  return {
    type: 'appointment_success',
    data: {
      doctor: review.data.doctor,
      date: review.data.date,
      time: review.data.time,
      clinic: review.data.clinic,
      reference: `APT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'Demo confirmed',
    },
  };
}

export { demoDoctors };
