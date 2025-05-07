
import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui-components/Button';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordSectionProps {
  userEmail: string;
  onCancel: () => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({ userEmail, onCancel }) => {
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setIsSubmittingPassword(true);
      
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail || '',
        password: data.currentPassword
      });
      
      if (signInError) {
        toast.error('Current password is incorrect');
        return;
      }
      
      // Then update password
      const { error } = await supabase.auth.updateUser({ 
        password: data.newPassword 
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Password updated successfully');
      onCancel();
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Key className="h-5 w-5 mr-2 text-primary" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                isLoading={isSubmittingPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordSection;
