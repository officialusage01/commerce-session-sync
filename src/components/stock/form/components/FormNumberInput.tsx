
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormNumberInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  step?: string;
}

export const FormNumberInput: React.FC<FormNumberInputProps> = ({
  form,
  name,
  label,
  step = "1",
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              step={step} 
              {...field} 
              value={field.value || ""} // Ensure we always pass a string value
              onChange={(e) => {
                // Convert empty string to undefined to maintain form schema validity
                const value = e.target.value === "" ? undefined : Number(e.target.value);
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
