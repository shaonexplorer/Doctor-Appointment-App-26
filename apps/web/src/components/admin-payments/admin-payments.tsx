'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, CreditCard, RefreshCw, Search, X } from 'lucide-react';
import type { PaymentStatus } from '@doctor-appointment-app/shared';
import {
  usePayments,
  useUpdatePaymentStatus,
  useInitiateRefund,
  type RefundInput,
  transformAppointmentsToPaymentFormat,
  getPaymentStatusBadgeTone,
  getPaymentStatusLabel,
  type AdminPaymentData,
} from '@/hooks/usePayments';
import { DataTable } from '@/components/admin-users/data-table';
import { createPaymentColumns } from './columns';
import type { ColumnFiltersState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toast';

const paymentStatuses = ['All statuses', 'PENDING', 'PAID', 'REFUNDED'] as const;
const consultationTypes = ['All types', 'IN_PERSON', 'VIDEO', 'PHONE'] as const;

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
        tone === 'emerald'
          ? 'bg-emerald/50 text-emerald-700'
          : tone === 'rose'
            ? 'bg-rose/50 text-rose-700'
            : tone === 'amber'
              ? 'bg-amber/50 text-amber-700'
              : 'bg-primary/30 text-primary'
      }`}
    >
      {children}
    </span>
  );
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No-show',
  };
  return labels[status] || status;
}

export function AdminPayments() {
  const [paymentStatus, setPaymentStatus] = useState<(typeof paymentStatuses)[number]>(
    paymentStatuses[0]
  );
  const [drawer, setDrawer] = useState<AdminPaymentData | null>(null);
  const [drawerMode, setDrawerMode] = useState<'details' | 'update' | 'refund'>('details');
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [consultationType, setConsultationType] = useState<(typeof consultationTypes)[number]>(
    consultationTypes[0]
  );
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Refund form state
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] =
    useState<RefundInput['reason']>('CANCELLATION_BY_PATIENT');
  const [refundNotes, setRefundNotes] = useState('');

  // Fetch payments from API (Admin/Staff see all system-wide appointments)
  const {
    data: paymentsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePayments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    dateFrom,
    dateTo,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    // Column filters are passed as individual query params
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  });

  const payments = paymentsResponse?.data || [];
  const totalPayments = paymentsResponse?.meta.total || 0;

  // Transform API data to admin payment format
  const transformedPayments = useMemo(
    () => transformAppointmentsToPaymentFormat(payments),
    [payments]
  );

  // Apply filters client-side (payment status and consultation type)
  const filteredPayments = useMemo(() => {
    return transformedPayments.filter((payment) => {
      if (paymentStatus !== 'All statuses' && payment.paymentStatus !== paymentStatus) {
        return false;
      }
      if (consultationType !== 'All types' && payment.consultationType !== consultationType) {
        return false;
      }
      return true;
    });
  }, [transformedPayments, paymentStatus, consultationType]);

  // Summary totals for the current filter set (spec 5.3 billing overview)
  const summary = useMemo(() => {
    const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paid = filteredPayments
      .filter((p) => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + p.amountPaid, 0);
    const pending = filteredPayments
      .filter((p) => p.paymentStatus === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);
    const refunded = filteredPayments
      .filter((p) => p.paymentStatus === 'REFUNDED')
      .reduce((sum, p) => sum + p.amountRefunded, 0);
    return { total, paid, pending, refunded };
  }, [filteredPayments]);

  const updatePaymentStatus = useUpdatePaymentStatus();
  const initiateRefund = useInitiateRefund();

  const columns = createPaymentColumns({
    onViewPayment: (payment: AdminPaymentData) => {
      setDrawer(payment);
      setDrawerMode('details');
    },
    onUpdatePaymentStatus: (payment: AdminPaymentData) => {
      setDrawer(payment);
      setDrawerMode('update');
    },
    onInitiateRefund: (payment: AdminPaymentData) => {
      setDrawer(payment);
      setDrawerMode('refund');
      setRefundAmount('');
      setRefundReason('CANCELLATION_BY_PATIENT');
      setRefundNotes('');
    },
  });

  const handleUpdateStatus = async () => {
    if (!drawer) return;
    try {
      await updatePaymentStatus.mutateAsync({
        id: drawer.id,
        paymentStatus: drawer.paymentStatus,
      });
      setDrawerMode('details');
      void refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to update payment status:', error);
    }
  };

  const handleRefund = async () => {
    if (!drawer) return;
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0 || amount > drawer.amount) {
      window.alert('Refund amount must be greater than 0 and no more than the appointment total.');
      return;
    }
    try {
      await initiateRefund.mutateAsync({
        appointmentId: drawer.id,
        amount,
        reason: refundReason,
        notes: refundNotes || null,
      });
      setDrawer(null);
      void refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to initiate refund:', error);
    }
  };

  return (
    <div className="mt-8 space-y-5">
      {/* Summary bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-[11px] font-semibold">Total billed</p>
          <p className="text-foreground mt-2 text-xl font-black tabular-nums">
            {formatMoney(summary.total)}
          </p>
        </div>
        <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-[11px] font-semibold">Collected (paid)</p>
          <p className="text-foreground mt-2 text-xl font-black tabular-nums">
            {formatMoney(summary.paid)}
          </p>
        </div>
        <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-[11px] font-semibold">Pending</p>
          <p className="text-foreground mt-2 text-xl font-black tabular-nums">
            {formatMoney(summary.pending)}
          </p>
        </div>
        <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-[11px] font-semibold">Refunded</p>
          <p className="text-foreground mt-2 text-xl font-black tabular-nums">
            {formatMoney(summary.refunded)}
          </p>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative min-w-[200px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Search payments"
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              placeholder="Search by patient or doctor..."
              className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 pl-9 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
            <Select
              aria-label="Filter by payment status"
              value={paymentStatus}
              onValueChange={(value) => {
                setPaymentStatus(value as (typeof paymentStatuses)[number]);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-10 w-full min-w-[160px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              aria-label="Filter by appointment type"
              value={consultationType}
              onValueChange={(value) => {
                setConsultationType(value as (typeof consultationTypes)[number]);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-10 w-full min-w-[160px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-[10px] font-bold uppercase">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-9 w-full text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-[10px] font-bold uppercase">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-9 w-full text-xs"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setGlobalFilter('');
            setDateFrom('');
            setDateTo('');
            setPaymentStatus('All statuses');
            setConsultationType('All types');
            setPagination({ pageIndex: 0, pageSize: 20 });
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="size-4" /> Reset filters
        </Button>
      </div>

      {/* Payments Table - Using TanStack Table v9 with shadcn/ui */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredPayments}
          rowCount={totalPayments}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          isLoading={isLoading && payments.length === 0}
          showColumnVisibility={true}
          className="p-4"
        />

        {/* Error state */}
        {isError && payments.length === 0 && (
          <div className="text-destructive flex items-center justify-center p-12">
            <p>
              Failed to load payments: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button onClick={() => refetch()} className="text-primary ml-3 text-sm hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Payment Detail / Billing Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="bg-card/30 absolute inset-0" onClick={() => setDrawer(null)} />
          <aside className="bg-card absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setDrawer(null)}
              aria-label="Close payment details"
              className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>

            {drawerMode === 'details' && (
              <div className="mt-8">
                <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl text-xl font-bold">
                  {drawer.patientInitials}
                </div>
                <h2 className="mt-4 text-xl font-black">{drawer.patientName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  #{drawer.patientId} · {drawer.patientEmail}
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge>{statusLabel(drawer.status)}</Badge>
                  <Badge tone={getPaymentStatusBadgeTone(drawer.paymentStatus)}>
                    {getPaymentStatusLabel(drawer.paymentStatus)}
                  </Badge>
                </div>

                {/* Billing information (spec 5.3) */}
                <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-primary size-4" />
                    <h2 className="text-sm font-bold">Billing information</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase">Total</p>
                      <p className="text-foreground tabular-nums">{formatMoney(drawer.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase">
                        Amount paid
                      </p>
                      <p className="text-foreground tabular-nums">
                        {formatMoney(drawer.amountPaid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase">
                        Amount refunded
                      </p>
                      <p className="text-foreground tabular-nums">
                        {formatMoney(drawer.amountRefunded)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase">
                        Payment method
                      </p>
                      <p className="text-foreground">•••• •••• •••• {drawer.id.slice(-4)}</p>
                    </div>
                  </div>
                  <p>
                    <strong>Billing date</strong>
                    <br />
                    <span className="text-slate-500">{drawer.created}</span>
                  </p>
                </div>

                {/* Appointment details */}
                <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                  <h2 className="text-sm font-bold">Appointment details</h2>
                  <p>
                    <strong>Doctor</strong>
                    <br />
                    <span className="text-slate-500">{drawer.doctorName}</span>
                  </p>
                  <p>
                    <strong>Specialty</strong>
                    <br />
                    <span className="text-slate-500">{drawer.specialty}</span>
                  </p>
                  <p>
                    <strong>Clinic</strong>
                    <br />
                    <span className="text-slate-500">{drawer.clinic}</span>
                  </p>
                  <p>
                    <strong>Date &amp; time</strong>
                    <br />
                    <span className="text-slate-500">
                      {drawer.date} at {drawer.time}
                    </span>
                  </p>
                  <p>
                    <strong>Consultation type</strong>
                    <br />
                    <span className="text-slate-500">
                      {drawer.consultationType.replace('_', ' ')}
                    </span>
                  </p>
                  {drawer.raw.symptoms && (
                    <p>
                      <strong>Symptoms</strong>
                      <br />
                      <span className="text-slate-500">{drawer.raw.symptoms}</span>
                    </p>
                  )}
                  {drawer.raw.notes && (
                    <p>
                      <strong>Notes</strong>
                      <br />
                      <span className="text-slate-500">{drawer.raw.notes}</span>
                    </p>
                  )}
                </div>

                <Separator className="mt-6" />
                <div className="mt-6 grid gap-2">
                  {drawer.paymentStatus !== 'PAID' && (
                    <button
                      onClick={() => setDrawerMode('update')}
                      className="rounded-xl border px-4 py-3 text-sm font-bold"
                    >
                      Update payment status
                    </button>
                  )}
                  {drawer.paymentStatus === 'PAID' && (
                    <button
                      onClick={() => setDrawerMode('refund')}
                      className="border-destructive text-destructive rounded-xl border px-4 py-3 text-sm font-bold"
                    >
                      Initiate refund
                    </button>
                  )}
                </div>
              </div>
            )}

            {drawerMode === 'update' && (
              <div className="mt-8">
                <button
                  onClick={() => setDrawerMode('details')}
                  className="hover:text-primary flex items-center gap-1 text-sm font-medium text-slate-500"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
                <h2 className="mt-4 text-xl font-black">Update payment status</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Change the payment status for appointment #{drawer.id}
                </p>
                <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                  <Label htmlFor="new-payment-status">New payment status</Label>
                  <Select
                    value={drawer.paymentStatus}
                    onValueChange={(value) => {
                      setDrawer({
                        ...drawer,
                        paymentStatus: value as PaymentStatus,
                      });
                    }}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={getPaymentStatusLabel(drawer.paymentStatus)} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...paymentStatuses]
                        .filter((s) => s !== 'All statuses')
                        .map((s) => (
                          <SelectItem key={s} value={s}>
                            {getPaymentStatusLabel(s as PaymentStatus)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-6 grid gap-2">
                  <button
                    onClick={() => setDrawerMode('details')}
                    className="rounded-xl border px-4 py-3 text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatePaymentStatus.isPending}
                    className="bg-primary rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {updatePaymentStatus.isPending ? 'Updating...' : 'Update status'}
                  </button>
                </div>
              </div>
            )}

            {drawerMode === 'refund' && (
              <div className="mt-8">
                <button
                  onClick={() => setDrawerMode('details')}
                  className="hover:text-primary flex items-center gap-1 text-sm font-medium text-slate-500"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
                <h2 className="mt-4 text-xl font-black">Initiate refund</h2>
                <p className="mt-1 text-sm text-slate-500">Refund for appointment #{drawer.id}</p>
                <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                  <div>
                    <Label htmlFor="refund-amount">Refund amount</Label>
                    <p className="text-muted-foreground text-[10px]">
                      Maximum refundable: {formatMoney(drawer.amount)}
                    </p>
                    <Input
                      id="refund-amount"
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="refund-reason">Reason</Label>
                    <Select
                      value={refundReason}
                      onValueChange={(value) => setRefundReason(value as RefundInput['reason'])}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CANCELLATION_BY_PATIENT">
                          Cancellation by patient
                        </SelectItem>
                        <SelectItem value="CANCELLATION_BY_DOCTOR">
                          Cancellation by doctor
                        </SelectItem>
                        <SelectItem value="INSURANCE">Insurance</SelectItem>
                        <SelectItem value="PATIENT_REQUEST">Patient request</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="refund-notes">Processing notes (optional)</Label>
                    <Textarea
                      id="refund-notes"
                      value={refundNotes}
                      onChange={(e) => setRefundNotes(e.target.value)}
                      rows={3}
                      className="h-24"
                    />
                  </div>
                </div>
                <div className="mt-6 grid gap-2">
                  <button
                    onClick={() => setDrawerMode('details')}
                    className="rounded-xl border px-4 py-3 text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={initiateRefund.isPending || !refundReason || !refundAmount}
                    className="bg-destructive rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {initiateRefund.isPending ? 'Processing...' : 'Initiate refund'}
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AdminPayments;
