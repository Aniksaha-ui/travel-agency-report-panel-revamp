export default function SelectField({ className, label, options, ...props }) {
  return (
    <div className={className}>
      {label ? <label className="form-label">{label}</label> : null}
      <select className="form-select" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
