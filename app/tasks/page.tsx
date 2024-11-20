import { TaskManager } from "@/components/tasks/task-manager";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Garden Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track your gardening tasks
        </p>
      </div>
      <TaskManager />
    </div>
  );
}