
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StockData } from "../types";
import { FilterCriteria } from "@/hooks/useDataFiltering";

interface GenericDataViewProps<T extends StockData> {
  data: T[];
  viewOnly?: boolean;
  renderTable: (filteredData: T[]) => React.ReactNode;
  filterControls: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filterCriteria: FilterCriteria;
    setStockNameFilter: (value: string) => void;
    setStartDate: (date: Date | undefined) => void;
    setEndDate: (date: Date | undefined) => void;
    setPlThreshold: (value: string) => void;
    onClearFilters: () => void;
  }) => React.ReactNode;
  onRefresh?: () => void; // Add this prop
}

export function GenericDataView<T extends StockData>({
  data,
  renderTable,
  filterControls
}: GenericDataViewProps<T>) {
  return (
    <div className="w-full">
      <Card>
        <CardContent className="pt-6">
          {renderTable(data)}
        </CardContent>
      </Card>
    </div>
  );
}
