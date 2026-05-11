import { createPortal } from "react-dom";
import { X, Trash2 } from "lucide-react";

interface Props {
  categoryName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCategoryModal({
  categoryName,
  isDeleting,
  onConfirm,
  onCancel,
}: Props) {
  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Delete Category</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-modal-icon">
            <Trash2 size={20} />
          </div>
          <p className="delete-modal-message">
            Are you sure you want to delete{" "}
            <span className="delete-modal-target">
              &ldquo;{categoryName}&rdquo;
            </span>
            ?
          </p>
          <p className="delete-modal-note">
            Transactions in this category will not be deleted — their category
            link will simply be removed.
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="btn-spinner" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={13} />
                Delete Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
