import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: "Invalid id" });

const amountSchema = z
  .number({ error: "Amount must be a number" })
  .finite("Amount must be a finite number")
  .positive("Amount must be greater than 0")
  .max(1_000_000_000_000, "Amount is too large");

const periodSchema = z.enum(["monthly"], {
  error: "period must be 'monthly'",
});

export const createBudgetSchema = z
  .object({
    categoryId: objectIdSchema,
    amount: amountSchema,
    period: periodSchema.optional().default("monthly"),
  })
  .strict();

export const updateBudgetSchema = z
  .object({
    amount: amountSchema.optional(),
    period: periodSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const budgetIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
