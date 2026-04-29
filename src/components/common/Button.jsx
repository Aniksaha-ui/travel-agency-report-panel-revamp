import { classNames } from "../../utils/classNames";

const VARIANT_MAP = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline-primary",
  ghost: "btn-ghost-secondary",
  danger: "btn-danger",
};

export default function Button({
  children,
  className,
  fullWidthOnMobile = false,
  icon,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(
        "btn",
        VARIANT_MAP[variant],
        fullWidthOnMobile && "btn-mobile-full",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
      {!isLoading && icon ? (
        <span className={classNames("d-inline-flex align-items-center", children && "me-2")}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
