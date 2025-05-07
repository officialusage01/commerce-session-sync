import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { DateNode } from "./types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface StockDateTreeProps {
  dateNodes: DateNode[];
  loading: boolean;
  onSelectDate: (date: string) => void;
  expandedByDefault?: "none" | "current-month" | "all" | "current-year";
}

export const StockDateTree: React.FC<StockDateTreeProps> = ({ 
  dateNodes, 
  loading, 
  onSelectDate,
  expandedByDefault = "current-month"
}) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  
  useEffect(() => {
    if (expandedByDefault === "none") return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    setExpandedYears(prev => {
      if (!prev.includes(currentYear)) {
        return [...prev, currentYear];
      }
      return prev;
    });
    
    if (expandedByDefault === "current-month") {
      setExpandedMonths(prev => {
        const monthKey = `${currentYear}-${currentMonth}`;
        if (!prev.includes(monthKey)) {
          return [...prev, monthKey];
        }
        return prev;
      });
    }
    
    if (expandedByDefault === "all") {
      const allYears = dateNodes.map(node => node.year);
      const allMonths: string[] = [];
      
      dateNodes.forEach(yearNode => {
        if (yearNode.months) {
          yearNode.months.forEach(monthNode => {
            allMonths.push(`${yearNode.year}-${monthNode.monthNumber}`);
          });
        }
      });
      
      setExpandedYears(allYears);
      setExpandedMonths(allMonths);
    }
    
    if (expandedByDefault === "current-year") {
      setExpandedYears([currentYear]);
    }
  }, [dateNodes, expandedByDefault]);
  
  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year) 
        : [...prev, year]
    );
  };
  
  const toggleMonth = (year: number, month: number) => {
    const monthKey = `${year}-${month}`;
    setExpandedMonths(prev => 
      prev.includes(monthKey) 
        ? prev.filter(m => m !== monthKey) 
        : [...prev, monthKey]
    );
  };
  
  const isYearExpanded = (year: number) => expandedYears.includes(year);
  
  const isMonthExpanded = (year: number, month: number) => {
    const monthKey = `${year}-${month}`;
    return expandedMonths.includes(monthKey);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading dates...</p>
      </div>
    );
  }
  
  if (dateNodes.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No dates available.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {dateNodes.map(yearNode => (
        <div key={yearNode.year} className="space-y-1">
          <button
            onClick={() => {
              toggleYear(yearNode.year);
              onSelectDate(yearNode.year.toString());
            }}
            className="flex items-center w-full text-left px-2 py-1 hover:bg-muted rounded-md transition-colors"
          >
            {isYearExpanded(yearNode.year) 
              ? <ChevronDown className="h-4 w-4 mr-1" /> 
              : <ChevronRight className="h-4 w-4 mr-1" />}
            <span className="font-medium">{yearNode.year}</span>
          </button>
          
          {isYearExpanded(yearNode.year) && yearNode.months && (
            <div className="ml-6 space-y-1">
              {yearNode.months.map(monthNode => (
                <div key={`${yearNode.year}-${monthNode.monthNumber}`} className="space-y-1">
                  <button
                    onClick={() => {
                      toggleMonth(yearNode.year, monthNode.monthNumber);
                      const formattedMonth = (monthNode.monthNumber + 1).toString().padStart(2, '0');
                      onSelectDate(`${yearNode.year}-${formattedMonth}`);
                    }}
                    className="flex items-center w-full text-left px-2 py-1 hover:bg-muted rounded-md transition-colors"
                  >
                    {isMonthExpanded(yearNode.year, monthNode.monthNumber) 
                      ? <ChevronDown className="h-4 w-4 mr-1" /> 
                      : <ChevronRight className="h-4 w-4 mr-1" />}
                    <span>{monthNode.month}</span>
                  </button>
                  
                  {isMonthExpanded(yearNode.year, monthNode.monthNumber) && (
                    <div className="ml-6 space-y-1">
                      {monthNode.days.map(dayNode => {
                        const dateObj = new Date(dayNode.date);
                        const dayName = format(dateObj, 'EEE');
                        const dayOfMonth = format(dateObj, 'd');
                        
                        return (
                          <button
                            key={dayNode.date}
                            onClick={() => onSelectDate(dayNode.date)}
                            className="flex items-center w-full text-left px-2 py-1 hover:bg-muted rounded-md transition-colors"
                          >
                            <span>{dayName}, {dayOfMonth} ({dayNode.stocks.length})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
