import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { fetchCategories } from "../../services/categoryService";
import type { Category } from "../categories/types";

interface Props {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  disabled?: boolean;
}

export default function CategorySelect({ value, onChange, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const selected = categories.find((c) => c.id === value) ?? null;

  const handleSelect = (id: string | null) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={wrapRef} className="form-cat-wrap">
      <button
        type="button"
        className={`form-cat-trigger${isOpen ? " open" : ""}`}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled || isLoading}
      >
        <span className="form-cat-trigger-left">
          {isLoading ? (
            <span className="form-cat-placeholder">Loading…</span>
          ) : selected ? (
            <>
              <span
                className="form-cat-dot"
                style={{ backgroundColor: selected.color }}
              />
              <span className="form-cat-name">{selected.name}</span>
            </>
          ) : (
            <span className="form-cat-placeholder">No category</span>
          )}
        </span>
        <ChevronDown
          size={14}
          className={`form-cat-chevron${isOpen ? " rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="form-cat-panel">
          <button
            type="button"
            className={`form-cat-option${value === null ? " selected" : ""}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => handleSelect(null)}
          >
            <span className="form-cat-dot form-cat-dot-empty" />
            <span className="form-cat-option-name">No category</span>
            {value === null && <Check size={12} className="form-cat-check" />}
          </button>

          {categories.length > 0 && <div className="form-cat-divider" />}

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`form-cat-option${value === cat.id ? " selected" : ""}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => handleSelect(cat.id)}
            >
              <span
                className="form-cat-dot"
                style={{ backgroundColor: cat.color }}
              />
              <span className="form-cat-option-name">{cat.name}</span>
              {value === cat.id && (
                <Check size={12} className="form-cat-check" />
              )}
            </button>
          ))}

          {!isLoading && categories.length === 0 && (
            <p className="form-cat-empty">No categories yet</p>
          )}
        </div>
      )}
    </div>
  );
}
