"use client";

import { format } from "date-fns";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Calendar, RefreshCw } from "lucide-react";
import { EditTaskDialog } from "./edit-task-dialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
}

export function TaskCard({ task, onDelete, onUpdate, onComplete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "overdue":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-blue-500/10 text-blue-500";
    }
  };

  const getScheduleText = (task: Task) => {
    if (!task.schedule) return null;

    switch (task.schedule.frequency) {
      case "daily":
        return `Every ${task.schedule.interval} day(s)`;
      case "weekly":
        return `Weekly on ${task.schedule.days
          ?.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
          .join(", ")}`;
      case "monthly":
        return `Monthly on day ${task.schedule.dayOfMonth}`;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-start space-x-4">
            {task.status !== "completed" && (
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => onComplete(task.id)}
              />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {task.schedule && (
              <Badge variant="outline">
                <RefreshCw className="mr-1 h-3 w-3" />
                Recurring
              </Badge>
            )}
            <Badge variant="secondary" className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
            {task.status !== "completed" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Due {format(new Date(task.dueDate), "PPP")}
            </div>
            {task.schedule && (
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                {getScheduleText(task)}
              </div>
            )}
            {task.completedAt && (
              <div>
                Completed {format(new Date(task.completedAt), "PPP")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(task.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}