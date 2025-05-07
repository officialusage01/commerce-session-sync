
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { submitFeedback, FEEDBACK_FIELD_LIMITS } from '@/lib/supabase/feedback';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(FEEDBACK_FIELD_LIMITS.name, `Name must not exceed ${FEEDBACK_FIELD_LIMITS.name} characters`),
  email: z.string()
    .email('Please enter a valid email address')
    .max(FEEDBACK_FIELD_LIMITS.email, `Email must not exceed ${FEEDBACK_FIELD_LIMITS.email} characters`),
  subject: z.string()
    .max(FEEDBACK_FIELD_LIMITS.subject, `Subject must not exceed ${FEEDBACK_FIELD_LIMITS.subject} characters`)
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(FEEDBACK_FIELD_LIMITS.message, `Message must not exceed ${FEEDBACK_FIELD_LIMITS.message} characters`),
  rating: z.number().min(1).max(5).optional(),
});

type FormData = z.infer<typeof formSchema>;

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const formAnimationRef = React.useRef(null);
  const [charCounts, setCharCounts] = useState({
    name: 0,
    email: 0,
    subject: 0,
    message: 0
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const watchFields = {
    name: form.watch('name') || '',
    email: form.watch('email') || '',
    subject: form.watch('subject') || '',
    message: form.watch('message') || '',
  };

  // Update character counts when fields change
  React.useEffect(() => {
    setCharCounts({
      name: watchFields.name.length,
      email: watchFields.email.length,
      subject: watchFields.subject.length,
      message: watchFields.message.length
    });
  }, [watchFields.name, watchFields.email, watchFields.subject, watchFields.message]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const feedback = await submitFeedback({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        rating: selectedRating || undefined
      });

      if (feedback) {
        toast.success('Thank you for your feedback!', {
          description: 'We appreciate your time and input.',
        });
        form.reset();
        setSelectedRating(0);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Failed to submit feedback', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={formAnimationRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <span className={`absolute right-3 bottom-2 text-xs ${
                      charCounts.name > FEEDBACK_FIELD_LIMITS.name * 0.8 
                        ? 'text-amber-500' 
                        : 'text-muted-foreground'
                    }`}>
                      {charCounts.name}/{FEEDBACK_FIELD_LIMITS.name}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <span className={`absolute right-3 bottom-2 text-xs ${
                      charCounts.email > FEEDBACK_FIELD_LIMITS.email * 0.8 
                        ? 'text-amber-500' 
                        : 'text-muted-foreground'
                    }`}>
                      {charCounts.email}/{FEEDBACK_FIELD_LIMITS.email}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <span className={`absolute right-3 bottom-2 text-xs ${
                      charCounts.subject > FEEDBACK_FIELD_LIMITS.subject * 0.8 
                        ? 'text-amber-500' 
                        : 'text-muted-foreground'
                    }`}>
                      {charCounts.subject}/{FEEDBACK_FIELD_LIMITS.subject}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <span className={`absolute right-3 bottom-2 text-xs ${
                      charCounts.message > FEEDBACK_FIELD_LIMITS.message * 0.8 
                        ? 'text-amber-500' 
                        : 'text-muted-foreground'
                    }`}>
                      {charCounts.message}/{FEEDBACK_FIELD_LIMITS.message}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Rating (Optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={selectedRating >= rating ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8 transition-all hover:scale-105"
                  onClick={() => setSelectedRating(rating)}
                >
                  <Star
                    className={`h-4 w-4 ${
                      selectedRating >= rating ? 'fill-current' : ''
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default FeedbackForm;
