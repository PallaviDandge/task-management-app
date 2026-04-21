import type { TaskSummary } from "../types";

export default function SummaryCards({ summary }: { summary: TaskSummary }) {
  const cards = [
    { label: "Total Tasks", value: summary.total },
    { label: "Pending", value: summary.pending },
    { label: "In Progress", value: summary.inProgress },
    { label: "Completed", value: summary.completed },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
    </section>
  );
}
