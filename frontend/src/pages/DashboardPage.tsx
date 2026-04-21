import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskStatus, TaskSummary } from "../types";

const initialSummary: TaskSummary = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary>(initialSummary);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sort: "dueDate_asc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [tasksResponse, summaryResponse] = await Promise.all([
        api.get<Task[]>("/tasks", {
          params: {
            search: filters.search || undefined,
            status: filters.status || undefined,
            priority: filters.priority || undefined,
            sort: filters.sort,
          },
        }),
        api.get<TaskSummary>("/tasks/summary"),
      ]);

      setTasks(tasksResponse.data);
      setSummary(summaryResponse.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [filters.search, filters.status, filters.priority, filters.sort]);

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      await loadDashboard();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status,
        priority: task.priority,
        dueDate: task.dueDate,
      });

      await loadDashboard();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Shape the week before it shapes you.</h1>
          <p className="hero-copy">
            Search, sort, and move your work forward from one calm command center.
          </p>
        </div>
      </section>

      <SummaryCards summary={summary} />
      <TaskFilters filters={filters} onChange={setFilters} />

      {error ? <p className="message message-error">{error}</p> : null}
      {isLoading ? <p className="message">Loading tasks...</p> : null}

      {!isLoading && tasks.length === 0 ? (
        <section className="empty-state">
          <h2>No tasks found</h2>
          <p>Create a task or adjust the filters to see results.</p>
        </section>
      ) : null}

      {!isLoading && tasks.length > 0 ? (
        <section className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
