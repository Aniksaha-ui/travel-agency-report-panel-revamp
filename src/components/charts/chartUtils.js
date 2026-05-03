export const formatTooltipLabel = (label, payload, labelKey = "label") =>
  payload?.[0]?.payload?.[labelKey] ?? label;

export const formatTooltipValue = (valueFormatter, fallbackLabel = "Value") =>
  (value, name) => [valueFormatter(value), name || fallbackLabel];
