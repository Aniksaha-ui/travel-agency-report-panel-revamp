export default function CheckboxField({
  checked,
  description,
  label,
  onChange,
  ...props
}) {
  return (
    <label className="form-check">
      <input
        type="checkbox"
        className="form-check-input"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span className="form-check-label">{label}</span>
      {description ? <small className="form-hint">{description}</small> : null}
    </label>
  );
}
