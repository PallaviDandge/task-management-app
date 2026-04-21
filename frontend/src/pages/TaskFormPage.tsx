import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/client";
import Navbar from "../components/Navbar";
import type { Task, TaskFormValues } from "../types";

const initialForm: TaskFormValues = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
};

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const [form, setForm] = useState<TaskFormValues>(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        return;
      }
            
      try {
        setIsLoading(true);
        let task: Task | null = null;

        try {
          const { data } = await api.get<Task>(`/tasks/${id}`);
          task = data;
        } catch (error: any) {
          const routeMissing =
            error.response?.status === 404 &&
            typeof error.response?.data?.message === "string" &&
            error.response.data.message.includes("Route not found");

          if (!routeMissing) {
            throw error;
          }

          const { data } = await api.get<Task[]>("/tasks");
          task = data.find((item) => item._id === id) || null;
        }

        if (!task) {
          setError("Task not found");
          return;
        }

        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate.slice(0, 10),
        });
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load task");
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      setIsSaving(true);

      if (isEdit && id) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post("/tasks", form);
      }

      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save task");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="form-page-header">
        <div>
          <p className="eyebrow">{isEdit ? "Edit Task" : "Create Task"}</p>
          <h1>{isEdit ? "Update your task" : "Add a new task"}</h1>
        </div>
        <Link to="/dashboard" className="button button-ghost">
          Back
        </Link>
      </section>

      <section className="form-card">
        {isLoading ? (
          <p className="message">Loading task...</p>
        ) : (
          <form className="task-form" onSubmit={handleSubmit}>
            {error ? <p className="message message-error">{error}</p> : null}

            <label>
              Title
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>

            <div className="form-row">
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as Task["status"],
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      priority: event.target.value as Task["priority"],
                    }))
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
            </div>

            <label>
              Due Date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dueDate: event.target.value }))
                }
                required
              />
            </label>

            <button type="submit" className="button button-primary">
              {isSaving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
