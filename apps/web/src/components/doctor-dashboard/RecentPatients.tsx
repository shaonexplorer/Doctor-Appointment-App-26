'use client';

export interface RecentPatient {
  patient: string;
  visit: string;
  diagnosis: string;
  appointment: string;
  initials: string;
}

export interface RecentPatientsProps {
  patients: RecentPatient[];
  onAction?: (action: string, patient: string) => void;
  onViewAll?: () => void;
}

export function RecentPatients({ patients, onAction, onViewAll }: RecentPatientsProps) {
  const handleAction = (action: string, patient: string) => {
    onAction?.(action, patient);
  };

  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Recent patients</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Patients seen recently in your clinic
          </p>
        </div>
        <button onClick={onViewAll} className="text-primary text-xs font-bold hover:underline">
          View all patients
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-[10px] tracking-wider uppercase">
              <th className="pb-3">Patient</th>
              <th className="pb-3">Last visit</th>
              <th className="pb-3">Diagnosis</th>
              <th className="pb-3">Appointment</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((item) => (
              <tr key={item.patient} className="border-border/70 border-b last:border-0">
                <td className="flex items-center gap-3 py-4">
                  <span className="text-primary grid size-8 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
                    {item.initials}
                  </span>
                  <span className="font-bold">{item.patient}</span>
                </td>
                <td className="text-muted-foreground py-4">{item.visit}</td>
                <td className="py-4">{item.diagnosis}</td>
                <td className="text-muted-foreground py-4">{item.appointment}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleAction('View record', item.patient)}
                    className="text-primary hover:bg-primary/10 rounded-lg px-3 py-1.5 text-xs font-bold"
                  >
                    View record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
