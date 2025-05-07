
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StockData } from "./types";
import { CheckCircle, XCircle, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";

interface StockTableRowProps {
  stock: StockData;
  isSelected: boolean;
  isChecked: boolean;
  viewOnly: boolean;
  onSelectStock?: () => void;
  onCheckStock?: () => void;
  onEditStock?: () => void;
}

export const StockTableRow: React.FC<StockTableRowProps> = ({
  stock,
  isSelected,
  isChecked,
  viewOnly,
  onSelectStock,
  onCheckStock,
  onEditStock
}) => {
  const profitLoss = stock.profitLossPercentage || 0;
  const isProfitable = profitLoss > 0;
  const tradeDuration = stock.exitDate && stock.entryDate 
    ? formatDistance(new Date(stock.exitDate), new Date(stock.entryDate))
    : 'Ongoing';
    
  return (
    <TableRow 
      key={stock.id}
      className={cn(
        isSelected ? "bg-muted" : "",
        onSelectStock ? "cursor-pointer hover:bg-muted/80" : "",
        isChecked ? "bg-muted/40" : ""
      )}
      onClick={onSelectStock}
    >
      {!viewOnly && (
        <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center">
            <Checkbox 
              id={`checkbox-${stock.id}`}
              checked={isChecked}
              onCheckedChange={() => onCheckStock && onCheckStock()}
              className="cursor-pointer"
            />
            <label 
              htmlFor={`checkbox-${stock.id}`}
              className="ml-2 flex-grow cursor-pointer"
              onClick={() => onCheckStock && onCheckStock()}
            />
          </div>
        </TableCell>
      )}
      <TableCell className="font-medium">{stock.stockName}</TableCell>
      <TableCell className="text-right">${stock.entryPrice.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {stock.exitPrice 
          ? `$${stock.exitPrice.toFixed(2)}` 
          : 'Pending'}
      </TableCell>
      <TableCell className="text-right">
        {stock.stopLossPrice 
          ? `$${stock.stopLossPrice.toFixed(2)}` 
          : '-'}
      </TableCell>
      <TableCell className="text-right">{stock.quantity}</TableCell>
      <TableCell>
        {new Date(stock.entryDate).toLocaleDateString()}
        {stock.entryTime && ` ${stock.entryTime}`}
      </TableCell>
      <TableCell>
        {stock.exitDate 
          ? `${new Date(stock.exitDate).toLocaleDateString()}${stock.exitTime ? ` ${stock.exitTime}` : ''}` 
          : 'Pending'}
      </TableCell>
      <TableCell className={cn(
        "text-right font-medium",
        isProfitable ? "text-green-600" : "text-red-600"
      )}>
        {stock.profitLossPercentage 
          ? `${stock.profitLossPercentage > 0 ? '+' : ''}${stock.profitLossPercentage.toFixed(2)}%` 
          : '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between">
          {stock.exitDate ? (
            <div className="flex items-center">
              {stock.successStatus !== undefined ? (
                stock.successStatus ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-1" />
                )
              ) : (
                isProfitable ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-1" />
                )
              )}
              <span className="text-xs text-muted-foreground ml-1">{tradeDuration}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">In progress</span>
          )}
          
          {!viewOnly && onEditStock && (
            <Edit 
              className="h-4 w-4 text-blue-500 cursor-pointer ml-2" 
              onClick={(e) => {
                e.stopPropagation();
                onEditStock();
              }}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
