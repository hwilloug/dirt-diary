"use client";

import { useState } from "react";
import { Plus, Calendar as CalendarIcon, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList } from "./task-list";
import { TaskCalendar } from "./task-calendar";
import { AddTaskDialog } from "./add-task-dialog";
import { Task } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Water Monstera",
    description: "Check soil moisture and water if needed",
    type: "watering",
    status: "pending",
    dueDate: "2024-03-12T08:00:00Z",
    plantId: "1",
    createdAt: "2024-03-08T08:00:00Z",
    updatedAt: "2024-03-08T08:00:00Z",
  },
  {
    id: "2",
    title: "Fertilize Tomatoes",
    description: "Apply balanced fertilizer",
    type: "fertilizing",
    status: "completed",
    dueDate: "2024-03-10T08:00:00Z",
    plantId: "2",
    completedAt: "2024-03-10T09:15:00Z",
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "3",
    title: "Prune Lavender",
    description: "Remove dead flowers and shape the plant",
    type: "pruning",
    status: "pending",
    dueDate: "2024-03-15T08:00:00Z",
    plantId: "3",
    createdAt: "2024-03-08T14:30:00Z",
    updatedAt: "2024-03-08T14:30:00Z",
  },
  {
    id: "4",
    title: "Plant New Seeds",
    description: "Start summer vegetables indoors",
    type: "custom",
    status: "pending",
    dueDate: "2024-03-20T10:00:00Z",
    createdAt: "2024-03-09T16:45:00Z",
    updatedAt: "2024-03-09T16:45:00Z",
  },
];

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "completed",
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Task List</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status === "pending").length} tasks pending
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <ListTodo className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            onComplete={handleCompleteTask}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendar
            tasks={tasks}
            onUpdate={handleUpdateTask}
            onComplete={handleCompleteTask}
          />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTask}
      />
    </div>
  );
}