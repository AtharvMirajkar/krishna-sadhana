"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";

interface ProgressChartsProps {
  chartData: Array<{
    date: string;
    total: number;
    byMantra: Record<string, number>;
  }>;
  mantraChartData: Array<{
    name: string;
    category: string;
    value: number;
    mantraId: string;
  }>;
  days?: number;
}

export function ProgressCharts({
  chartData,
  mantraChartData,
  days = 30,
}: ProgressChartsProps) {
  // Format data for line chart
  const lineChartData = chartData.map((item) => ({
    date: format(parseISO(item.date), "MMM dd"),
    fullDate: item.date,
    chants: item.total,
  }));

  // Format data for bar chart
  const barChartData = mantraChartData.slice(0, 10).map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    chants: item.value,
    category: item.category,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Line Chart - Progress Over Time */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Progress Over Time ({days} days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="chants"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Chants"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Mantra Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Top Mantras
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              type="number"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="chants"
              fill="#f59e0b"
              radius={[0, 8, 8, 0]}
              name="Total Chants"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

