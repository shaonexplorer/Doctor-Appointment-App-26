/**
 * Prisma Seed Script
 * Creates initial data for development
 */

import { PrismaClient, UserType, SlotStatus, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
      userType: UserType.STAFF,
      emailVerified: true,
    },
  });
  console.log('✅ Created staff user:', staff.email);

  // Create doctor users
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@doctorapp.com' },
    update: {},
    create: {
      email: 'dr.smith@doctorapp.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Smith',
      userType: UserType.DOCTOR,
      emailVerified: true,
    },
  });

  const doctorProfile1 = await prisma.doctorProfile.upsert({
    where: { userId: doctor1.id },
    update: {},
    create: {
      userId: doctor1.id,
      specialty: 'Cardiology',
      designation: 'MD, FACC',
      licenseNo: 'MD123456',
      bio: 'Experienced cardiologist with 15+ years in practice.',
      fee: 200.0,
    },
  });
  console.log('✅ Created doctor:', doctor1.email);

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.jones@doctorapp.com' },
    update: {},
    create: {
      email: 'dr.jones@doctorapp.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jones',
      userType: UserType.DOCTOR,
      emailVerified: true,
    },
  });

  const doctorProfile2 = await prisma.doctorProfile.upsert({
    where: { userId: doctor2.id },
    update: {},
    create: {
      userId: doctor2.id,
      specialty: 'Dermatology',
      designation: 'MD, FAAD',
      licenseNo: 'MD789012',
      bio: 'Board-certified dermatologist specializing in medical and cosmetic dermatology.',
      fee: 150.0,
    },
  });
  console.log('✅ Created doctor:', doctor2.email);

  // Create patient users
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient1@doctorapp.com' },
    update: {},
    create: {
      email: 'patient1@doctorapp.com',
      passwordHash,
      firstName: 'Alice',
      lastName: 'Johnson',
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

  // Create sample schedules for doctors
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(9, 0, 0, 0);

  // Create slots for doctor 1
  for (let i = 0; i < 8; i++) {
    const slotStart = new Date(tomorrow);
    slotStart.setHours(9 + i, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1);

    await prisma.schedule.upsert({
      where: {
        id: `slot-doctor1-${i}`, // This won't work for upsert, we'll use create with unique constraint
      },
      update: {},
      create: {
        doctorId: doctorProfile1.id,
        startTime: slotStart,
        endTime: slotEnd,
        status: SlotStatus.AVAILABLE,
      },
    });
  }

  // Create slots for doctor 2
  for (let i = 0; i < 6; i++) {
    const slotStart = new Date(dayAfterTomorrow);
    slotStart.setHours(10 + i, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1);

    await prisma.schedule.create({
      data: {
        doctorId: doctorProfile2.id,
        startTime: slotStart,
        endTime: slotEnd,
        status: SlotStatus.AVAILABLE,
      },
    });
  }

  console.log('✅ Created sample schedules');

  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('Test accounts (password: Password123!):');
  console.log('  Admin:    admin@doctorapp.com');
  console.log('  Staff:    staff@doctorapp.com');
  console.log('  Doctor 1: dr.smith@doctorapp.com (Cardiology)');
  console.log('  Doctor 2: dr.jones@doctorapp.com (Dermatology)');
  console.log('  Patient 1: patient1@doctorapp.com');
  console.log('  Patient 2: patient2@doctorapp.com');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
