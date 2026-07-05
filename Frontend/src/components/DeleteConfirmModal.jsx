import "../style/modal.scss"

const DeleteConfirmModal = ({ open, title, message, onConfirm, onCancel, busy }) => {
    if (!open) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal__actions">
                    <button type="button" className="button" onClick={onCancel} disabled={busy}>
                        Cancel
                    </button>
                    <button type="button" className="button primary-button" onClick={onConfirm} disabled={busy}>
                        {busy ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
