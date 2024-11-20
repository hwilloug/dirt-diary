"use client";

import { JournalEntry } from "@/types/journal";
import { Card, CardContent } from "@/components/ui/card";
import { addDays, format, startOfWeek, subDays } from "date-fns";

interface ActivityHeatmapProps {
  entries: JournalEntry[];
}

export function ActivityHeatmap({ entries }: ActivityHeatmapProps) {
  const today = new Date();
  const startDate = subDays(today, 364); // Show last year of activity
  
  // Create activity map
  const activityMap = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.date), "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + 1 + entry.tasks.length;
    return acc;
  }, {} as Record<string, number>);

  // Generate calendar grid
  const weeks: Date[][] = [];
  let currentDate = startOfWeek(startDate);

  for (let week = 0; week < 53; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(addDays(currentDate, day));
    }
    weeks.push(weekDays);
    currentDate = addDays(currentDate, 7);
  }

  const getActivityLevel = (date: Date) => {
    const count = activityMap[format(date, "yyyy-MM-dd")] || 0;
    if (count === 0) return "bg-secondary";
    if (count <= 2) return "bg-chart-1/30";
    if (count <= 5) return "bg-chart-1/60";
    return "bg-chart-1";
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-secondary rounded" />
          <span>No activity</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-chart-1/30 rounded" />
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-chart-1/60 rounded" />
          <span>Medium</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-chart-1 rounded" />
          <span>High</span>
        </div>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded ${getActivityLevel(day)}`}
                title={`${format(day, "PP")}: ${
                  activityMap[format(day, "yyyy-MM-dd")] || 0
                } activities`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}