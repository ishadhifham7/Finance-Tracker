import "../styles/categories.css";
import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryCardSkeleton from "../components/categories/CategoryCardSkeleton";
import CreateCategoryModal from "../components/categories/CreateCategoryModal";
import EditCategoryModal from "../components/categories/EditCategoryModal";
import DeleteCategoryModal from "../components/categories/DeleteCategoryModal";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../components/categories/types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from "../services/categoryService";

const SKELETON_COUNT = 6;

export default function Categories() {
  const { categories, isLoading, error, refresh } = useCategories();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateSave = async (payload: CreateCategoryPayload) => {
    setIsCreating(true);
    try {
      await createCategory(payload);
      setIsCreateOpen(false);
      toast.success("Category created");
      refresh();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create category";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSave = async (
    id: string,
    payload: UpdateCategoryPayload,
  ) => {
    setIsUpdating(true);
    try {
      await updateCategory(id, payload);
      setEditTarget(null);
      toast.success("Category updated");
      refresh();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update category";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteCategory(target.id);
      toast.success("Category deleted");
      refresh();
    } catch {
      toast.error("Failed to delete category");
      refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditTarget(categories.find((c) => c.id === id) ?? null);
  };

  const handleDeleteOpen = (id: string) => {
    setDeleteTarget(categories.find((c) => c.id === id) ?? null);
  };

  const handleAllocateBudget = (_id: string) => {
    // TODO: open budget allocation modal
  };

  return (
    <div>
      <header className="page-header cat-header">
        <div>
          <h1>Categories</h1>
          <p>Organise your income and expenses into categories.</p>
        </div>
        <button
          className="cat-new-btn"
          type="button"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={13} strokeWidth={2.5} />
          New Category
        </button>
      </header>

      {error ? (
        <div className="cat-error-state">
          <p className="cat-error-msg">{error}</p>
          <button className="cat-retry-btn" onClick={refresh}>
            Try again
          </button>
        </div>
      ) : (
        <div className="cat-grid">
          {isLoading ? (
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          ) : categories.length === 0 ? (
            <div className="cat-empty-state">
              <div className="cat-empty-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <p className="cat-empty-title">No categories found</p>
              <p className="cat-empty-sub">
                Create your first category to start organising transactions.
              </p>
              <button
                className="cat-new-btn"
                type="button"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus size={13} strokeWidth={2.5} />
                New Category
              </button>
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onEdit={handleEdit}
                onDelete={handleDeleteOpen}
                onAllocateBudget={handleAllocateBudget}
              />
            ))
          )}
        </div>
      )}

      {isCreateOpen && (
        <CreateCategoryModal
          isCreating={isCreating}
          onSave={handleCreateSave}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editTarget && (
        <EditCategoryModal
          category={editTarget}
          isUpdating={isUpdating}
          onSave={handleUpdateSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteCategoryModal
          categoryName={deleteTarget.name}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
