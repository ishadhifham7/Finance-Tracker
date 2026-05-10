import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: "Invalid id" });

const titleSchema = z
  .string({ error: "Title is required" })
  .trim()
  .min(1, "Title cannot be empty")
  .max(200, "Title must be 200 characters or fewer");

const amountSchema = z
  .number({ error: "Amount must be a number" })
  .finite("Amount must be a finite number")
  .positive("Amount must be greater than 0")
  .max(1_000_000_000_000, "Amount is too large");

const categorySchema = z
  .string({ error: "Category is required" })
  .trim()
  .min(1, "Category cannot be empty")
  .max(100, "Category must be 100 characters or fewer");

const transactionTypeSchema = z.enum(["income", "expense"], {
  error: "transactionType must be 'income' or 'expense'",
});

const dateSchema = z.coerce.date({ error: "date must be a valid ISO date" });

const noteSchema = z
  .string()
  .trim()
  .max(500, "Note must be 500 characters or fewer")
  .optional();

export const createTransactionSchema = z
  .object({
    title: titleSchema,
    amount: amountSchema,
    category: categorySchema,
    transactionType: transactionTypeSchema,
    date: dateSchema.optional(),
    note: noteSchema,
  })
  .strict();

export const updateTransactionSchema = z
  .object({
    title: titleSchema.optional(),
    amount: amountSchema.optional(),
    category: categorySchema.optional(),
    transactionType: transactionTypeSchema.optional(),
    date: dateSchema.optional(),
    note: noteSchema,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const transactionIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const listTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().min(1).max(200).optional(),
    type: transactionTypeSchema.optional(),
    category: z.string().trim().min(1).max(100).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sort: z.enum(["newest", "oldest", "highest", "lowest"]).default("newest"),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    { message: "startDate must be before endDate", path: ["startDate"] },
  );

export const summaryQuerySchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    { message: "startDate must be before endDate", path: ["startDate"] },
  );

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type SummaryQuery = z.infer<typeof summaryQuerySchema>;
