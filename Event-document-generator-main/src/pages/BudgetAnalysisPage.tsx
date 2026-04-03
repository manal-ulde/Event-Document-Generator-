import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import BudgetWorkspaceShell from "@/components/BudgetWorkspaceShell";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { StoredBudgetRecord, formatBudgetCurrency, loadBudgetRecords } from "@/lib/budgetStorage";
import { getCategoryInsights } from "@/lib/budgetMetrics";

const BudgetAnalysisPage = () => {
  const [records, setRecords] = useState<StoredBudgetRecord[]>([]);

  useEffect(() => {
    setRecords(loadBudgetRecords());
  }, []);

  const chartData = useMemo(
    () =>
      records.map((record) => ({
        name: record.title.length > 12 ? `${record.title.slice(0, 12)}...` : record.title,
        budget: record.expectedBudget || record.grandTotal,
        spent: record.grandTotal,
      })),
    [records]
  );

  const insights = useMemo(() => getCategoryInsights(records), [records]);

  return (
    <BudgetWorkspaceShell title="Analysis" subtitle="Spending insights and comparisons">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-1 h-5 w-5 text-primary" strokeWidth={2.4} />
            <div>
              <p className="text-lg font-semibold">Highest spending category</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {insights.highest ? `${insights.highest.name} (${formatBudgetCurrency(insights.highest.value)})` : "No category data yet."}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 text-secondary" strokeWidth={2.4} />
            <div>
              <p className="text-lg font-semibold">Overspending detected</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {insights.overspending[0]
                  ? `${insights.overspending[0].title} exceeded budget by ${formatBudgetCurrency(insights.overspending[0].grandTotal - (insights.overspending[0].expectedBudget || 0))}`
                  : "No overspending detected in current records."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" strokeWidth={2.4} />
          <h2 className="text-lg font-bold uppercase">Spending vs Budget</h2>
        </div>
        <ChartContainer
          className="h-[360px] w-full"
          config={{
            budget: { label: "Budget", color: "hsl(var(--secondary))" },
            spent: { label: "Spent", color: "hsl(var(--primary))" },
          }}
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={[10, 10, 0, 0]} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </BudgetWorkspaceShell>
  );
};

export default BudgetAnalysisPage;
