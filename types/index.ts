// Global TypeScript types for the Intelligent Expense Tracker

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type Period = 'weekly' | 'monthly' | 'yearly';

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  currency: Currency;
  monthlyBudget: number | null;
  createdAt: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;   // emoji: "🍔", "🏠", "🛒"
  color: string;  // hex: "#FF6B6B"
  isDefault: boolean;
  createdAt: string;
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;          // ISO date string: "2026-10-27"
  categoryId: string;
  category?: Category;   // joined relation
  receiptUrl: string | null;
  aiTagged: boolean;
  voiceLogged: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  receiptUrl?: string;
  aiTagged?: boolean;
  voiceLogged?: boolean;
  notes?: string;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {
  id: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;  // null = overall budget
  category?: Category;
  amount: number;
  period: Period;
  startDate: string;
  endDate: string;
}

// ─── AI Types ─────────────────────────────────────────────────────────────────

export interface ParsedExpense {
  amount: number;
  currency: Currency;
  category: string;
  merchant: string | null;
  date: string;
  description: string;
  confidence: number;
}

export interface CategorizationResult {
  category: string;
  categoryId: string | null;
  confidence: number;
}

export interface AIInsight {
  period: string;
  summary: string;
  highlights: string[];
  recommendations: string[];
  totalSpent: number;
  topCategory: string;
  comparedToPrevious: number | null; // percentage change
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalThisMonth: number;
  totalLastMonth: number;
  percentageChange: number;
  topCategories: CategorySummary[];
  recentExpenses: Expense[];
  budgetUsage: BudgetUsage[];
}

export interface CategorySummary {
  categoryId: string;
  category: Category;
  total: number;
  percentage: number;
  count: number;
}

export interface BudgetUsage {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
