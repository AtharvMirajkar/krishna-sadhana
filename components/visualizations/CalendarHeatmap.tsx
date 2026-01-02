"use client";

import { useMemo } from "react";
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

interface CalendarHeatmapProps {
  data: Array<{ date: string; total: number }>;
  year?: number;
}

export function CalendarHeatmap({
  data,
  year = new Date().getFullYear(),
}: CalendarHeatmapProps) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      map.set(item.date, item.total);
    });
    return map;
  }, [data]);

  // Calculate max value for color intensity
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.total), 1);
  }, [data]);

  // Get color based on intensity
  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-100 dark:bg-gray-800";
    const intensity = Math.min(value / maxValue, 1);
    if (intensity < 0.25) return "bg-amber-200 dark:bg-amber-900";
    if (intensity < 0.5) return "bg-amber-400 dark:bg-amber-700";
    if (intensity < 0.75) return "bg-orange-500 dark:bg-orange-600";
    return "bg-orange-600 dark:bg-orange-500";
  };

  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((day, index) => {
    const dayOfWeek = day.getDay();

    // Start new week on Sunday or first day
    if (dayOfWeek === 0 || index === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }

    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Pad first week if needed
  if (weeks[0] && weeks[0][0].getDay() !== 0) {
    const firstDay = weeks[0][0];
    const padding = firstDay.getDay();
    for (let i = 0; i < padding; i++) {
      weeks[0].unshift(new Date(0)); // Placeholder
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Chanting Activity - {year}
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            <div className="h-4"></div>
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <div
                key={i}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{ height: "13px", lineHeight: "13px" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (day.getTime() === 0) {
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-3 h-3"
                      />
                    );
                  }

                  const dateStr = format(day, "yyyy-MM-dd");
                  const value = dataMap.get(dateStr) || 0;
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={dateStr}
                      className={`w-3 h-3 rounded-sm ${getColor(value)} ${
                        isToday
                          ? "ring-2 ring-amber-600 dark:ring-amber-400"
                          : ""
                      } transition-all hover:scale-125 cursor-pointer`}
                      title={`${format(day, "MMM dd, yyyy")}: ${value} chants`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-900" />
          <div className="w-3 h-3 rounded-sm bg-amber-400 dark:bg-amber-700" />
          <div className="w-3 h-3 rounded-sm bg-orange-500 dark:bg-orange-600" />
          <div className="w-3 h-3 rounded-sm bg-orange-600 dark:bg-orange-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
