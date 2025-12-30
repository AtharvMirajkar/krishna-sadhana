"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date | null;
  onDateChange: (date: Date | null) => void;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  showReset?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  maxDate,
  placeholder = "Pick a date",
  className,
  showReset = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate || null);
    if (selectedDate) {
      setOpen(false);
    }
  };

  const handleReset = () => {
    onDateChange(null);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-700 hover:bg-gray-50 dark:hover:bg-gray-700",
              !date && "text-gray-500 dark:text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 min-w-[280px]"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            disabled={(date) => {
              if (maxDate) {
                return date > maxDate;
              }
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {showReset && date && (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleReset}
          className="shrink-0"
          title="Reset to today"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
