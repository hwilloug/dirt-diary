export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type TaskType = 'watering' | 'fertilizing' | 'pruning' | 'custom';
export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export interface TaskSchedule {
  frequency: TaskFrequency;
  days?: number[]; // For weekly tasks: 0 = Sunday, 6 = Saturday
  dayOfMonth?: number; // For monthly tasks
  interval?: number; // For daily tasks: every X days
  startDate: string;
  endDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  dueDate: string;
  plantId?: string;
  schedule?: TaskSchedule;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}