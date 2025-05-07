
import React from "react";
import { Clock } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormTimeInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

export const FormTimeInput: React.FC<FormTimeInputProps> = ({ 
  form, 
  name, 
  label 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                value={field.value || ""} // Ensure we always pass a string value
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
