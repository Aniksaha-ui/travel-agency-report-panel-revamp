import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { GUIDES_COPY } from "../constants/guides.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatRating = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "Unrated";
  }

  return `${numericValue.toFixed(1)} / 5`;
};

const getGuideSignal = (guide) => {
  if (guide.ratingValue >= 4.5) {
    return { label: "Top rated", tone: "success" };
  }

  if (guide.ratingValue > 0) {
    return { label: "Rated", tone: "info" };
  }

  if (guide.bio) {
    return { label: "Profile ready", tone: "warning" };
  }

  return { label: "Needs details", tone: "neutral" };
};

export const normalizeGuide = (item) => {
  const ratingValue = toNumber(item?.rating);
  const guide = {
    id: item?.id,
    guideId: item?.id,
    name: normalizeString(item?.name, "Unnamed guide"),
    email: normalizeString(item?.email, "No email"),
    phone: normalizeString(item?.phone, "No phone"),
    bio: normalizeString(item?.bio),
    bioPreview: normalizeString(item?.bio, "No bio added yet."),
    ratingValue,
    ratingLabel: formatRating(item?.rating),
    createdAtLabel: formatDateTime(item?.created_at, "Not available"),
    updatedAtLabel: formatDateTime(item?.updated_at, "Not available"),
  };

  const signal = getGuideSignal(guide);

  return {
    ...guide,
    signalLabel: signal.label,
    signalTone: signal.tone,
  };
};

export const normalizeGuideFormState = (guide = {}) => ({
  id: normalizeString(guide.id),
  userId: normalizeString(guide.user_id),
  name: normalizeString(guide.name),
  email: normalizeString(guide.email),
  phone: normalizeString(guide.phone),
  bio: normalizeString(guide.bio),
  rating: normalizeString(guide.rating),
});

export const normalizeGuides = (payload) => {
  const source = payload?.data ?? {};
  const guides = (source.data ?? []).map(normalizeGuide);
  const ratedGuides = guides.filter((guide) => guide.ratingValue > 0);
  const completeProfiles = guides.filter(
    (guide) => guide.email !== "No email" && guide.phone !== "No phone",
  );
  const topRatedGuide =
    [...ratedGuides].sort((first, second) => second.ratingValue - first.ratingValue)[0] ?? null;

  return {
    copy: GUIDES_COPY,
    metrics: [
      {
        id: "guide-total",
        label: "Total guides",
        value: formatNumber(source.total ?? guides.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(
          source.last_page ?? 1,
        )}`,
        changeTone: "info",
      },
      {
        id: "guide-visible",
        label: "Visible guides",
        value: formatNumber(guides.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "guide-rated",
        label: "Rated guides",
        value: formatNumber(ratedGuides.length),
        change: topRatedGuide ? `${topRatedGuide.name} leads ratings` : "No ratings yet",
        changeTone: "warning",
      },
      {
        id: "guide-profiles",
        label: "Complete profiles",
        value: formatNumber(completeProfiles.length),
        change: `${formatNumber(guides.length - completeProfiles.length)} need contact details`,
        changeTone: "danger",
      },
    ],
    guides,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || guides.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      totalGuidesLabel: formatNumber(source.total ?? guides.length),
      visibleGuidesLabel: formatNumber(guides.length),
      ratedGuidesLabel: formatNumber(ratedGuides.length),
      completeProfilesLabel: formatNumber(completeProfiles.length),
      topRatedGuide,
    },
  };
};

export const getGuides = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.request({
      method: "get",
      url: buildUrlWithQuery(API_URLS.reports.guides, { page, search: search || undefined }),
    });

    if (response.data) {
      return normalizeGuides(response.data);
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load guide information right now.");
};

export const getGuideDetails = async (guideId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleGuide(guideId));

    if (response.data?.data) {
      return response.data.data;
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load guide details right now.");
};

const buildGuideFormData = (values) => {
  const formData = new FormData();

  formData.append("id", normalizeString(values.id));
  formData.append("user_id", normalizeString(values.userId));
  formData.append("name", normalizeString(values.name));
  formData.append("email", normalizeString(values.email));
  formData.append("phone", normalizeString(values.phone));
  formData.append("bio", normalizeString(values.bio));
  formData.append("rating", normalizeString(values.rating));

  return formData;
};

export const createGuide = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.guides, buildGuideFormData(values));

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to create the guide right now.");
};

export const updateGuide = async (values) => {
  try {
    const response = await apiClient.post(
      API_URLS.reports.guideUpdate,
      buildGuideFormData(values),
    );

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to update the guide right now.");
};

