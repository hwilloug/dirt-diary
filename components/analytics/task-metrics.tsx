"use client";

import { JournalEntry } from "@/types/journal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskMetricsProps {
  entries: JournalEntry[];
}

export function TaskMetrics({ entries }: TaskMetricsProps) {
  // Aggregate tasks
  const taskCounts = entries.reduce((acc, entry) => {
    entry.tasks.forEach((task) => {
      const normalizedTask = task.toLowerCase().trim();
      acc[normalizedTask] = (acc[normalizedTask] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Sort tasks by frequency
  const sortedTasks = Object.entries(taskCounts).sort((a, b) => b[1] - a[1]);

  // Calculate task completion over time
  const tasksByMonth = entries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + entry.tasks.length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Most Common Tasks</h4>
        <div className="space-y-2">
          {sortedTasks.slice(0, 8).map(([task, count]) => (
            <div
              key={task}
              className="flex items-center justify-between text-sm"
            >
              <span className="capitalize">{task}</span>
              <Badge variant="secondary">{count} times</Badge>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Monthly Task Completion</h4>
        <div className="grid gap-4 grid-cols-3">
          {Object.entries(tasksByMonth)
            .slice(-3)
            .map(([month, count]) => (
              <Card key={month}>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">{month}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}