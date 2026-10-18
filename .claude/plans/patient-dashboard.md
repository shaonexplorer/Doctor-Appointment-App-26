# Patient Dashboard — Replace Hardcoded Data with Real Data

## Current state (analyzed)

`apps/web/src/app/patient/dashboard/page.tsx` is a client page that uses entirely hardcoded mock data:
- `specialtyData`, `expenseData`, `timeline`, `prescriptions`, `quickActions` arrays
- Fake "Next appointment" (Dr. Michael Anderson, fixed date/time)
- `reload` is a `setTimeout` fake — no real refetch
- All button actions are no-ops (`action()` either navigates generically or sets a notice)
- Loading state shows 4 skeleton boxes only; no error state; empty state components (`EmptyDashboardState`, `DashboardErrorState`) exist in `@/components/patient-dashboard` but are not wired

## Backend contract (already implemented — no API changes needed)

- `GET /api/appointments/stats/dashboard` → `PatientDashboardStats`: `upcomingAppointments`, `totalAppointments`, `totalExpenses`, `prescriptionCompliance`, `nextAppointment {id, doctor{firstName,lastName}, doctorProfile{specialty,clinic}, slot{startTime,endTime}, consultationType, status, paymentStatus, symptoms}`, `appointmentsByStatus`, `appointmentsBySpecialty`, `monthlyExpenses`
- `GET /api/appointments/timeline/upcoming?limit=` → upcoming appointments (`useUpcomingAppointments`)
- `GET /api/appointments/timeline/completed?limit=` → completed appointments incl. prescriptions (`useCompletedAppointments`)
- `DELETE /api/appointments/:id` → cancel (`appointmentApi.cancelAppointment`)
- `GET /api/prescriptions/:id/pdf` → PDF blob (`prescriptionApi.downloadPrescriptionPDF`)

## Reusable components already available (no new components to build)

- `Metric`, `Panel`, `Detail`, `Reminder`, `Action`, `SpecialtyPieChart`, `MonthlyExpensesBarChart` (`@/components/patient-dashboard`)
- `EmptyDashboardState`, `DashboardErrorState` (`@/components/patient-dashboard`) — already exist, unused
- `AppointmentDrawer`, `CancelModal`, `RescheduleFlow` (`@/components/appointments`)
- Hooks: `useDashboardStats`, `useUpcomingAppointments`, `useCompletedAppointments` (`@/hooks/useAppointments`)

## Implementation status: COMPLETE

All 11 items implemented in `apps/web/src/app/patient/dashboard/page.tsx`.

## Verification results

- `npm run typecheck --workspace=@doctor-appointment-app/web` → ✅ passes
- `npx eslint apps/web/src/app/patient/dashboard/page.tsx` → ✅ no errors
- `npx prettier --write apps/web/src/app/patient/dashboard/page.tsx` → ✅ formatted
- `npm run build --workspace=@doctor-appointment-app/web` → ✅ production build succeeds
