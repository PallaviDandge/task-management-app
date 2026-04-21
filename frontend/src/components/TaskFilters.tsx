type Filters = {
  search: string;
  status: string;
  priority: string;
  sort: string;
};

type Props = {
  filters: Filters;
  onChange: (value: Filters) => void;
};

export default function TaskFilters({ filters, onChange }: Props) {
  const updateField = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <section className="filter-bar">
      <input
        type="text"
        placeholder="Search by title"
        value={filters.search}
        onChange={(event) => updateField("search", event.target.value)}
      />

      <select
        value={filters.status}
        onChange={(event) => updateField("status", event.target.value)}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(event) => updateField("priority", event.target.value)}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={filters.sort}
        onChange={(event) => updateField("sort", event.target.value)}
      >
        <option value="dueDate_asc">Due Date Asc</option>
        <option value="dueDate_desc">Due Date Desc</option>
        <option value="createdAt_desc">Newest First</option>
        <option value="createdAt_asc">Oldest First</option>
      </select>
    </section>
  );
}
