import { classNames } from "../../utils/classNames";

export default function InputField({
  className,
  description,
  error,
  icon,
  label,
  ...props
}) {
  return (
    <div className={className}>
      {label ? <label className="form-label">{label}</label> : null}
      <div className="input-icon">
        {icon ? <span className="input-icon-addon">{icon}</span> : null}
        <input
          className={classNames("form-control", error && "is-invalid")}
          {...props}
        />
      </div>
      {description ? <small className="form-hint">{description}</small> : null}
      {error ? <div className="invalid-feedback d-block">{error}</div> : null}
    </div>
  );
}
