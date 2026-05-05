import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DATE_INPUT_FORMATS = [
  "YYYY-MM-DD",
  "YYYY-M-D",
  "YYYY-MM",
  "YYYY-M",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm",
];

const normalizeValue = (value) => String(value ?? "").trim();

export const toDayjs = (value) => {
  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value : null;
  }

  if (value == null || value === "") {
    return null;
  }

  if (value instanceof Date || typeof value === "number") {
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate : null;
  }

  const normalizedValue = normalizeValue(value);
  const directlyParsed = dayjs(normalizedValue);

  if (directlyParsed.isValid()) {
    return directlyParsed;
  }

  const isoLikeValue = normalizedValue.includes(" ") ? normalizedValue.replace(" ", "T") : normalizedValue;
  const isoLikeParsed = dayjs(isoLikeValue);

  if (isoLikeParsed.isValid()) {
    return isoLikeParsed;
  }

  for (const inputFormat of DATE_INPUT_FORMATS) {
    const parsedDate = dayjs(normalizedValue, inputFormat, true);

    if (parsedDate.isValid()) {
      return parsedDate;
    }
  }

  return null;
};

export const formatDate = (value, format = "MMM D, YYYY", fallback = "Not available") => {
  const parsedDate = toDayjs(value);

  return parsedDate ? parsedDate.format(format) : fallback;
};

export const formatTravelDate = (value, fallback = "Not available") =>
  formatDate(value, "MMM D, YYYY", fallback);

export const formatDateTime = (value, fallback = "Not available") =>
  formatDate(value, "MMM D, YYYY h:mm A", fallback);

export const formatShortDate = (value, fallback = "N/A") => formatDate(value, "MMM D", fallback);

export const formatBoardDate = (value = new Date(), fallback = "") =>
  formatDate(value, "ddd, MMM D", fallback);

export const formatMonthLabel = (value, fallback = "Unknown month") =>
  formatDate(value, "MMM YYYY", fallback);

export const formatLongMonthLabel = (value, fallback = "Unknown month") =>
  formatDate(value, "MMMM YYYY", fallback);

export const formatYearLabel = (value, fallback = "") => formatDate(value, "YYYY", fallback);

export const toDateKey = (value, fallback = "") => formatDate(value, "YYYY-MM-DD", fallback);

export const parseDateKey = (value) => {
  const parsedDate = dayjs(normalizeValue(value), ["YYYY-MM-DD", "YYYY-M-D"], true);

  return parsedDate.isValid() ? parsedDate : dayjs();
};
