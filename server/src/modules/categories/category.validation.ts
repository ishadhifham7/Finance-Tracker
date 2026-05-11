import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: "Invalid id" });

const nameSchema = z
  .string({ error: "Name is required" })
  .trim()
  .min(1, "Name cannot be empty")
  .max(100, "Name must be 100 characters or fewer");

const typeSchema = z.enum(["income", "expense", "both"], {
  error: "type must be 'income', 'expense', or 'both'",
});

const colorSchema = z
  .string({ error: "Color is required" })
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color must be a valid hex value (e.g. #fff or #aabbcc)");

export const createCategorySchema = z
  .object({
    name: nameSchema,
    type: typeSchema.optional().default("both"),
    color: colorSchema.optional().default("#6b7280"),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: nameSchema.optional(),
    type: typeSchema.optional(),
    color: colorSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const categoryIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
