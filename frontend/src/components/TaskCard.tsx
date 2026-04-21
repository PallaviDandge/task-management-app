import { Link } from "react-router-dom";

import type { Task, TaskStatus } from "../types";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export default function TaskCard({ task, onDelete, onStatusChange }: Props) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h3>{task.title}</h3>
          <p className="task-meta">
            Priority: <strong>{task.priority}</strong>
          </p>
        </div>

        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      <p className="task-description">{task.description || "No description provided."}</p>

      <div className="task-card-footer">
        <div>
          <p className="task-meta">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <select
            value={task.status}
            onChange={(event) =>
              onStatusChange(task, event.target.value as TaskStatus)
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="task-actions">
          <Link to={`/tasks/${task._id}/edit`} className="button button-ghost">
            Edit
          </Link>
          <button
            type="button"
            className="button button-danger"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
