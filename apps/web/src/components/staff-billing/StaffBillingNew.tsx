'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const transactions = [
  {
    id: 'TXN-2026-00981',
    patient: 'Sarah Johnson',
    doctor: 'Dr. Michael Anderson',
    appointment: 'APT-2026-004821',
    amount: '$120.00',
    status: 'PAID',
    date: 'Sep 21, 2026 &middot; 09:30 AM',
  },
];

type Transaction = (typeof transactions)[number];

export function StaffBilling() {
  const [query, _setQuery] = useState('');
  const [status, _setStatus] = useState('All statuses');
  const [_selected, _setSelected] = useState<Transaction | null>(null);
  const [_notice, _setNotice] = useState('');
  const filtered = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          `${tx.id} ${tx.patient} ${tx.doctor}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All statuses' || tx.status === status)
      ),
    [query, status]
  );

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            <tr>
              {[
                'Transaction ID',
                'Patient',
                'Doctor',
                'Appointment',
                'Amount',
                'Payment status',
                'Date',
                'Actions',
              ].map((h) => (
                <th key={h} className="px-5 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {filtered.map((tx) => (
              <TestRow key={tx.id} tx={tx} onView={() => {}} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TestRowProps {
  tx: Transaction;
  onView: () => void;
}

function TestRow({ tx, onView }: TestRowProps) {
  return (
    <tr className="hover:bg-secondary/30">
      <td className="text-primary px-5 py-4 text-xs font-bold">{tx.id}</td>
      <td className="px-5 py-4 font-bold">{tx.patient}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{tx.doctor}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{tx.appointment}</td>
      <td className="px-5 py-4 font-black">{tx.amount}</td>
      <td className="px-5 py-4">
        <StatusBadge status={tx.status} />
      </td>
      <td className="text-muted-foreground px-5 py-4 text-xs whitespace-nowrap">{tx.date}</td>
      <td className="px-5 py-4">
        <Button variant="outline" size="xs" onClick={onView}>
          View
        </Button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
        status === 'PAID' ? 'bg-[#e9f8f3] text-[#258c70]' : status === 'PENDING' ? 'bg-[#fff3e7] text-[#b8742c]' : 'bg-[#fff0ef] text-[#bd6c63]'
      }`}
    >
      {status}
    </span>
  );
}
