
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { StockData } from "../types";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { updateStock } from "@/services/stockIndex";
import { 
  FormNumberInput, 
  FormDatePicker, 
  FormTimeInput, 
  FormSubmitButton 
} from "./StockFormComponents";
import { stockExitSchema, StockExitFormValues } from "./StockFormSchemas";

type StockExitFormProps = {
  selectedStock: StockData | null;
  onStockUpdated: (stock: StockData) => void;
};

export const StockExitForm: React.FC<StockExitFormProps> = ({ 
  selectedStock, 
  onStockUpdated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize with default values
  const defaultValues = {
    exitPrice: 0,
    exitDate: new Date(),
    exitTime: "",
  };
  
  const exitForm = useForm<StockExitFormValues>({
    resolver: zodResolver(stockExitSchema),
    defaultValues,
    mode: "onChange"
  });

  useEffect(() => {
    if (selectedStock) {
      // Reset form with controlled values to avoid uncontrolled to controlled warnings
      exitForm.reset({
        exitPrice: selectedStock.exitPrice || 0,
        exitDate: selectedStock.exitDate || new Date(),
        exitTime: selectedStock.exitTime || "",
      });
    }
  }, [selectedStock, exitForm]);

  const onExitSubmit = async (data: StockExitFormValues) => {
    if (!selectedStock) {
      toast.error("Please select a stock first");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const exitPrice = data.exitPrice;
      const profitLossPercentage = ((exitPrice - selectedStock.entryPrice) / selectedStock.entryPrice) * 100;
      
      console.log("Updating stock with exit data:", {
        exitPrice, exitDate: data.exitDate, exitTime: data.exitTime, profitLossPercentage
      });
      
      const updatedStock = await updateStock(selectedStock.id, {
        exitPrice: exitPrice,
        exitDate: data.exitDate,
        exitTime: data.exitTime,
        profitLossPercentage: profitLossPercentage
      });
      
      onStockUpdated(updatedStock);
      
      toast.success("Stock exit details saved successfully!");
    } catch (error) {
      console.error("Error saving stock exit details:", error);
      toast.error("Failed to save stock exit details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = exitForm.formState.isValid;

  return (
    <Form {...exitForm}>
      <form onSubmit={exitForm.handleSubmit(onExitSubmit)} className="space-y-4">
        <FormNumberInput 
          form={exitForm} 
          name="exitPrice" 
          label="Exit Price" 
          step="0.01" 
        />
        
        <FormDatePicker 
          form={exitForm} 
          name="exitDate" 
          label="Exit Date" 
        />
        
        <FormTimeInput 
          form={exitForm} 
          name="exitTime" 
          label="Exit Time" 
        />
        
        <FormSubmitButton 
          isSubmitting={isSubmitting} 
          isValid={isFormValid} 
          disabled={!selectedStock}
        >
          <Plus className="mr-2 h-4 w-4" />
          Save Exit Details
        </FormSubmitButton>
      </form>
    </Form>
  );
};
