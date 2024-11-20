"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCalendarProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
}

export function TaskCalendar({ tasks, onUpdate, onComplete }: TaskCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateTasks = tasks.filter(
    (task) => format(new Date(task.dueDate), "yyyy-MM-dd") === format(date!, "yyyy-MM-dd")
  );

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              hasTask: tasks.map((task) => new Date(task.dueDate)),
            }}
            modifiersStyles={{
              hasTask: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {date && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                Tasks for {format(date, "MMMM d, yyyy")}
              </h3>
              {selectedDateTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks scheduled for this date.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-4">
                        {task.status !== "completed" && (
                          <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={() => onComplete(task.id)}
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          task.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-blue-500/10 text-blue-500"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}