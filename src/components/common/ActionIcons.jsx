const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function EditIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export function DeleteIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

export function InvoiceIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M7 3h10l2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

export function DisburseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M3 7h18v10H3z" />
      <path d="M7 7V5h10v2" />
      <path d="M12 10v4" />
      <path d="M10 12h4" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function DeclineIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ResolveIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

export function OpenIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...iconProps}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
