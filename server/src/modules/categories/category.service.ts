import { Types } from "mongoose";
import Category, { ICategory } from "./category.model";
import Transaction from "../transactions/transaction.model";
import { ApiError } from "../../utils/apiError";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

export const listCategories = async (
  userId: Types.ObjectId,
): Promise<ICategory[]> => {
  return Category.find({ userId }).sort({ name: 1 }).exec();
};

export const getCategoryById = async (
  userId: Types.ObjectId,
  id: string,
): Promise<ICategory> => {
  const cat = await Category.findOne({ _id: id, userId }).exec();
  if (!cat) throw new ApiError(404, "Category not found");
  return cat;
};

export const createCategory = async (
  userId: Types.ObjectId,
  input: CreateCategoryInput,
): Promise<ICategory> => {
  const existing = await Category.findOne({
    userId,
    name: { $regex: new RegExp(`^${escapeRegex(input.name)}$`, "i") },
  }).exec();

  if (existing) throw new ApiError(409, "A category with this name already exists");

  return Category.create({
    userId,
    name: input.name,
    type: input.type,
    color: input.color,
  });
};

export const updateCategory = async (
  userId: Types.ObjectId,
  id: string,
  input: UpdateCategoryInput,
): Promise<ICategory> => {
  if (input.name) {
    const conflict = await Category.findOne({
      userId,
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${escapeRegex(input.name)}$`, "i") },
    }).exec();

    if (conflict) throw new ApiError(409, "A category with this name already exists");
  }

  const cat = await Category.findOneAndUpdate(
    { _id: id, userId },
    { $set: input },
    { new: true, runValidators: true, context: "query" },
  ).exec();

  if (!cat) throw new ApiError(404, "Category not found");
  return cat;
};

export const deleteCategory = async (
  userId: Types.ObjectId,
  id: string,
): Promise<void> => {
  const cat = await Category.findOne({ _id: id, userId }).exec();
  if (!cat) throw new ApiError(404, "Category not found");

  await Transaction.updateMany(
    { userId, categoryId: cat._id },
    { $set: { categoryId: null } },
  ).exec();

  await cat.deleteOne();
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
