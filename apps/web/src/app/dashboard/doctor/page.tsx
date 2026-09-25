'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { UserType } from '@doctor-appointment-app/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Calendar, ClipboardList, Users, TrendingUp, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-body-md text-muted-foreground">Manage your practice, schedule, and patients</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next: 9:00 AM</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Appointments</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Slot Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">13 slots available</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Today's Schedule */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/doctor/schedule/create" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Add Time Slots</span>
                </a>
                <a href="/doctor/schedule/bulk" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Bulk Create Slots</span>
                </a>
                <a href="/doctor/appointments" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <span>View Appointments</span>
                </a>
                <a href="/doctor/patients" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Patient List</span>
                </a>
                <a href="/doctor/analytics" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>View Analytics</span>
                </a>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">John Smith</p>
                    <p className="text-sm text-muted-foreground">Follow-up · 9:00 AM - 9:30 AM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">In Progress</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Maria Garcia</p>
                    <p className="text-sm text-muted-foreground">New Patient · 10:00 AM - 10:30 AM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Scheduled</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">Consultation · 11:00 AM - 11:30 AM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Scheduled</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Sarah Williams</p>
                    <p className="text-sm text-muted-foreground">Follow-up · 2:00 PM - 2:30 PM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Pending</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Consultation Type & Weekly Volume */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Revenue by Consultation Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">In-Person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium">$7,200</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-muted-foreground">Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/5 bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-sm font-medium">$3,800</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-muted-foreground">Phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/5 bg-amber-500 rounded-full" />
                    </div>
                    <span className="text-sm font-medium">$1,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Weekly Appointment Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: 'Mon', count: 8 },
                    { day: 'Tue', count: 6 },
                    { day: 'Wed', count: 9 },
                    { day: 'Thu', count: 7 },
                    { day: 'Fri', count: 10 },
                    { day: 'Sat', count: 4 },
                    { day: 'Sun', count: 0 },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground w-10">{item.day}</span>
                      <div className="flex-1 mx-4 h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div className={`h-full bg-primary rounded-full`} style={{ width: `${(item.count / 10) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{item.count}</span>
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