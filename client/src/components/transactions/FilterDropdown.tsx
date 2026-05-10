import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minWidth?: number;
}

export default function FilterDropdown({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  minWidth = 120,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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
