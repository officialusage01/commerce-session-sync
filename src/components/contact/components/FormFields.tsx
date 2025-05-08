
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { CharacterCounter } from './CharacterCounter';

// Define the form data type here to avoid importing it
// Make properties optional to match useFeedbackForm's schema
type FeedbackFormData = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

interface FormFieldProps {
  form: UseFormReturn<FeedbackFormData>;
  currentCount: number;
  maxCount: number;
}

export const NameField: React.FC<FormFieldProps> = ({ form, currentCount, maxCount }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="Your name"
                className="w-full"
                {...field}
              />
              <CharacterCounter currentCount={currentCount} maxCount={maxCount} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const EmailField: React.FC<FormFieldProps> = ({ form, currentCount, maxCount }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="email"
                placeholder="your.email@example.com"
                className="w-full"
                {...field}
              />
              <CharacterCounter currentCount={currentCount} maxCount={maxCount} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SubjectField: React.FC<FormFieldProps> = ({ form, currentCount, maxCount }) => {
  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Subject (Optional)</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="What's this about?"
                className="w-full"
                {...field}
              />
              <CharacterCounter currentCount={currentCount} maxCount={maxCount} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const MessageField: React.FC<FormFieldProps> = ({ form, currentCount, maxCount }) => {
  return (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Message</FormLabel>
          <FormControl>
            <div className="relative">
              <Textarea
                placeholder="Your message here..."
                className="w-full min-h-[150px]"
                {...field}
              />
              <CharacterCounter currentCount={currentCount} maxCount={maxCount} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
