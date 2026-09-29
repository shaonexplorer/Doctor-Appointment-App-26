'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { UserType } from '@doctor-appointment-app/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, Users, ClipboardList, Settings, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StaffDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.STAFF]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">Staff Dashboard</h1>
              <p className="text-body-md text-muted-foreground">Manage clinic operations and appointments</p>
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
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Across all doctors</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Confirmations</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Require action</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Doctors</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">On duty today</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Today's Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/staff/appointments" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Manage Appointments</span>
                </a>
                <a href="/staff/doctors" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Doctor Schedule</span>
                </a>
                <a href="/staff/patients" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Patient Records</span>
                </a>
                <a href="/staff/checkin" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <span>Patient Check-in</span>
                </a>
                <a href="/settings" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Clinic Settings</span>
                </a>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Today's Appointments Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. Emily Carter - Cardiology</p>
                    <p className="text-sm text-muted-foreground">8 appointments · 9:00 AM - 4:00 PM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">On Schedule</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. James Wilson - Dermatology</p>
                    <p className="text-sm text-muted-foreground">6 appointments · 10:00 AM - 3:00 PM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">On Schedule</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. Sarah Chen - Pediatrics</p>
                    <p className="text-sm text-muted-foreground">4 appointments · 1:00 PM - 5:00 PM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">2 Slots Open</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. Michael Brown - Orthopedics</p>
                    <p className="text-sm text-muted-foreground">6 appointments · 8:00 AM - 2:00 PM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">On Schedule</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="medical-card-hover">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Appointment confirmed for John Smith with Dr. Carter</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">New patient registration: Maria Garcia</p>
                  <p className="text-sm text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Slot conflict detected for Dr. Wilson at 2:00 PM</p>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Prescription ready for pickup: Robert Johnson</p>
                  <p className="text-sm text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}