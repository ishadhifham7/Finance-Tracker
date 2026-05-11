import "../styles/categories.css";
import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryCardSkeleton from "../components/categories/CategoryCardSkeleton";
import CreateCategoryModal from "../components/categories/CreateCategoryModal";
import EditCategoryModal from "../components/categories/EditCategoryModal";
import DeleteCategoryModal from "../components/categories/DeleteCategoryModal";
import BudgetCard from "../components/budgets/BudgetCard";
import ActiveBudgetCardSkeleton from "../components/budgets/ActiveBudgetCardSkeleton";
import AllocateBudgetPopover from "../components/budgets/AllocateBudgetPopover";
import DeleteBudgetModal from "../components/budgets/DeleteBudgetModal";
import { useCategories } from "../hooks/useCategories";
import { useBudgets } from "../hooks/useBudgets";
import type { Category } from "../components/categories/types";
import type { BudgetAnalytics } from "../services/budgetService";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from "../services/categoryService";
import { updateBudget, deleteBudget } from "../services/budgetService";

const SKELETON_COUNT = 6;

export default function Categories() {
  const { categories, isLoading, error, refresh } = useCategories();
  const {
    budgets,
    isLoading: isBudgetsLoading,
    refresh: refreshBudgets,
  } = useBudgets();

  const budgetedCategoryIds = new Set(budgets.map((b) => b.category.id));
  const unbudgetedCategories = categories.filter(
    (c) => !budgetedCategoryIds.has(c.id),
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [editBudgetTarget, setEditBudgetTarget] = useState<{
    budgetId: string;
    amount: number;
  } | null>(null);
  const [deleteBudgetTarget, setDeleteBudgetTarget] =
    useState<BudgetAnalytics | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  const [allocateTarget, setAllocateTarget] = useState<{
    category: Category;
    anchorRect: DOMRect;
  } | null>(null);

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
    budgetAmount?: number,
  ) => {
    setIsUpdating(true);
    try {
      const tasks: Promise<unknown>[] = [];
      if (Object.keys(payload).length > 0) {
        tasks.push(updateCategory(id, payload));
      }
      if (editBudgetTarget && budgetAmount !== undefined) {
        tasks.push(
          updateBudget(editBudgetTarget.budgetId, { amount: budgetAmount }),
        );
      }

      if (tasks.length === 0) {
        setEditTarget(null);
        setEditBudgetTarget(null);
        return;
      }

      await Promise.all(tasks);
      setEditTarget(null);
      setEditBudgetTarget(null);
      toast.success("Changes saved");
      refresh();
      refreshBudgets();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update";
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
    setEditBudgetTarget(null);
  };

  const handleDeleteOpen = (id: string) => {
    setDeleteTarget(categories.find((c) => c.id === id) ?? null);
  };

  const handleAllocateBudget = (id: string, anchorRect: DOMRect) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setAllocateTarget({ category, anchorRect });
  };

  const handleEditBudget = (id: string) => {
    const budget = budgets.find((b) => b.id === id);
    if (!budget) return;
    const category = categories.find((c) => c.id === budget.category.id);
    if (!category) {
      toast.error("Category not found for this budget");
      return;
    }
    setEditTarget(category);
    setEditBudgetTarget({ budgetId: budget.id, amount: budget.budgetAmount });
  };

  const handleDeleteBudget = (id: string) => {
    const budget = budgets.find((b) => b.id === id) ?? null;
    setDeleteBudgetTarget(budget);
  };

  const handleDeleteBudgetConfirm = async () => {
    if (!deleteBudgetTarget) return;
    setIsDeletingBudget(true);
    const target = deleteBudgetTarget;
    setDeleteBudgetTarget(null);
    try {
      await deleteBudget(target.id);
      toast.success("Budget removed");
      refreshBudgets();
    } catch {
      toast.error("Failed to remove budget");
      refreshBudgets();
    } finally {
      setIsDeletingBudget(false);
    }
  };

  return (
    <div className="cat-page-wrapper">
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
          <button
            className="cat-retry-btn"
            onClick={() => {
              refresh();
              refreshBudgets();
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {(isBudgetsLoading || budgets.length > 0) && (
            <section>
              <h2 className="section-title">Active Budgets</h2>
              <div className="active-budgets-grid">
                {isBudgetsLoading
                  ? Array.from({ length: 2 }, (_, i) => (
                      <ActiveBudgetCardSkeleton key={i} />
                    ))
                  : budgets.map((budget) => (
                      <BudgetCard
                        key={budget.id}
                        budget={budget}
                        onEdit={handleEditBudget}
                        onDelete={handleDeleteBudget}
                      />
                    ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="section-title">All Categories</h2>
            <div className="cat-grid">
              {isLoading ? (
                Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))
              ) : unbudgetedCategories.length === 0 && categories.length > 0 ? (
                <div className="cat-empty-state">
                  <p className="cat-empty-title">All set!</p>
                  <p className="cat-empty-sub">
                    All your categories currently have budgets allocated.
                  </p>
                </div>
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
                unbudgetedCategories.map((cat) => (
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
          </section>
        </>
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
          onClose={() => {
            setEditTarget(null);
            setEditBudgetTarget(null);
          }}
          budgetAmount={editBudgetTarget?.amount}
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

      {deleteBudgetTarget && (
        <DeleteBudgetModal
          categoryName={deleteBudgetTarget.category.name}
          isDeleting={isDeletingBudget}
          onConfirm={handleDeleteBudgetConfirm}
          onCancel={() => setDeleteBudgetTarget(null)}
        />
      )}

      {allocateTarget && (
        <AllocateBudgetPopover
          category={allocateTarget.category}
          anchorRect={allocateTarget.anchorRect}
          onClose={() => setAllocateTarget(null)}
          onCreated={() => {
            refreshBudgets();
          }}
        />
      )}
    </div>
  );
}
