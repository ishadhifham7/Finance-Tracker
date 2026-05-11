import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Save } from "lucide-react";
import type { Category } from "./types";
import type { UpdateCategoryPayload } from "../../services/categoryService";

interface Props {
  category: Category;
  isUpdating: boolean;
  onSave: (id: string, payload: UpdateCategoryPayload) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#00ff66",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f97316",
  "#6366f1",
  "#a78bfa",
  "#fbbf24",
];

type CategoryType = "income" | "expense" | "both";

export default function EditCategoryModal({
  category,
  isUpdating,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState<CategoryType>(category.type);
  const [color, setColor] = useState(category.color);
  const [nameError, setNameError] = useState("");

  const validate = (): boolean => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (name.trim().length > 100) {
      setNameError("Name must be 100 characters or fewer");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UpdateCategoryPayload = {};
    if (name.trim() !== category.name) payload.name = name.trim();
    if (type !== category.type) payload.type = type;
    if (color !== category.color) payload.color = color;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    onSave(category.id, payload);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Category</h2>
            <p className="modal-subtitle">Update the details below</p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="modal-form">
              {/* Name */}
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Food & Dining"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  maxLength={100}
                  autoFocus
                />
                {nameError && (
                  <span className="form-error">{nameError}</span>
                )}
              </div>

              {/* Type toggle */}
              <div className="form-field">
                <label className="form-label">Type</label>
                <div className="cat-type-toggle">
                  {(["income", "expense", "both"] as CategoryType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`cat-type-toggle-btn${type === t ? " active" : ""} cat-toggle-${t}`}
                      onClick={() => setType(t)}
                    >
                      {t === "both" ? "All types" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div className="form-field">
                <label className="form-label">Color</label>
                <div className="cat-color-grid">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`cat-color-swatch${color === c ? " selected" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                  <label className="cat-color-custom" title="Custom color">
                    <span
                      className="cat-color-swatch cat-color-custom-swatch"
                      style={{ backgroundColor: PRESET_COLORS.includes(color) ? "#374151" : color }}
                    >
                      {!PRESET_COLORS.includes(color) && (
                        <span className="cat-color-check">✓</span>
                      )}
                      {PRESET_COLORS.includes(color) && (
                        <span className="cat-color-plus">+</span>
                      )}
                    </span>
                    <input
                      type="color"
                      className="cat-color-input-hidden"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </label>
                </div>
                <div className="cat-color-preview">
                  <span
                    className="cat-color-dot"
                    style={{ backgroundColor: color }}
                  />
                  <span className="cat-color-hex">{color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-ghost"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="btn-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
