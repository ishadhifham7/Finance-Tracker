import type { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "../auth/auth.types";
import * as catService from "./category.service";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamsSchema,
} from "./category.validation";

const requireUserId = (req: AuthRequest): Types.ObjectId => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user._id as Types.ObjectId;
};

export const listCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const categories = await catService.listCategories(userId);

    res.status(200).json({
      status: "success",
      data: { categories },
    });
  },
);

export const getCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = categoryIdParamsSchema.parse(req.params);
    const category = await catService.getCategoryById(userId, id);

    res.status(200).json({
      status: "success",
      data: { category },
    });
  },
);

export const createCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const input = createCategorySchema.parse(req.body);
    const category = await catService.createCategory(userId, input);

    res.status(201).json({
      status: "success",
      data: { category },
    });
  },
);

export const updateCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = categoryIdParamsSchema.parse(req.params);
    const input = updateCategorySchema.parse(req.body);
    const category = await catService.updateCategory(userId, id, input);

    res.status(200).json({
      status: "success",
      data: { category },
    });
  },
);

export const deleteCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = categoryIdParamsSchema.parse(req.params);
    await catService.deleteCategory(userId, id);

    res.status(200).json({
      status: "success",
      data: { id },
    });
  },
);
