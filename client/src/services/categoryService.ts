import api from "./api";
import type { Category } from "../components/categories/types";

interface ListCategoriesResponse {
  status: string;
  data: { categories: Category[] };
}

interface SingleCategoryResponse {
  status: string;
  data: { category: Category };
}

export type CreateCategoryPayload = {
  name: string;
  type: "income" | "expense" | "both";
  color: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<ListCategoriesResponse>("/categories");
  return data.data.categories;
};

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const { data } = await api.post<SingleCategoryResponse>(
    "/categories",
    payload,
  );
  return data.data.category;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> => {
  const { data } = await api.patch<SingleCategoryResponse>(
    `/categories/${id}`,
    payload,
  );
  return data.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
