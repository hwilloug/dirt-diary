"use client";

import { JournalEntry } from "@/types/journal";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface GrowthChartProps {
  entries: JournalEntry[];
}

export function GrowthChart({ entries }: GrowthChartProps) {
  // Process entries to create chart data
  const chartData = entries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((d) => d.month === month);
    
    if (existingMonth) {
      existingMonth.entries++;
      existingMonth.tasks += entry.tasks.length;
    } else {
      acc.push({
        month,
        entries: 1,
        tasks: entry.tasks.length,
      });
    }
    
    return acc;
  }, [] as Array<{ month: string; entries: number; tasks: number }>);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="entries"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="tasks"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}