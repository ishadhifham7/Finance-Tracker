import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

interface Props<T extends string = string> {
  value: T;
  options: DropdownOption<T>[];
  placeholder: string;
  onChange: (value: T) => void;
  disabled?: boolean;
  minWidth?: number;
}

export default function FilterDropdown<T extends string = string>({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  minWidth = 120,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  const isActive = value !== "";

  return (
    <div
      ref={wrapperRef}
      className={`filter-dropdown-wrap${disabled ? " disabled" : ""}`}
      style={{ minWidth }}
    >
      <button
        type="button"
        className={`filter-trigger${open ? " open" : ""}${isActive ? " active" : ""}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        <span className="filter-trigger-label">{selectedLabel}</span>
        <ChevronDown
          size={13}
          className={`filter-chevron${open ? " rotated" : ""}`}
        />
      </button>

      {open && (
        <div className="filter-dropdown-panel">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-option${opt.value === value ? " selected" : ""}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
