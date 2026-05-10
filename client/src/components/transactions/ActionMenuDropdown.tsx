import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  position: { top: number; right: number };
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ActionMenuDropdown({
  position,
  onEdit,
  onDelete,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className="tx-dropdown"
      style={{ top: position.top, right: position.right }}
    >
      <button
        className="tx-dropdown-item"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <Pencil size={14} />
        Edit
      </button>

      <div className="tx-dropdown-divider" />

      <button
        className="tx-dropdown-item danger"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>,
    document.body,
  );
}
