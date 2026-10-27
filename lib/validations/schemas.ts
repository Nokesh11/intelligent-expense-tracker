import { z } from 'zod';

// ─── Expense Schemas ──────────────────────────────────────────────────────────

export const CreateExpenseSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be greater than 0')
    .max(10_000_000, 'Amount seems too large'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description cannot be empty')
    .max(255, 'Description is too long'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  categoryId: z.string().uuid('Invalid category'),
  receiptUrl: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
  aiTagged: z.boolean().default(false),
  voiceLogged: z.boolean().default(false),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial().extend({
  id: z.string().uuid(),
});

// ─── Category Schema ──────────────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1).max(10),   // emoji
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
});

// ─── Budget Schema ────────────────────────────────────────────────────────────

export const CreateBudgetSchema = z.object({
  amount: z.number().positive(),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  categoryId: z.string().uuid().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// ─── User Profile Schema ──────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED']).optional(),
  monthlyBudget: z.number().positive().nullable().optional(),
});

// ─── AI Voice Parse Schema ────────────────────────────────────────────────────

export const ParsedExpenseSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED']).default('INR'),
  category: z.string(),
  merchant: z.string().nullable().default(null),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string(),
  confidence: z.number().min(0).max(1),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ParsedExpenseInput = z.infer<typeof ParsedExpenseSchema>;
