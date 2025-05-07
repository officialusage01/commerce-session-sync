
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormTextInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  form,
  name,
  label,
  placeholder = "",
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
              placeholder={placeholder} 
              {...field}
              value={field.value || ""} // Ensure we always pass a string value
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
