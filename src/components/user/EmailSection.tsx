
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface EmailSectionProps {
  userEmail: string;
  userId?: string;
}

const EmailSection: React.FC<EmailSectionProps> = ({ userEmail, userId }) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // Update the user's email
  const handleUpdateEmail = async () => {
    if (!email || email === userEmail) {
      setIsEditingEmail(false);
      return;
    }

    try {
      setIsSubmittingEmail(true);
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // Update email in the profiles table as well
      if (userId) {
        await supabase
          .from('profiles')
          .update({ email })
          .eq('id', userId);
      }
      
      toast.success('Email update initiated. Please check your new email for confirmation.');
      setIsEditingEmail(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update email');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Email Address
      </label>
      <div className="flex">
        {isEditingEmail ? (
          <div className="flex w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 rounded-l-md border border-input focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleUpdateEmail}
              disabled={isSubmittingEmail}
              className="px-4 bg-primary text-white rounded-r-md hover:bg-primary/90 transition-colors flex items-center"
            >
              {isSubmittingEmail ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : 'Save'}
            </button>
          </div>
        ) : (
          <div className="flex w-full">
            <input
              type="email"
              value={userEmail || ''}
              readOnly
              className="block w-full p-2 rounded-l-md border border-input bg-background"
            />
            <button
              onClick={() => setIsEditingEmail(true)}
              className="px-4 bg-secondary text-secondary-foreground rounded-r-md hover:bg-secondary/80 transition-colors"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSection;
