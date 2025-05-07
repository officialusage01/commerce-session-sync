
import React from "react";
import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isSubmitting,
  isValid,
  disabled = false,
  children,
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={!isValid || isSubmitting || disabled}
    >
      {isSubmitting ? (
        <>
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          Saving...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
