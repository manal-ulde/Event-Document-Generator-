import { useEffect, useMemo, useState } from "react";
import { FlaskConical, GraduationCap, Megaphone, PartyPopper, Plus, Trophy, Wrench } from "lucide-react";
import { toast } from "sonner";
import BudgetWorkspaceShell from "@/components/BudgetWorkspaceShell";
import { loadBudgetCategories, loadBudgetRecords, saveBudgetCategories, StoredBudgetRecord } from "@/lib/budgetStorage";

const iconMap: Record<string, typeof PartyPopper> = {
  Fest: PartyPopper,
  Seminar: GraduationCap,
  Repair: Wrench,
  Research: FlaskConical,
  Infrastructure: Wrench,
  Sports: Trophy,
  Marketing: Megaphone,
  Hospitality: PartyPopper,
};

const BudgetCategoriesPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [records, setRecords] = useState<StoredBudgetRecord[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    setCategories(loadBudgetCategories());
    setRecords(loadBudgetRecords());
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((record) => map.set(record.category, (map.get(record.category) || 0) + 1));
    return map;
  }, [records]);

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) {
      toast.error("Enter a category name first.");
      return;
    }
    const updated = Array.from(new Set([...categories, value]));
    setCategories(updated);
    saveBudgetCategories(updated);
    setNewCategory("");
    toast.success("Category added.");
  };

  return (
    <BudgetWorkspaceShell
      title="Categories"
      subtitle="Manage budget categories"
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <input className="brutal-input min-w-[220px] rounded-[18px]" placeholder="Add new category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} />
          <button onClick={addCategory} className="brutal-btn-primary flex items-center gap-2 py-3">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add New Category
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = iconMap[category] || PartyPopper;
          return (
            <div key={category} className="rounded-[24px] border-2 border-foreground bg-card p-5 brutal-shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted brutal-border">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{category}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{counts.get(category) || 0} events</p>
            </div>
          );
        })}
      </div>
    </BudgetWorkspaceShell>
  );
};

export default BudgetCategoriesPage;
