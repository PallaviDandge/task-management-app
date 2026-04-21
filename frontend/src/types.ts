export type User = {
  _id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  user: User;
  token: string;
};

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskSummary = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};
