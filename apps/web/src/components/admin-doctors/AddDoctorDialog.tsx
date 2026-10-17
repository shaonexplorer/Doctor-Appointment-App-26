'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDoctor, type CreateDoctorInput } from '@/hooks/useDoctors';

// Validation schema
const createDoctorSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  // Doctor-specific fields (required for doctor role)
  specialty: z.string().min(1, 'Specialty is required'),
  designation: z.string().min(1, 'Designation is required'),
  licenseNo: z.string().min(1, 'License number is required'),
  bio: z.string().optional(),
  fee: z.number().positive('Fee must be a positive number'),
});

type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;

interface AddDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDoctorDialog({ open, onOpenChange, onSuccess }: AddDoctorDialogProps) {
  const createDoctorMutation = useCreateDoctor();

  const form = useForm<CreateDoctorFormData>({
    resolver: zodResolver(createDoctorSchema as any),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialty: '',
      designation: '',
      licenseNo: '',
      bio: '',
      fee: undefined,
    },
  });

  const onSubmit = async (data: CreateDoctorFormData) => {
    try {
      // Transform form data to API format
      const apiData: CreateDoctorInput = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        specialty: data.specialty,
        designation: data.designation,
        licenseNo: data.licenseNo,
        bio: data.bio || undefined,
        fee: data.fee,
      };

      await createDoctorMutation.mutateAsync(apiData);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create doctor:', error);
      // Error handling is done by the mutation hook
    }
  };

  const isLoading = createDoctorMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Stethoscope className="text-primary h-5 w-5" />
                Add New Doctor
              </SheetTitle>
              <SheetDescription>
                Fill in the details below to create a new doctor account.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-foreground text-lg font-semibold">Doctor Information</h3>

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
                  <p className="text-destructive text-sm">{form.formState.errors.firstName.message}</p>
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
                  <p className="text-destructive text-sm">{form.formState.errors.lastName.message}</p>
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
              {isLoading ? 'Creating...' : 'Create Doctor'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}