import { useMemo, useState } from "react";
import BudgetWorkspaceShell from "@/components/BudgetWorkspaceShell";
import { loadBudgetCategories, formatBudgetCurrency } from "@/lib/budgetStorage";

const BudgetEstimationPage = () => {
  const categories = useMemo(() => loadBudgetCategories(), []);
  const [eventType, setEventType] = useState(categories[0] || "Fest");

  const estimates = useMemo(() => {
    const base = eventType === "Fest" ? 180000 : eventType === "Seminar" ? 90000 : eventType === "Sports" ? 140000 : 110000;
    return [
      { label: "Lighting", value: Math.round(base * 0.18) },
      { label: "Food", value: Math.round(base * 0.28) },
      { label: "Logistics", value: Math.round(base * 0.22) },
      { label: "Misc", value: Math.round(base * 0.12) },
    ];
  }, [eventType]);

  return (
    <BudgetWorkspaceShell title="Estimation" subtitle="Smart suggestion UI for event budget planning">
      <div className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Event Type / Category</label>
            <select className="brutal-input rounded-[20px]" value={eventType} onChange={(event) => setEventType(event.target.value)}>
              {categories.map((entry) => (
                <option key={entry}>{entry}</option>
              ))}
            </select>
          </div>
          <div className="rounded-[20px] border border-foreground/10 bg-background px-4 py-4">
            <p className="text-sm text-muted-foreground">Suggested budget breakdown</p>
            <p className="mt-2 text-lg font-semibold">Estimated total for {eventType}: {formatBudgetCurrency(estimates.reduce((sum, item) => sum + item.value, 0))}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {estimates.map((item, index) => (
          <div key={item.label} className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-5 text-3xl font-bold">{formatBudgetCurrency(item.value)}</p>
            <div className={`mt-6 h-3 w-16 border-2 border-foreground ${index % 2 === 0 ? "bg-primary" : "bg-secondary"}`} />
          </div>
        ))}
      </div>
    </BudgetWorkspaceShell>
  );
};

export default BudgetEstimationPage;
