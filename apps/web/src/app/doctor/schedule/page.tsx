import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { ScheduleGrid } from '@/components/doctor-schedule';

export default function DoctorSchedulePage() {
  // Mock data - in a real implementation, this would come from hooks/API
  const slots: Array<{
    time: string;
    patient: string;
    state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  }> = [
    { time: '7:00 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '7:20 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '7:40 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '8:00 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '8:20 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '8:40 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '9:00 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '9:20 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '9:40 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '10:00 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '10:20 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '10:40 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '11:00 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '11:20 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '11:40 AM', patient: 'Available', state: 'AVAILABLE' },
    { time: '12:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '12:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '12:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '1:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '1:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '1:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '2:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '2:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '2:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '3:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '3:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '3:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '4:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '4:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '4:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '5:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '5:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '5:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '6:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '6:20 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '6:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '7:00 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '7:20 PM', patient: 'Sarah Johnson', state: 'BOOKED' },
    { time: '7:40 PM', patient: 'Available', state: 'AVAILABLE' },
    { time: '8:00 PM', patient: 'Robert Chen', state: 'BOOKED' },
    { time: '8:20 PM', patient: 'Cancelled by patient', state: 'CANCELLED' },
    { time: '8:40 PM', patient: 'Available', state: 'AVAILABLE' },
  ];

  const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];

  return (
    <DoctorPortalShell active="Schedule">
      <ScheduleGrid slots={slots} days={days} />
    </DoctorPortalShell>
  );
}
