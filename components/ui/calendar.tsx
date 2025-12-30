"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center mb-3",
        caption_label:
          "text-base font-semibold text-gray-900 dark:text-gray-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md transition-all"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-gray-600 dark:text-gray-400 w-[calc(100%/7)] font-semibold text-xs uppercase tracking-wider text-center py-2",
        row: "flex w-full mt-1",
        cell: "h-10 w-[calc(100%/7)] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-50 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-gray-900 dark:text-gray-100 aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mx-auto transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 focus:bg-gradient-to-r focus:from-amber-500 focus:to-orange-600 shadow-md font-semibold",
        day_today:
          "bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 font-semibold border-2 border-amber-400 dark:border-amber-600",
        day_outside:
          "day-outside text-gray-400 dark:text-gray-500 opacity-50 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-gray-500 dark:aria-selected:text-gray-400",
        day_disabled:
          "text-gray-300 dark:text-gray-600 opacity-40 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-gray-900 dark:aria-selected:text-gray-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
