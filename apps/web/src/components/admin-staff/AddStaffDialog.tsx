'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
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
import { useCreateUser, type CreateUserInput } from '@/hooks/useUsers';

// Validation schema for creating a staff user
const createStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
});

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddStaffDialog({ open, onOpenChange, onSuccess }: AddStaffDialogProps) {
  const createUserMutation = useCreateUser();

  const form = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema as any),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateStaffFormData) => {
    try {
      // Transform form data to API format - role is locked to STAFF
      const apiData: CreateUserInput = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        userType: 'STAFF',
        password: data.password || undefined,
      };

      await createUserMutation.mutateAsync(apiData);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create staff:', error);
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
                Add New Staff
              </SheetTitle>
              <SheetDescription>
                Fill in the details below to create a new staff account.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Staff Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Jane"
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
                  placeholder="Smith"
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
                placeholder="jane.smith@clinic.com"
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
              {isLoading ? 'Creating...' : 'Create Staff'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
