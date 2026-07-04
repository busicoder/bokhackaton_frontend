import { useEffect } from "react";
import './Alert.css';

export default function AlertModal({ message, onClose, title="알림" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className="alert-overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="alert-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="alert-title" id="alert-title">
          {title}
        </h2>

        <p className="alert-message" id="alert-message">
          {message}
        </p>

        <button
          className="alert-confirm"
          type="button"
          onClick={onClose}
          autoFocus
        >
          {!title?"확인":"예약 목록으로 이동"}
        </button>
      </section>
    </div>
  );
}