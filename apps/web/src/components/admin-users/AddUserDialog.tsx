'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateUser, type CreateUserInput } from '@/hooks/useUsers';

// Validation schema
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  userType: z.enum(['ADMIN', 'STAFF', 'DOCTOR', 'PATIENT']),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  // Doctor fields
  specialty: z.string().optional(),
  designation: z.string().optional(),
  licenseNo: z.string().optional(),
  bio: z.string().optional(),
  fee: z.number().optional(),
  // Patient fields
  dob: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
  const createUserMutation = useCreateUser();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema as any),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      userType: 'PATIENT',
      password: '',
      specialty: '',
      designation: '',
      licenseNo: '',
      bio: '',
      fee: undefined,
      dob: '',
      gender: '',
      address: '',
      emergencyContact: '',
    },
  });

  const userType = form.watch('userType');
  const isDoctor = userType === 'DOCTOR';
  const isPatient = userType === 'PATIENT';

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      // Transform form data to API format
      const apiData: CreateUserInput = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        userType: data.userType as CreateUserInput['userType'],
        password: data.password || undefined,
        specialty: isDoctor ? data.specialty : undefined,
        designation: isDoctor ? data.designation : undefined,
        licenseNo: isDoctor ? data.licenseNo : undefined,
        bio: isDoctor ? data.bio : undefined,
        fee: isDoctor && data.fee ? data.fee : undefined,
        dob: isPatient ? data.dob : undefined,
        gender: isPatient ? data.gender : undefined,
        address: isPatient ? data.address : undefined,
        emergencyContact: isPatient ? data.emergencyContact : undefined,
      };

      await createUserMutation.mutateAsync(apiData);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create user:', error);
      // Error handling is done by the mutation hook
    }
  };

  const isLoading = createUserMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <UserPlus className="text-primary h-5 w-5" />
                Add New User
              </SheetTitle>
              <SheetDescription>
                Fill in the details below to create a new user account.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Role Selector - Always visible at top */}
          <div className="space-y-2">
            <Label htmlFor="userType">
              User Role <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue('userType', value as 'ADMIN' | 'STAFF' | 'DOCTOR' | 'PATIENT')
              }
              defaultValue={form.getValues('userType')}
            >
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
                <SelectItem value="PATIENT">Patient</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.userType && (
              <p className="text-destructive text-sm">{form.formState.errors.userType.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-foreground text-lg font-semibold">Basic Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...form.register('firstName')}
                  aria-invalid={!!form.formState.errors.firstName}
                />
                {form.formState.errors.firstName && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...form.register('lastName')}
                  aria-invalid={!!form.formState.errors.lastName}
                />
                {form.formState.errors.lastName && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...form.register('email')}
                aria-invalid={!!form.formState.errors.email}
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...form.register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
              />
              {form.formState.errors.password && (
                <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                Leave blank to send invitation email for password setup
              </p>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {isDoctor && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-foreground flex items-center gap-2 text-lg font-semibold">
                <UserPlus className="text-primary h-4 w-4" />
                Doctor Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input id="specialty" placeholder="Cardiology" {...form.register('specialty')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Senior Consultant"
                    {...form.register('designation')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNo">License Number</Label>
                <Input id="licenseNo" placeholder="MD123456" {...form.register('licenseNo')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Consultation Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="150"
                  {...form.register('fee', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-24 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm"
                  placeholder="Brief professional bio..."
                  {...form.register('bio')}
                />
              </div>
            </div>
          )}

          {/* Patient-specific fields */}
          {isPatient && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-foreground text-lg font-semibold">Patient Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" {...form.register('dob')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) => form.setValue('gender', value)}
                    defaultValue={form.getValues('gender')}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  rows={2}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-20 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm"
                  placeholder="Street address, city, state, ZIP"
                  {...form.register('address')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  {...form.register('emergencyContact')}
                />
              </div>
            </div>
          )}

          <SheetFooter className="flex justify-end gap-3 border-t !p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
