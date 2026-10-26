// Fenêtre "Êtes-vous sûr ?" avant une action dangereuse (suppression...)
export default function ConfirmDialog({ title, text, confirmLabel = 'Confirmer', onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
