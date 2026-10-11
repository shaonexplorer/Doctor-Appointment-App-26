'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Check, Download, FileText, Printer, Receipt, Search, X } from 'lucide-react';

const transactions = [
  {
    id: 'TXN-2026-00981',
    patient: 'Sarah Johnson',
    doctor: 'Dr. Michael Anderson',
    appointment: 'APT-2026-004821',
    amount: '$120.00',
    status: 'PAID',
    date: 'Sep 21, 2026 · 09:30 AM',
  },
  {
    id: 'TXN-2026-00982',
    patient: 'Robert Williams',
    doctor: 'Dr. Emily Carter',
    appointment: 'APT-2026-004822',
    amount: '$85.00',
    status: 'PENDING',
    date: 'Sep 21, 2026 · 10:00 AM',
  },
  {
    id: 'TXN-2026-00983',
    patient: 'Jessica Brown',
    doctor: 'Dr. Michael Anderson',
    appointment: 'APT-2026-004823',
    amount: '$120.00',
    status: 'PAID',
    date: 'Sep 21, 2026 · 10:30 AM',
  },
  {
    id: 'TXN-2026-00974',
    patient: 'David Miller',
    doctor: 'Dr. James Wilson',
    appointment: 'APT-2026-004810',
    amount: '$95.00',
    status: 'REFUNDED',
    date: 'Sep 20, 2026 · 11:00 AM',
  },
  {
    id: 'TXN-2026-00969',
    patient: 'Maria Garcia',
    doctor: 'Dr. Emily Carter',
    appointment: 'APT-2026-004805',
    amount: '$85.00',
    status: 'PENDING',
    date: 'Sep 20, 2026 · 11:30 AM',
  },
];

type Transaction = (typeof transactions)[number];

export function StaffBilling() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          `${tx.id} ${tx.patient} ${tx.doctor}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All statuses' || tx.status === status)
      ),
    [query, status]
  );
  const action = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 2500);
  };

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Today's revenue" value="$2,480" tone="bg-[#e9f8f3] text-[#258c70]" />
        <Metric label="Pending payments" value="$1,240" tone="bg-[#fff3e7] text-[#d68b42]" />
        <Metric label="Refunded payments" value="$285" tone="bg-[#fff0ef] text-[#c9776d]" />
        <Metric label="Total transactions" value="42" tone="bg-[#edf3ff] text-primary" />
      </div>
      <section className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold">Payment transactions</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {filtered.length} transactions match your filters
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => action('Transaction export prepared')}
              className="border-border hover:bg-secondary inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"
            >
              <Download className="size-3.5" />
              Export
            </button>
            <button
              onClick={() => action('Receipt printer ready')}
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:opacity-90"
            >
              <Printer className="size-3.5" />
              Print report
            </button>
          </div>
        </div>
        <div className="border-border flex flex-wrap gap-3 border-b p-4">
          <label className="relative min-w-[220px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search transactions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient, doctor, or transaction ID"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none focus:ring-2"
            />
          </label>
          <input
            aria-label="Start date"
            type="date"
            defaultValue="2026-09-01"
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs"
          />
          <input
            aria-label="End date"
            type="date"
            defaultValue="2026-09-21"
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs"
          />
          <select
            aria-label="Doctor filter"
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs"
          >
            <option>All doctors</option>
            <option>Dr. Michael Anderson</option>
            <option>Dr. Emily Carter</option>
          </select>
          <select
            aria-label="Payment status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs"
          >
            <option>All statuses</option>
            <option>PAID</option>
            <option>PENDING</option>
            <option>REFUNDED</option>
          </select>
        </div>
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
                <Row key={tx.id} tx={tx} onView={() => setSelected(tx)} onAction={action} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {filtered.map((tx) => (
            <div key={tx.id} className="border-border rounded-xl border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{tx.patient}</p>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    {tx.id} · {tx.date}
                  </p>
                </div>
                <Badge status={tx.status} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">{tx.doctor}</p>
                  <p className="mt-1 font-black">{tx.amount}</p>
                </div>
                <button
                  onClick={() => setSelected(tx)}
                  className="border-border rounded-lg border px-3 py-1.5 text-[11px] font-bold"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-12 text-center text-sm">
            No transactions match these filters.
          </div>
        )}
      </section>
      {selected && (
        <PaymentDrawer tx={selected} onClose={() => setSelected(null)} onAction={action} />
      )}
      {notice && (
        <div
          role="status"
          className="border-border bg-card fixed right-5 bottom-6 z-[70] flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
        >
          <Check className="text-primary size-4" />
          {notice}
        </div>
      )}
    </div>
  );
}

function Row({
  tx,
  onView,
  onAction,
}: {
  tx: Transaction;
  onView: () => void;
  onAction: (text: string) => void;
}) {
  return (
    <tr className="hover:bg-secondary/30">
      <td className="text-primary px-5 py-4 text-xs font-bold">{tx.id}</td>
      <td className="px-5 py-4 font-bold">{tx.patient}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{tx.doctor}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{tx.appointment}</td>
      <td className="px-5 py-4 font-black">{tx.amount}</td>
      <td className="px-5 py-4">
        <Badge status={tx.status} />
      </td>
      <td className="text-muted-foreground px-5 py-4 text-xs whitespace-nowrap">{tx.date}</td>
      <td className="px-5 py-4">
        <button
          onClick={onView}
          className="border-border hover:bg-secondary rounded-lg border px-3 py-1.5 text-[11px] font-bold"
        >
          View
        </button>
      </td>
    </tr>
  );
}
function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-lg px-2.5 py-1.5 text-lg font-black ${tone}`}>
        {value}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
function Badge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${status === 'PAID' ? 'bg-[#e9f8f3] text-[#258c70]' : status === 'PENDING' ? 'bg-[#fff3e7] text-[#b8742c]' : 'bg-[#fff0ef] text-[#bd6c63]'}`}
    >
      {status}
    </span>
  );
}
function PaymentDrawer({
  tx,
  onClose,
  onAction,
}: {
  tx: Transaction;
  onClose: () => void;
  onAction: (text: string) => void;
}) {
  return (
    <>
      <div className="bg-foreground/20 fixed inset-0 z-50" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-label="Payment details"
        className="border-border bg-card fixed inset-y-0 right-0 z-[60] flex w-full max-w-[480px] flex-col overflow-y-auto border-l shadow-2xl"
      >
        <div className="border-border flex items-center justify-between border-b p-5">
          <div>
            <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
              Payment detail
            </p>
            <h2 className="mt-1 text-lg font-black">{tx.id}</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-secondary rounded-lg p-2"
            aria-label="Close details"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="bg-secondary/60 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold">{tx.patient}</p>
                <p className="text-muted-foreground mt-1 text-xs">{tx.doctor}</p>
              </div>
              <Badge status={tx.status} />
            </div>
            <p className="mt-5 text-3xl font-black">{tx.amount}</p>
            <p className="text-muted-foreground mt-1 text-xs">{tx.date}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Appointment" value={tx.appointment} />
            <Info label="Payment method" value="Visa •••• 4242" />
            <Info label="Service" value="General consultation" />
            <Info label="Receipt number" value="RCP-2026-00981" />
          </div>
          <div className="border-border rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
                <Receipt className="size-5" />
              </div>
              <div>
                <p className="font-bold">Professional receipt</p>
                <p className="text-muted-foreground text-xs">MediBook Healthcare · Tax invoice</p>
              </div>
            </div>
            <div className="border-border mt-5 flex items-center justify-between border-t pt-4 text-sm">
              <span className="text-muted-foreground">Consultation fee</span>
              <strong>{tx.amount}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total paid</span>
              <strong className="text-primary">{tx.amount}</strong>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <button
              onClick={() =>
                onAction(
                  tx.status === 'PENDING' ? 'Payment marked as paid' : 'Payment already settled'
                )
              }
              className="bg-primary text-primary-foreground flex-1 rounded-xl px-4 py-3 text-xs font-bold"
            >
              Mark paid
            </button>
            <button
              onClick={() => onAction('Refund request created')}
              className="border-border hover:bg-secondary flex-1 rounded-xl border px-4 py-3 text-xs font-bold"
            >
              Issue refund
            </button>
            <button
              onClick={() => onAction('Receipt ready to print')}
              className="border-border hover:bg-secondary inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold"
            >
              <Printer className="size-4" />
              Print receipt
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}
function PlaceholderIcon() {
  return <FileText className="size-4" />;
}
void PlaceholderIcon;
