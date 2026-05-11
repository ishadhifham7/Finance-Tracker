import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { CreateCategoryPayload } from "../../services/categoryService";

interface Props {
  isCreating: boolean;
  onSave: (payload: CreateCategoryPayload) => void;
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

export default function CreateCategoryModal({
  isCreating,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("both");
  const [color, setColor] = useState(PRESET_COLORS[0]);
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
    onSave({ name: name.trim(), type, color });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">New Category</h2>
            <p className="modal-subtitle">Add a category to organise transactions</p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isCreating}
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
                        <span
                          className="cat-color-check"
                          style={{ color: "#fff" }}
                        >
                          ✓
                        </span>
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
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="btn-spinner" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus size={13} />
                  Create Category
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
