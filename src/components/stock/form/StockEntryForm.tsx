
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { StockData } from "../types";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { createStock, updateStock } from "@/services/stockIndex";
import { 
  FormTextInput, 
  FormNumberInput, 
  FormDatePicker, 
  FormTimeInput, 
  FormSubmitButton 
} from "./components";
import { stockEntrySchema, StockEntryFormValues } from "./StockFormSchemas";

type StockEntryFormProps = {
  selectedStock: StockData | null;
  onStockCreated: (stock: StockData) => void;
  onStockUpdated?: (stock: StockData) => void;
  isEditing?: boolean;
};

export const StockEntryForm: React.FC<StockEntryFormProps> = ({ 
  selectedStock, 
  onStockCreated,
  onStockUpdated,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues = {
    stockName: "",
    entryPrice: 0,
    stopLossPrice: undefined,
    quantity: 0,
    entryDate: new Date(),
    entryTime: "",
    expectedTimeline: undefined,
  };
  
  const entryForm = useForm<StockEntryFormValues>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues,
    mode: "onChange"
  });

  useEffect(() => {
    if (selectedStock) {
      entryForm.reset({
        stockName: selectedStock.stockName || "",
        entryPrice: selectedStock.entryPrice || 0,
        stopLossPrice: selectedStock.stopLossPrice,
        quantity: selectedStock.quantity || 0,
        entryDate: selectedStock.entryDate || new Date(),
        entryTime: selectedStock.entryTime || "",
        expectedTimeline: selectedStock.expectedTimeline,
      });
    }
  }, [selectedStock, entryForm]);

  const onEntrySubmit = async (data: StockEntryFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedStock?.id) {
        console.log("Updating existing stock:", selectedStock.id, data);
        
        // Update existing stock
        const updatedStock = await updateStock(selectedStock.id, {
          stockName: data.stockName,
          entryPrice: data.entryPrice,
          stopLossPrice: data.stopLossPrice,
          quantity: data.quantity,
          entryDate: data.entryDate,
          entryTime: data.entryTime,
          expectedTimeline: data.expectedTimeline
        });
        
        if (onStockUpdated) {
          onStockUpdated(updatedStock);
        }
        
        toast.success("Stock entry updated successfully!");
      } else {
        console.log("Creating new stock entry:", data);
        
        // Create new stock
        const newStock = await createStock({
          stockName: data.stockName,
          entryPrice: data.entryPrice,
          stopLossPrice: data.stopLossPrice,
          quantity: data.quantity,
          entryDate: data.entryDate,
          entryTime: data.entryTime,
          expectedTimeline: data.expectedTimeline
        });
        
        onStockCreated(newStock);
        toast.success("Stock entry saved successfully!");
        
        // Don't reset the form so users can see what they entered
        // entryForm.reset(defaultValues);
      }
    } catch (error) {
      console.error("Error saving stock entry:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'save'} stock entry`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = entryForm.formState.isValid;

  return (
    <Form {...entryForm}>
      <form onSubmit={entryForm.handleSubmit(onEntrySubmit)} className="space-y-4">
        <FormTextInput 
          form={entryForm} 
          name="stockName" 
          label="Stock Name" 
          placeholder="AAPL" 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormNumberInput 
            form={entryForm} 
            name="entryPrice" 
            label="Entry Price" 
            step="0.01" 
          />
          
          <FormNumberInput 
            form={entryForm} 
            name="stopLossPrice" 
            label="Stop Loss" 
            step="0.01" 
          />
        </div>
        
        <FormNumberInput 
          form={entryForm} 
          name="quantity" 
          label="Quantity" 
        />
        
        <FormDatePicker 
          form={entryForm} 
          name="entryDate" 
          label="Entry Date" 
        />
        
        <FormTimeInput 
          form={entryForm} 
          name="entryTime" 
          label="Entry Time" 
        />
        
        <FormNumberInput 
          form={entryForm} 
          name="expectedTimeline" 
          label="Expected Timeline (days)" 
        />
        
        <FormSubmitButton 
          isSubmitting={isSubmitting} 
          isValid={isFormValid}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Entry Details
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Save Entry Details
            </>
          )}
        </FormSubmitButton>
      </form>
    </Form>
  );
};
