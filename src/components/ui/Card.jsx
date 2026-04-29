import { classNames } from "../../utils/classNames";

export default function Card({
  actions,
  bodyClassName,
  children,
  className,
  footer,
  headerClassName,
  subtitle,
  title,
}) {
  return (
    <div className={classNames("card shadow-sm", className)}>
      {(title || subtitle || actions) && (
        <div
          className={classNames(
            "card-header d-flex align-items-start justify-content-between gap-3",
            headerClassName
          )}
        >
          <div className="card-header__copy">
            {title ? <h3 className="card-title mb-1">{title}</h3> : null}
            {subtitle ? <p className="text-secondary mb-0">{subtitle}</p> : null}
          </div>
          {actions ? <div className="card-actions-wrap">{actions}</div> : null}
        </div>
      )}
      <div className={classNames("card-body", bodyClassName)}>{children}</div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </div>
  );
}
