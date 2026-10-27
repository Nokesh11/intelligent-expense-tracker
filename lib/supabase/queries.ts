import { supabase } from './client';
import type { Expense, CreateExpenseInput, UpdateExpenseInput, Category } from '@/types';

// ─── Expense Queries ──────────────────────────────────────────────────────────

/**
 * Fetch all expenses for the current user within a date range.
 * Ordered by date descending (newest first).
 */
export async function getExpenses(
  userId: string,
  from: string,
  to: string
): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch expenses: ${error.message}`);
  return (data ?? []) as Expense[];
}

/**
 * Fetch a single expense by ID.
 */
export async function getExpenseById(id: string): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .select(`*, category:categories(*)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Expense;
}

/**
 * Create a new expense record.
 */
export async function createExpense(
  userId: string,
  input: CreateExpenseInput
): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: userId,
      amount: input.amount,
      description: input.description,
      date: input.date,
      category_id: input.categoryId,
      receipt_url: input.receiptUrl ?? null,
      ai_tagged: input.aiTagged ?? false,
      voice_logged: input.voiceLogged ?? false,
      notes: input.notes ?? null,
    })
    .select(`*, category:categories(*)`)
    .single();

  if (error) throw new Error(`Failed to create expense: ${error.message}`);
  return data as Expense;
}

/**
 * Update an existing expense.
 */
export async function updateExpense(input: UpdateExpenseInput): Promise<Expense> {
  const { id, ...fields } = input;

  const updatePayload: Record<string, unknown> = {};
  if (fields.amount !== undefined) updatePayload.amount = fields.amount;
  if (fields.description !== undefined) updatePayload.description = fields.description;
  if (fields.date !== undefined) updatePayload.date = fields.date;
  if (fields.categoryId !== undefined) updatePayload.category_id = fields.categoryId;
  if (fields.notes !== undefined) updatePayload.notes = fields.notes;
  if (fields.receiptUrl !== undefined) updatePayload.receipt_url = fields.receiptUrl;

  const { data, error } = await supabase
    .from('expenses')
    .update(updatePayload)
    .eq('id', id)
    .select(`*, category:categories(*)`)
    .single();

  if (error) throw new Error(`Failed to update expense: ${error.message}`);
  return data as Expense;
}

/**
 * Delete an expense by ID.
 */
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete expense: ${error.message}`);
}

// ─── Category Queries ─────────────────────────────────────────────────────────

/**
 * Fetch all categories for a user (defaults + custom).
 */
export async function getCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return (data ?? []) as Category[];
}

// ─── Dashboard / Analytics Queries ───────────────────────────────────────────

/**
 * Get total spending grouped by category for a date range.
 * Used for the dashboard donut chart.
 */
export async function getSpendingByCategory(
  userId: string,
  from: string,
  to: string
): Promise<Array<{ categoryId: string; total: number; count: number }>> {
  const { data, error } = await supabase
    .from('expenses')
    .select('category_id, amount')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  if (error) throw new Error(`Failed to fetch spending by category: ${error.message}`);

  // Aggregate client-side (small dataset per user per month)
  const map = new Map<string, { total: number; count: number }>();
  for (const row of data ?? []) {
    const existing = map.get(row.category_id) ?? { total: 0, count: 0 };
    map.set(row.category_id, {
      total: existing.total + row.amount,
      count: existing.count + 1,
    });
  }

  return Array.from(map.entries()).map(([categoryId, stats]) => ({
    categoryId,
    ...stats,
  }));
}

/**
 * Get total spending for a date range.
 */
export async function getTotalSpending(
  userId: string,
  from: string,
  to: string
): Promise<number> {
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  if (error) throw new Error(`Failed to fetch total spending: ${error.message}`);
  return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
}
