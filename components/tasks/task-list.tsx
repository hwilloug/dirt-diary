"use client";

import { Task } from "@/types/task";
import { TaskCard } from "./task-card";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onUpdate, onComplete }: TaskListProps) {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks added yet.</p>
        <p className="text-sm text-muted-foreground">
          Click the Add Task button to create your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pending Tasks</h3>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending tasks.</p>
        ) : (
          <div className="grid gap-4">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onComplete={onComplete}
              />
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Completed Tasks</h3>
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onComplete={onComplete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}