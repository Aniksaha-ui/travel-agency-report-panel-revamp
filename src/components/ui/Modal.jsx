import { useEffect } from "react";
import Button from "../common/Button";
import { classNames } from "../../utils/classNames";

export default function Modal({
  ariaLabel,
  bodyClassName,
  children,
  className,
  closeLabel = "Close",
  dialogClassName,
  isOpen,
  onClose,
  subtitle,
  title,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("app-modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("app-modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={classNames("app-modal", className)} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button
        type="button"
        className="app-modal__backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />

      <div className={classNames("app-modal__dialog", dialogClassName)}>
        <div className="app-modal__header">
          <div>
            <div className="app-modal__title">{title}</div>
            {subtitle ? <div className="app-modal__subtitle">{subtitle}</div> : null}
          </div>
          <Button variant="ghost" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>

        <div className={classNames("app-modal__body", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}
