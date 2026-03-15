import { useEffect } from "react";

function Modal({ isOpen, title, children, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="koc-modal-overlay" onClick={onClose} role="presentation">
      <section
        className="koc-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="koc-modal-header">
          <h3>{title}</h3>
          <button type="button" className="koc-modal-close" onClick={onClose}>
            Fechar
          </button>
        </header>
        <div className="koc-modal-content">{children}</div>
      </section>
    </div>
  );
}

export default Modal;
