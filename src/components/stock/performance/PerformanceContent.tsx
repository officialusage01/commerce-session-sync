
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockDateTree } from "@/components/stock/StockDateTree";
import { StockAnalysisContent } from "@/components/stock/analysis";
import { PerformanceHeader } from "@/components/stock/PerformanceHeader";
import { StockData, DateNode } from "@/components/stock/types";
import { GenericDataView } from "../generic/GenericDataView";
import { FilterControls } from "../filter/FilterControls";
import { useDataFiltering } from "@/hooks/useDataFiltering";
import { FilterButton } from "../filter/FilterControls";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PerformanceContentProps {
  selectedDate: string | null;
  selectedStock: StockData | null;
  stocks: StockData[];
  isMonthView: boolean;
  isYearView: boolean;
  isDayView: boolean;
  dateNodes: DateNode[];
  loadingDateNodes: boolean;
  handleDateSelect: (date: string) => void;
  handleSelectStock: (stock: StockData) => void;
  handleRefreshData: () => void;
}

export const PerformanceContent: React.FC<PerformanceContentProps> = ({
  selectedDate,
  selectedStock,
  stocks,
  isMonthView,
  isYearView,
  isDayView,
  dateNodes,
  loadingDateNodes,
  handleDateSelect,
  handleSelectStock,
  handleRefreshData
}) => {
  const {
    filterOpen,
    setFilterOpen,
    filterCriteria,
    setStockNameFilter,
    setStartDate,
    setEndDate,
    setPlThreshold,
    clearFilters,
    filteredData: filteredStocks
  } = useDataFiltering<StockData>(stocks);

  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stock Market Performance</h1>
      </div>
      
      {selectedDate && (
        <PerformanceHeader 
          stocks={stocks} 
          isMonthView={isMonthView || isYearView} 
          date={selectedDate} 
        />
      )}
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
          <Card>
            <CardHeader>
              <CardTitle>Date Navigator</CardTitle>
              <CardDescription>Browse by date</CardDescription>
            </CardHeader>
            <CardContent>
              <StockDateTree 
                dateNodes={dateNodes} 
                loading={loadingDateNodes} 
                onSelectDate={handleDateSelect}
                expandedByDefault="current-year"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-4/5">
          {stocks.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-end mb-4 space-x-2">
                  <FilterButton onClick={() => setFilterOpen(true)} />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshData}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                
                <StockAnalysisContent
                  selectedStock={selectedStock}
                  stocks={filteredStocks}
                  isMonthView={isMonthView}
                  isYearView={isYearView}
                  isDayView={isDayView}
                  selectedDate={selectedDate}
                  performanceData={undefined}  // Placeholder that will be populated in StockAnalysisContent
                  onStockCreated={() => {}}  // No-op function for view-only mode
                  onStockUpdated={() => {}}  // No-op function for view-only mode
                  updatePerformanceData={() => {}}  // Will be handled in parent
                  onSelectStock={handleSelectStock}
                  onRefresh={handleRefreshData}
                  viewOnly={true}  // Set view-only mode for performance page
                  defaultTab="table"  // Set table view as default
                />
                
                <FilterControls
                  open={filterOpen}
                  onOpenChange={setFilterOpen}
                  filterCriteria={filterCriteria}
                  setStockNameFilter={setStockNameFilter}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setPlThreshold={setPlThreshold}
                  onClearFilters={clearFilters}
                />
              </CardContent>
            </Card>
          ) : (
            <EmptyStockState />
          )}
        </div>
      </div>
    </div>
  );
};

// Simple component for when no stocks are selected
const EmptyStockState = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a date from the navigator to view stock performance
        </p>
      </div>
    </CardContent>
  </Card>
);
