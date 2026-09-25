'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout';
import { UserType } from '@doctor-appointment-app/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Stethoscope, Calendar, Settings, Shield, TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.ADMIN]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-body-md text-muted-foreground">System overview and administration</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+23 this month</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Doctors</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">12 on duty today</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,834</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card className="medical-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,500</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & System Health */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/admin/users" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Manage Users</span>
                </a>
                <a href="/admin/doctors" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Doctor Management</span>
                </a>
                <a href="/admin/appointments" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>All Appointments</span>
                </a>
                <a href="/admin/audit-logs" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Audit Logs</span>
                </a>
                <a href="/admin/settings" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>System Settings</span>
                </a>
                <a href="/admin/analytics" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>System Analytics</span>
                </a>
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">API Server</p>
                      <p className="text-sm text-muted-foreground">Healthy</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Redis Cache</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Email Service</p>
                      <p className="text-sm text-muted-foreground">Healthy</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Operational</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Growth & Revenue */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>User Growth (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                    { month: 'Oct', users: 890 },
                    { month: 'Nov', users: 945 },
                    { month: 'Dec', users: 1020 },
                    { month: 'Jan', users: 1100 },
                    { month: 'Feb', users: 1180 },
                    { month: 'Mar', users: 1247 },
                  ].map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${(item.users / 1300) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">{item.users}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="medical-card-hover">
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                    { dept: 'Cardiology', revenue: 28500 },
                    { dept: 'Dermatology', revenue: 19200 },
                    { dept: 'Pediatrics', revenue: 15800 },
                    { dept: 'Orthopedics', revenue: 22100 },
                    { dept: 'Neurology', revenue: 14500 },
                    { dept: 'Other', revenue: 24400 },
                  ].map((item) => (
                    <div key={item.dept} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.dept}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${(item.revenue / 28500) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">${item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}