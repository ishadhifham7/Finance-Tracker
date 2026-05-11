import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  position: { top: number; right: number };
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function CategoryActionMenu({
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
      className="cat-dropdown"
      style={{ top: position.top, right: position.right }}
    >
      <button
        className="cat-dropdown-item"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <Pencil size={13} />
        Edit
      </button>

      <div className="cat-dropdown-divider" />

      <button
        className="cat-dropdown-item danger"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>,
    document.body,
  );
}
