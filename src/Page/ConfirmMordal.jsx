import "./ConfirmMordal.css";

export default function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h2 className="confirm-title">{title}</h2>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-button cancel"
            onClick={onCancel}
          >
            아니요
          </button>

          <button
            className="confirm-button confirm"
            onClick={onConfirm}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}