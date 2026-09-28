/**
 * Prisma Seed Script
 * Creates initial data for development
 */

import {
  PrismaClient,
  UserType,
  SlotStatus,
  Gender,
  AppointmentStatus,
  PaymentStatus,
  ConsultationType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Comprehensive doctor data across all specialties
const doctorsData = [
  // Cardiology
  {
    email: 'dr.anderson@doctorapp.com',
    firstName: 'Michael',
    lastName: 'Anderson',
    specialty: 'Cardiology',
    designation: 'Senior Consultant Cardiologist',
    licenseNo: 'MD123456',
    bio: 'Senior consultant cardiologist with 18+ years of experience in interventional cardiology and heart failure management. Fellow of the American College of Cardiology.',
    fee: 185.0,
    experience: 18,
    qualifications: 'MD, FACC',
    clinic: 'Heart & Vascular Center',
    symptoms: ['Chest pain', 'High blood pressure', 'Heart palpitations', 'Shortness of breath'],
  },
  {
    email: 'dr.chen@doctorapp.com',
    firstName: 'David',
    lastName: 'Chen',
    specialty: 'Cardiology',
    designation: 'Interventional Cardiologist',
    licenseNo: 'MD234567',
    bio: 'Specializes in complex coronary interventions, structural heart disease, and cardiac catheterization. Published researcher in cardiovascular medicine.',
    fee: 200.0,
    experience: 14,
    qualifications: 'MD, FSCAI',
    clinic: 'Cardiac Care Institute',
    symptoms: ['Chest pain', 'Coronary artery disease', 'Valve disorders', 'Arrhythmia'],
  },
  {
    email: 'dr.martinez@doctorapp.com',
    firstName: 'Isabel',
    lastName: 'Martinez',
    specialty: 'Cardiology',
    designation: 'Electrophysiologist',
    licenseNo: 'MD345678',
    bio: 'Expert in cardiac electrophysiology, ablation procedures, and device implantation. Pioneer in atrial fibrillation treatment.',
    fee: 220.0,
    experience: 12,
    qualifications: 'MD, FHRS',
    clinic: 'Heart Rhythm Center',
    symptoms: ['Irregular heartbeat', 'Atrial fibrillation', 'Palpitations', 'Syncope'],
  },

  // Dermatology
  {
    email: 'dr.carter@doctorapp.com',
    firstName: 'Emily',
    lastName: 'Carter',
    specialty: 'Dermatology',
    designation: 'Consultant Dermatologist',
    licenseNo: 'MD456789',
    bio: 'Board-certified dermatologist with expertise in medical, surgical, and cosmetic dermatology. Special interest in skin cancer detection.',
    fee: 150.0,
    experience: 12,
    qualifications: 'MD, FAAD',
    clinic: 'ClearSkin Clinic',
    symptoms: ['Acne', 'Skin rash', 'Eczema', 'Psoriasis', 'Skin cancer screening'],
  },
  {
    email: 'dr.kim@doctorapp.com',
    firstName: 'Jennifer',
    lastName: 'Kim',
    specialty: 'Dermatology',
    designation: 'Pediatric Dermatologist',
    licenseNo: 'MD567890',
    bio: 'Specializes in pediatric dermatology including birthmarks, genetic skin disorders, and adolescent acne. Gentle approach for young patients.',
    fee: 160.0,
    experience: 10,
    qualifications: 'MD, FAAD',
    clinic: "Children's Skin Center",
    symptoms: ['Birthmarks', 'Eczema', 'Acne', 'Warts', 'Genetic skin conditions'],
  },
  {
    email: 'dr.patel@doctorapp.com',
    firstName: 'Rajesh',
    lastName: 'Patel',
    specialty: 'Dermatology',
    designation: 'Mohs Surgeon',
    licenseNo: 'MD678901',
    bio: 'Fellowship-trained Mohs micrographic surgeon for skin cancer treatment. Also provides cosmetic dermatology services.',
    fee: 180.0,
    experience: 15,
    qualifications: 'MD, FACMS',
    clinic: 'Dermatology & Skin Cancer Center',
    symptoms: [
      'Skin cancer',
      'Suspicious moles',
      'Basal cell carcinoma',
      'Squamous cell carcinoma',
    ],
  },

  // Internal Medicine
  {
    email: 'dr.wilson@doctorapp.com',
    firstName: 'James',
    lastName: 'Wilson',
    specialty: 'Internal Medicine',
    designation: 'Internal Medicine Specialist',
    licenseNo: 'MD789012',
    bio: 'Comprehensive adult primary care with focus on preventive medicine, chronic disease management, and complex diagnostic cases.',
    fee: 120.0,
    experience: 15,
    qualifications: 'MD, FACP',
    clinic: 'MediBook Family Clinic',
    symptoms: ['Fatigue', 'Diabetes care', 'Hypertension', 'Annual checkup', 'Weight management'],
  },
  {
    email: 'dr.thompson@doctorapp.com',
    firstName: 'Robert',
    lastName: 'Thompson',
    specialty: 'Internal Medicine',
    designation: 'Geriatric Medicine Specialist',
    licenseNo: 'MD890123',
    bio: 'Specialized in care of older adults including dementia, polypharmacy management, fall prevention, and end-of-life planning.',
    fee: 130.0,
    experience: 20,
    qualifications: 'MD, FACP, AGSF',
    clinic: 'Senior Health Associates',
    symptoms: ['Memory loss', 'Multiple medications', 'Fall risk', 'Frailty', 'Dementia care'],
  },
  {
    email: 'dr.garcia@doctorapp.com',
    firstName: 'Maria',
    lastName: 'Garcia',
    specialty: 'Internal Medicine',
    designation: 'Hospitalist',
    licenseNo: 'MD901234',
    bio: 'Experienced hospitalist managing complex inpatient cases. Seamless transition from hospital to outpatient care.',
    fee: 140.0,
    experience: 11,
    qualifications: 'MD, SFHM',
    clinic: 'Metro Health Hospitalists',
    symptoms: [
      'Post-hospital care',
      'Complex medical issues',
      'Care coordination',
      'Chronic conditions',
    ],
  },

  // Pediatrics
  {
    email: 'dr.bennett@doctorapp.com',
    firstName: 'Olivia',
    lastName: 'Bennett',
    specialty: 'Pediatrics',
    designation: 'Consultant Pediatrician',
    licenseNo: 'MD012345',
    bio: 'Compassionate pediatrician providing comprehensive care from newborns to adolescents. Focus on developmental milestones and preventive care.',
    fee: 110.0,
    experience: 10,
    qualifications: 'MD, FAAP',
    clinic: 'Little Steps Pediatrics',
    symptoms: [
      'Fever',
      'Child nutrition',
      'Vaccinations',
      'Growth monitoring',
      'Developmental concerns',
    ],
  },
  {
    email: 'dr.rodriguez@doctorapp.com',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    specialty: 'Pediatrics',
    designation: 'Pediatric Neurologist',
    licenseNo: 'MD112235',
    bio: 'Specializes in pediatric neurological disorders including epilepsy, headaches, developmental delays, and neuromuscular conditions.',
    fee: 175.0,
    experience: 13,
    qualifications: 'MD, FAAP, FAAN',
    clinic: 'Pediatric Neurology Center',
    symptoms: [
      'Seizures',
      'Headaches',
      'Developmental delay',
      'Autism spectrum',
      'Muscle weakness',
    ],
  },
  {
    email: 'dr.nguyen@doctorapp.com',
    firstName: 'Thuy',
    lastName: 'Nguyen',
    specialty: 'Pediatrics',
    designation: 'Pediatric Cardiologist',
    licenseNo: 'MD223344',
    bio: 'Expert in congenital and acquired heart disease in children. Provides fetal echocardiography and long-term cardiac follow-up.',
    fee: 190.0,
    experience: 16,
    qualifications: 'MD, FAAP, FACC',
    clinic: "Children's Heart Institute",
    symptoms: [
      'Heart murmur',
      'Congenital heart disease',
      'Chest pain',
      'Fainting',
      'Palpitations in children',
    ],
  },

  // Neurology
  {
    email: 'dr.patel2@doctorapp.com',
    firstName: 'Sophia',
    lastName: 'Patel',
    specialty: 'Neurology',
    designation: 'Consultant Neurologist',
    licenseNo: 'MD334456',
    bio: 'General neurologist with subspecialty interest in headache disorders, multiple sclerosis, and neurodegenerative diseases.',
    fee: 165.0,
    experience: 16,
    qualifications: 'MD, FAAN',
    clinic: 'NeuroCare Institute',
    symptoms: ['Headaches', 'Sleep issues', 'Dizziness', 'Memory problems', 'Numbness'],
  },
  {
    email: 'dr.johnson@doctorapp.com',
    firstName: 'William',
    lastName: 'Johnson',
    specialty: 'Neurology',
    designation: 'Stroke Neurologist',
    licenseNo: 'MD445566',
    bio: 'Vascular neurologist specializing in acute stroke treatment, stroke prevention, and post-stroke rehabilitation.',
    fee: 185.0,
    experience: 14,
    qualifications: 'MD, FAAN, FAHA',
    clinic: 'Stroke & Neurovascular Center',
    symptoms: ['Stroke', 'TIA', 'Carotid stenosis', 'Stroke prevention', 'Post-stroke care'],
  },
  {
    email: 'dr.davis@doctorapp.com',
    firstName: 'Elizabeth',
    lastName: 'Davis',
    specialty: 'Neurology',
    designation: 'Movement Disorders Specialist',
    licenseNo: 'MD556678',
    bio: "Expert in Parkinson's disease, essential tremor, dystonia, and other movement disorders. Offers deep brain stimulation evaluation.",
    fee: 200.0,
    experience: 17,
    qualifications: 'MD, FAAN, MDS',
    clinic: 'Movement Disorders Clinic',
    symptoms: ['Tremor', "Parkinson's", 'Dystonia', 'Gait disorders', 'Deep brain stimulation'],
  },

  // Orthopedics
  {
    email: 'dr.lee@doctorapp.com',
    firstName: 'Daniel',
    lastName: 'Lee',
    specialty: 'Orthopedics',
    designation: 'Orthopedic Surgeon',
    licenseNo: 'MD667789',
    bio: 'Sports medicine and joint replacement specialist. Expertise in minimally invasive arthroscopic surgery and robotic-assisted joint replacement.',
    fee: 195.0,
    experience: 20,
    qualifications: 'MD, FAAOS',
    clinic: 'Motion & Joint Center',
    symptoms: ['Joint pain', 'Sports injuries', 'Arthritis', 'Fractures', 'Tendon injuries'],
  },
  {
    email: 'dr.brown@doctorapp.com',
    firstName: 'Amanda',
    lastName: 'Brown',
    specialty: 'Orthopedics',
    designation: 'Spine Surgeon',
    licenseNo: 'MD778900',
    bio: 'Fellowship-trained spine surgeon specializing in minimally invasive spine surgery, complex spinal deformity, and cervical/lumbar disorders.',
    fee: 210.0,
    experience: 13,
    qualifications: 'MD, FAAOS, FAANS',
    clinic: 'Spine & Orthopedic Institute',
    symptoms: ['Back pain', 'Neck pain', 'Sciatica', 'Spinal stenosis', 'Scoliosis'],
  },
  {
    email: 'dr.taylor@doctorapp.com',
    firstName: 'Christopher',
    lastName: 'Taylor',
    specialty: 'Orthopedics',
    designation: 'Hand & Upper Extremity Surgeon',
    licenseNo: 'MD889901',
    bio: 'Specializes in hand, wrist, elbow, and shoulder conditions. Expert in microsurgery, nerve compression, and complex trauma reconstruction.',
    fee: 185.0,
    experience: 11,
    qualifications: 'MD, FAAOS, CAQSH',
    clinic: 'Hand & Upper Extremity Center',
    symptoms: ['Carpal tunnel', 'Trigger finger', 'Tennis elbow', 'Rotator cuff', 'Hand trauma'],
  },

  // Psychiatry
  {
    email: 'dr.moore@doctorapp.com',
    firstName: 'Rebecca',
    lastName: 'Moore',
    specialty: 'Psychiatry',
    designation: 'Adult Psychiatrist',
    licenseNo: 'MD990011',
    bio: 'General adult psychiatrist providing medication management and psychotherapy for mood disorders, anxiety, and ADHD.',
    fee: 155.0,
    experience: 12,
    qualifications: 'MD, FAPA',
    clinic: 'MindWell Psychiatry',
    symptoms: ['Anxiety', 'Depression', 'ADHD', 'Bipolar disorder', 'PTSD'],
  },
  {
    email: 'dr.jackson@doctorapp.com',
    firstName: 'Thomas',
    lastName: 'Jackson',
    specialty: 'Psychiatry',
    designation: 'Child & Adolescent Psychiatrist',
    licenseNo: 'MD001122',
    bio: 'Specializes in psychiatric disorders in children and adolescents including autism, ADHD, anxiety, and mood disorders.',
    fee: 165.0,
    experience: 14,
    qualifications: 'MD, FAACAP',
    clinic: 'Youth Mental Health Center',
    symptoms: ['Child anxiety', 'ADHD', 'Autism', 'Depression in teens', 'Behavioral issues'],
  },
  {
    email: 'dr.white@doctorapp.com',
    firstName: 'Lisa',
    lastName: 'White',
    specialty: 'Psychiatry',
    designation: 'Addiction Psychiatrist',
    licenseNo: 'MD112234',
    bio: 'Expert in substance use disorders and dual diagnosis. Provides medication-assisted treatment (MAT) and comprehensive recovery planning.',
    fee: 175.0,
    experience: 10,
    qualifications: 'MD, FAPA, FASAM',
    clinic: 'Recovery & Wellness Center',
    symptoms: [
      'Substance abuse',
      'Opioid addiction',
      'Alcohol dependence',
      'Dual diagnosis',
      'Relapse prevention',
    ],
  },

  // Oncology
  {
    email: 'dr.harris@doctorapp.com',
    firstName: 'Kevin',
    lastName: 'Harris',
    specialty: 'Oncology',
    designation: 'Medical Oncologist',
    licenseNo: 'MD223345',
    bio: 'Board-certified medical oncologist specializing in breast, lung, and gastrointestinal cancers. Active in clinical trials.',
    fee: 225.0,
    experience: 15,
    qualifications: 'MD, FACP, FASCO',
    clinic: 'Comprehensive Cancer Center',
    symptoms: [
      'Cancer screening',
      'Chemotherapy',
      'Cancer follow-up',
      'Second opinion',
      'Clinical trials',
    ],
  },
  {
    email: 'dr.clark@doctorapp.com',
    firstName: 'Nicole',
    lastName: 'Clark',
    specialty: 'Oncology',
    designation: 'Radiation Oncologist',
    licenseNo: 'MD334457',
    bio: 'Radiation oncologist with expertise in IMRT, SBRT, and brachytherapy. Focus on breast, prostate, and CNS malignancies.',
    fee: 235.0,
    experience: 13,
    qualifications: 'MD, FASTRO',
    clinic: 'Advanced Radiation Oncology',
    symptoms: [
      'Radiation therapy',
      'Cancer treatment',
      'Prostate cancer',
      'Breast cancer',
      'Brain tumors',
    ],
  },

  // Ophthalmology
  {
    email: 'dr.lewis@doctorapp.com',
    firstName: 'Steven',
    lastName: 'Lewis',
    specialty: 'Ophthalmology',
    designation: 'Cataract & Refractive Surgeon',
    licenseNo: 'MD445567',
    bio: 'Premium cataract surgeon offering laser-assisted cataract surgery and refractive lens exchange. Also manages glaucoma and retinal disease.',
    fee: 170.0,
    experience: 18,
    qualifications: 'MD, FACS',
    clinic: 'Vision Excellence Center',
    symptoms: [
      'Cataracts',
      'Blurry vision',
      'Glaucoma',
      'LASIK consultation',
      'Diabetic eye disease',
    ],
  },
  {
    email: 'dr.walker@doctorapp.com',
    firstName: 'Michelle',
    lastName: 'Walker',
    specialty: 'Ophthalmology',
    designation: 'Retina Specialist',
    licenseNo: 'MD556679',
    bio: 'Vitreoretinal surgeon specializing in macular degeneration, diabetic retinopathy, retinal detachment, and complex retinal surgery.',
    fee: 195.0,
    experience: 11,
    qualifications: 'MD, FACS, FASRS',
    clinic: 'Retina & Vitreous Associates',
    symptoms: [
      'Macular degeneration',
      'Diabetic retinopathy',
      'Floaters',
      'Flashes',
      'Retinal detachment',
    ],
  },

  // ENT
  {
    email: 'dr.hall@doctorapp.com',
    firstName: 'Andrew',
    lastName: 'Hall',
    specialty: 'ENT',
    designation: 'Otolaryngologist',
    licenseNo: 'MD667790',
    bio: 'General ENT with focus on sinus surgery, voice disorders, and sleep apnea. Offers in-office balloon sinuplasty and minimally invasive procedures.',
    fee: 145.0,
    experience: 16,
    qualifications: 'MD, FACS',
    clinic: 'ENT & Sinus Center',
    symptoms: ['Sinusitis', 'Hearing loss', 'Sleep apnea', 'Voice disorders', 'Tonsillitis'],
  },
  {
    email: 'dr.allen@doctorapp.com',
    firstName: 'Samantha',
    lastName: 'Allen',
    specialty: 'ENT',
    designation: 'Pediatric Otolaryngologist',
    licenseNo: 'MD778901',
    bio: 'Pediatric ENT specialist treating ear infections, tonsil/adenoid issues, airway disorders, and congenital head/neck anomalies in children.',
    fee: 155.0,
    experience: 12,
    qualifications: 'MD, FAAP, FACS',
    clinic: "Children's ENT Specialists",
    symptoms: [
      'Ear infections',
      'Tonsillitis',
      'Sleep apnea in kids',
      'Speech delay',
      'Congenital anomalies',
    ],
  },

  // Urology
  {
    email: 'dr.young@doctorapp.com',
    firstName: 'Brian',
    lastName: 'Young',
    specialty: 'Urology',
    designation: 'Urologic Oncologist',
    licenseNo: 'MD889902',
    bio: 'Specializes in urologic cancers including prostate, kidney, bladder, and testicular cancer. Expert in robotic and minimally invasive surgery.',
    fee: 185.0,
    experience: 14,
    qualifications: 'MD, FACS',
    clinic: 'Urologic Oncology Center',
    symptoms: [
      'Prostate cancer',
      'Kidney cancer',
      'Bladder cancer',
      'Elevated PSA',
      'Blood in urine',
    ],
  },
  {
    email: 'dr.king@doctorapp.com',
    firstName: 'Laura',
    lastName: 'King',
    specialty: 'Urology',
    designation: 'Female Urologist',
    licenseNo: 'MD990012',
    bio: 'Focus on female urology including urinary incontinence, pelvic organ prolapse, recurrent UTIs, and interstitial cystitis.',
    fee: 165.0,
    experience: 10,
    qualifications: 'MD, FACS, FPMRS',
    clinic: "Women's Urology Clinic",
    symptoms: [
      'Urinary incontinence',
      'Pelvic prolapse',
      'Recurrent UTIs',
      'Interstitial cystitis',
      'Overactive bladder',
    ],
  },

  // Gastroenterology
  {
    email: 'dr.scott@doctorapp.com',
    firstName: 'Mark',
    lastName: 'Scott',
    specialty: 'Gastroenterology',
    designation: 'Gastroenterologist',
    licenseNo: 'MD001123',
    bio: 'General gastroenterologist with expertise in inflammatory bowel disease, colon cancer screening, and therapeutic endoscopy.',
    fee: 155.0,
    experience: 13,
    qualifications: 'MD, FACG',
    clinic: 'Digestive Health Associates',
    symptoms: ['Abdominal pain', 'Acid reflux', 'IBD', 'Colonoscopy', 'Liver disease'],
  },
  {
    email: 'dr.green@doctorapp.com',
    firstName: 'Karen',
    lastName: 'Green',
    specialty: 'Gastroenterology',
    designation: 'Hepatologist',
    licenseNo: 'MD112236',
    bio: 'Liver specialist managing hepatitis, cirrhosis, fatty liver disease, and liver transplant evaluation. Also performs advanced endoscopy.',
    fee: 175.0,
    experience: 11,
    qualifications: 'MD, FAASLD',
    clinic: 'Liver & Digestive Center',
    symptoms: ['Hepatitis', 'Fatty liver', 'Cirrhosis', 'Liver transplant', 'Abnormal liver tests'],
  },
];

// Helper to generate schedules for the next 30 days
function generateSchedules(doctorId: string, startDate: Date, days: number = 30) {
  const schedules = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < days; day++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + day);

    // Skip weekends for some doctors (randomize)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend && Math.random() > 0.3) continue;

    // Morning slots (9 AM - 12 PM)
    const morningSlots = Math.floor(Math.random() * 3) + 2; // 2-4 slots
    for (let i = 0; i < morningSlots; i++) {
      const slotStart = new Date(date);
      slotStart.setHours(9 + i, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);

      // 80% available, 15% booked, 5% cancelled
      const rand = Math.random();
      let status = SlotStatus.AVAILABLE;
      if (rand > 0.8) status = SlotStatus.BOOKED;
      else if (rand > 0.95) status = SlotStatus.CANCELLED;

      schedules.push({
        doctorId,
        startTime: slotStart,
        endTime: slotEnd,
        status,
      });
    }

    // Afternoon slots (1 PM - 4 PM)
    const afternoonSlots = Math.floor(Math.random() * 3) + 1; // 1-3 slots
    for (let i = 0; i < afternoonSlots; i++) {
      const slotStart = new Date(date);
      slotStart.setHours(13 + i, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);

      const rand = Math.random();
      let status = SlotStatus.AVAILABLE;
      if (rand > 0.8) status = SlotStatus.BOOKED;
      else if (rand > 0.95) status = SlotStatus.CANCELLED;

      schedules.push({
        doctorId,
        startTime: slotStart,
        endTime: slotEnd,
        status,
      });
    }
  }

  return schedules;
}

async function main() {
  console.log('🌱 Seeding database with comprehensive doctor data...');

  // Hash password for all test users
  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@doctorapp.com' },
    update: {},
    create: {
      email: 'admin@doctorapp.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      name: 'System Admin',
      userType: UserType.ADMIN,
      emailVerified: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create staff user
  const staff = await prisma.user.upsert({
    where: { email: 'staff@doctorapp.com' },
    update: {},
    create: {
      email: 'staff@doctorapp.com',
      passwordHash,
      firstName: 'Front',
      lastName: 'Desk',
      name: 'Front Desk',
      userType: UserType.STAFF,
      emailVerified: true,
    },
  });
  console.log('✅ Created staff user:', staff.email);

  // Create patient users
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient1@doctorapp.com' },
    update: {},
    create: {
      email: 'patient1@doctorapp.com',
      passwordHash,
      firstName: 'Alice',
      lastName: 'Johnson',
      name: 'Alice Johnson',
      userType: UserType.PATIENT,
      emailVerified: true,
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patient1.id },
    update: {},
    create: {
      userId: patient1.id,
      dob: new Date('1990-05-15'),
      gender: Gender.FEMALE,
      address: '123 Main St, City, State 12345',
      emergencyContact: 'Bob Johnson - 555-0101',
    },
  });
  console.log('✅ Created patient:', patient1.email);

  const patient2 = await prisma.user.upsert({
    where: { email: 'patient2@doctorapp.com' },
    update: {},
    create: {
      email: 'patient2@doctorapp.com',
      passwordHash,
      firstName: 'Robert',
      lastName: 'Williams',
      name: 'Robert Williams',
      userType: UserType.PATIENT,
      emailVerified: true,
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patient2.id },
    update: {},
    create: {
      userId: patient2.id,
      dob: new Date('1985-08-22'),
      gender: Gender.MALE,
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: 'Mary Williams - 555-0102',
    },
  });
  console.log('✅ Created patient:', patient2.email);

  // Create doctors with profiles and schedules
  console.log('\n📋 Creating doctors...');
  let doctorCount = 0;

  for (const doctorData of doctorsData) {
    // Create user
    const user = await prisma.user.upsert({
      where: { email: doctorData.email },
      update: {},
      create: {
        email: doctorData.email,
        passwordHash,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        name: `${doctorData.firstName} ${doctorData.lastName}`,
        userType: UserType.DOCTOR,
        emailVerified: true,
      },
    });

    // Create doctor profile
    const doctorProfile = await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialty: doctorData.specialty,
        designation: doctorData.designation,
        licenseNo: doctorData.licenseNo,
        bio: doctorData.bio,
        fee: doctorData.fee,
        isVerified: true,
      },
    });

    // Generate schedules for next 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    const schedules = generateSchedules(doctorProfile.id, startDate, 30);

    // Create schedules in batches
    for (const schedule of schedules) {
      await prisma.schedule.create({
        data: schedule,
      });
    }

    doctorCount++;
    console.log(
      `  ✅ Created Dr. ${doctorData.firstName} ${doctorData.lastName} (${doctorData.specialty}) - ${schedules.length} slots`
    );
  }

  console.log(`\n✅ Created ${doctorCount} doctors with schedules`);

  // Create a few appointments for testing
  console.log('\n📅 Creating sample appointments...');
  const doctors = await prisma.doctorProfile.findMany({
    take: 5,
    include: {
      schedules: {
        where: { status: SlotStatus.AVAILABLE },
        take: 2,
      },
    },
  });

  let appointmentCount = 0;
  for (const doctor of doctors) {
    for (const schedule of doctor.schedules) {
      // Randomly book some slots for patient1 or patient2
      if (Math.random() > 0.5) {
        const patient = Math.random() > 0.5 ? patient1 : patient2;
        await prisma.appointment.create({
          data: {
            patientId: patient.id,
            doctorId: doctor.userId,
            slotId: schedule.id,
            status: AppointmentStatus.SCHEDULED,
            symptoms: 'Follow-up consultation',
            notes: 'Regular checkup',
            paymentStatus: PaymentStatus.PENDING,
            consultationType:
              Math.random() > 0.5 ? ConsultationType.IN_PERSON : ConsultationType.VIDEO,
          },
        });

        // Update slot status to BOOKED
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { status: SlotStatus.BOOKED },
        });

        appointmentCount++;
      }
    }
  }

  console.log(`✅ Created ${appointmentCount} sample appointments`);

  console.log('\n🎉 Seeding completed!');
  console.log('');
  console.log('Test accounts (password: Password123!):');
  console.log('  Admin:    admin@doctorapp.com');
  console.log('  Staff:    staff@doctorapp.com');
  console.log('  Patients: patient1@doctorapp.com, patient2@doctorapp.com');
  console.log('');
  console.log('Doctors created:');
  for (const d of doctorsData) {
    console.log(`  Dr. ${d.firstName} ${d.lastName} - ${d.specialty} (${d.clinic}) - $${d.fee}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
