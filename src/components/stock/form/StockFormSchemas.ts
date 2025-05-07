
import { z } from "zod";

// Form schema for stock entry
export const stockEntrySchema = z.object({
  stockName: z.string().min(1, "Stock name is required"),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  stopLossPrice: z.coerce.number().positive("Stop loss price must be positive").optional(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
  entryDate: z.date({
    required_error: "Entry date is required",
  }),
  entryTime: z.string().optional(),
  expectedTimeline: z.coerce.number().int().positive("Timeline must be a positive integer").optional(),
});

// Schema for stock exit form
export const stockExitSchema = z.object({
  exitPrice: z.coerce.number().positive("Exit price must be positive"),
  exitDate: z.date({
    required_error: "Exit date is required",
  }),
  exitTime: z.string().optional(),
});

// Define types based on the schemas for type safety
export type StockEntryFormValues = z.infer<typeof stockEntrySchema>;
export type StockExitFormValues = z.infer<typeof stockExitSchema>;
