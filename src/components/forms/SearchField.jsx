import { classNames } from "../../utils/classNames";

export default function SearchField({
  ariaLabel,
  className,
  onChange,
  placeholder,
  value,
}) {
  return (
    <div className={classNames("dashboard-search trip-performance-search", className)}>
      <div className="input-icon">
        <span className="input-icon-addon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </span>
        <input
          type="search"
          className="form-control"
          placeholder={placeholder}
          aria-label={ariaLabel || placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
