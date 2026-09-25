'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { UserType } from '@doctor-appointment-app/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, ClipboardList, Users, CreditCard } from 'lucide-react';

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-body-md text-muted-foreground">Manage your healthcare appointments and records</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next: Tomorrow 10:30 AM</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">All time appointments</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Prescriptions</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Requires refill: 1</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/appointments/new" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Book Appointment</span>
                </a>
                <a href="/doctors" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Find a Doctor</span>
                </a>
                <a href="/prescriptions" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <span>View Prescriptions</span>
                </a>
                <a href="/profile" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Update Profile</span>
                </a>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. Emily Carter</p>
                    <p className="text-sm text-muted-foreground">Cardiology · Video Visit</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tomorrow, 10:30 AM</p>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Confirmed</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. James Wilson</p>
                    <p className="text-sm text-muted-foreground">Dermatology · In Person</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Mar 15, 2024</p>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Completed</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Pediatrics · In Person</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Mar 8, 2024</p>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Cancelled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Insights */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Appointments by Specialty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cardiology</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dermatology</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pediatrics</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Other</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: 'Jan', amount: 120 },
                    { month: 'Feb', amount: 80 },
                    { month: 'Mar', amount: 200 },
                    { month: 'Apr', amount: 150 },
                    { month: 'May', amount: 90 },
                    { month: 'Jun', amount: 300 },
                  ].map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${(item.amount / 300) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">${item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}