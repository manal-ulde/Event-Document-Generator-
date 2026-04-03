export type BudgetProjectItem = {
  id: string;
  label: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  amount: number;
  notes: string;
  expenseType: string;
  vendorName?: string;
  purchaseDate?: string;
  paymentMethod?: string;
  expenseId?: string;
};

export type StoredBudgetRecord = {
  id: string;
  title: string;
  vendor: string;
  date: string;
  category: string;
  paymentMethod: string;
  receiptId: string;
  description?: string;
  expectedBudget?: number;
  items: BudgetProjectItem[];
  subtotal: number;
  taxTotal: number;
  discount: number;
  grandTotal: number;
};

export const BUDGET_STORAGE_KEY = "docuprint-budget-records";
export const BUDGET_CATEGORY_STORAGE_KEY = "docuprint-budget-categories";

export const DEFAULT_BUDGET_CATEGORIES = [
  "Fest",
  "Seminar",
  "Repair",
  "Research",
  "Infrastructure",
  "Sports",
  "Marketing",
  "Hospitality",
];

export const EXPENSE_TYPES = ["Food", "Lighting", "Logistics", "Decoration", "Hospitality", "Equipment", "Marketing", "Misc"];
export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "UPI", "Cheque", "Pending"];

export const sampleBudgetRecords: StoredBudgetRecord[] = [
  {
    id: "alegria-2024",
    title: "Allegria Fest 2024",
    vendor: "Festival Finance Desk",
    date: "15 Mar 2024",
    category: "Fest",
    paymentMethod: "Corporate Card",
    receiptId: "REC-20240315-9876",
    description: "Main college fest budget covering food, stage work, and event décor.",
    expectedBudget: 380000,
    items: [
      { id: "1", label: "Food stall support", quantity: 1, unitPrice: 54000, tax: 4320, amount: 58320, notes: "Main court allocation", expenseType: "Food", vendorName: "Campus Caterers", purchaseDate: "2024-03-05", paymentMethod: "Card", expenseId: "EXP-001" },
      { id: "2", label: "Lighting rig repair", quantity: 1, unitPrice: 79990, tax: 6400, amount: 86390, notes: "Electrical and panel fix", expenseType: "Lighting", vendorName: "StagePro Services", purchaseDate: "2024-03-08", paymentMethod: "Bank Transfer", expenseId: "EXP-002" },
      { id: "3", label: "Decoration material", quantity: 2, unitPrice: 99999, tax: 16000, amount: 215998, notes: "Backdrop and banners", expenseType: "Decoration", vendorName: "Visual Event House", purchaseDate: "2024-03-10", paymentMethod: "UPI", expenseId: "EXP-003" },
    ],
    subtotal: 333988,
    taxTotal: 26720,
    discount: 15018,
    grandTotal: 345690,
  },
  {
    id: "seminar-2024",
    title: "Tech Seminar",
    vendor: "Seminar Committee",
    date: "20 Feb 2024",
    category: "Seminar",
    paymentMethod: "Bank Transfer",
    receiptId: "SEM-20240220-4512",
    description: "Speaker hospitality, venue support, and seminar collateral.",
    expectedBudget: 95000,
    items: [
      { id: "4", label: "Speaker travel", quantity: 1, unitPrice: 32000, tax: 2560, amount: 34560, notes: "Round trip reimbursement", expenseType: "Hospitality", vendorName: "City Travels", purchaseDate: "2024-02-12", paymentMethod: "Bank Transfer", expenseId: "EXP-004" },
      { id: "5", label: "Seminar handouts", quantity: 180, unitPrice: 180, tax: 2592, amount: 34992, notes: "Printed attendee kits", expenseType: "Marketing", vendorName: "Print Hub", purchaseDate: "2024-02-15", paymentMethod: "Card", expenseId: "EXP-005" },
      { id: "6", label: "Audio setup", quantity: 1, unitPrice: 12000, tax: 960, amount: 12960, notes: "Hall AV support", expenseType: "Equipment", vendorName: "Sound Works", purchaseDate: "2024-02-18", paymentMethod: "UPI", expenseId: "EXP-006" },
    ],
    subtotal: 76400,
    taxTotal: 6112,
    discount: 2072,
    grandTotal: 80440,
  },
  {
    id: "sports-2024",
    title: "Annual Sports Day",
    vendor: "Sports Council",
    date: "28 Jan 2024",
    category: "Sports",
    paymentMethod: "Cheque",
    receiptId: "SPD-20240128-2101",
    description: "Ground setup, medals, and team refreshments.",
    expectedBudget: 150000,
    items: [
      { id: "7", label: "Ground preparation", quantity: 1, unitPrice: 45000, tax: 3600, amount: 48600, notes: "Track and pavilion markings", expenseType: "Logistics", vendorName: "Arena Ops", purchaseDate: "2024-01-21", paymentMethod: "Cheque", expenseId: "EXP-007" },
      { id: "8", label: "Refreshments", quantity: 1, unitPrice: 52000, tax: 4160, amount: 56160, notes: "Participants and volunteers", expenseType: "Food", vendorName: "Fresh Foods", purchaseDate: "2024-01-24", paymentMethod: "Card", expenseId: "EXP-008" },
      { id: "9", label: "Medals and kits", quantity: 1, unitPrice: 41000, tax: 3280, amount: 44280, notes: "Awards and jerseys", expenseType: "Misc", vendorName: "Sportline", purchaseDate: "2024-01-26", paymentMethod: "Bank Transfer", expenseId: "EXP-009" },
    ],
    subtotal: 138000,
    taxTotal: 11040,
    discount: 0,
    grandTotal: 149040,
  },
];

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

export const loadBudgetRecords = (): StoredBudgetRecord[] => {
  if (!canUseStorage()) {
    return sampleBudgetRecords;
  }

  const raw = window.localStorage.getItem(BUDGET_STORAGE_KEY);
  if (!raw) {
    return sampleBudgetRecords;
  }

  try {
    const parsed = JSON.parse(raw) as StoredBudgetRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleBudgetRecords;
  } catch {
    return sampleBudgetRecords;
  }
};

export const saveBudgetRecords = (records: StoredBudgetRecord[]) => {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(records));
};

export const loadBudgetCategories = () => {
  if (!canUseStorage()) {
    return DEFAULT_BUDGET_CATEGORIES;
  }

  const raw = window.localStorage.getItem(BUDGET_CATEGORY_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_BUDGET_CATEGORIES;
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    const categories = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BUDGET_CATEGORIES;
    return Array.from(new Set([...DEFAULT_BUDGET_CATEGORIES, ...categories]));
  } catch {
    return DEFAULT_BUDGET_CATEGORIES;
  }
};

export const saveBudgetCategories = (categories: string[]) => {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(BUDGET_CATEGORY_STORAGE_KEY, JSON.stringify(Array.from(new Set(categories))));
};

export const formatBudgetCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
