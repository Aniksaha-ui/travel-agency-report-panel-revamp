import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  GUIDE_EFFICIENCY_COPY,
  GUIDE_EFFICIENCY_FALLBACK_RESPONSE,
} from "../constants/guideEfficiency.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();
const shortenLabel = (value, maxLength = 14) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const formatRating = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Unrated";
  }

  return `${toNumber(value).toFixed(1)} / 5`;
};

const getSignal = ({ avgRating, totalPackages, totalTripCost }) => {
  if (avgRating >= 4.5) {
    return { label: "Top rated", tone: "success" };
  }

  if (totalTripCost > 0) {
    return { label: "Cost active", tone: "info" };
  }

  if (totalPackages > 0) {
    return { label: "Assigned", tone: "warning" };
  }

  return { label: "Idle", tone: "neutral" };
};

const filterGuideRows = (payload, search) => {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return payload;
  }

  return {
    ...payload,
    data: (payload?.data ?? []).filter((item) =>
      String(item.guide_name ?? "").toLowerCase().includes(normalizedSearch)
    ),
  };
};

export const normalizeGuideEfficiency = (payload) => {
  const source = Array.isArray(payload?.data) ? payload.data : [];

  const baseGuides = source.map((item) => {
    const avgRating = item.avg_rating === null || item.avg_rating === "" ? null : toNumber(item.avg_rating);
    const totalPackages = toNumber(item.total_packages);
    const totalTripCost = toNumber(item.total_trip_cost);
    const signal = getSignal({ avgRating, totalPackages, totalTripCost });

    return {
      id: item.guide_id,
      guideId: item.guide_id,
      guideName: item.guide_name || "Unnamed guide",
      totalPackages,
      totalTripCost,
      avgRating,
      totalPackagesLabel: formatNumber(totalPackages),
      totalTripCostLabel: formatCurrency(totalTripCost),
      avgRatingLabel: formatRating(avgRating),
      reviewStatusLabel: avgRating === null ? "Waiting for traveler ratings" : "Average traveler score",
      signalLabel: signal.label,
      signalTone: signal.tone,
    };
  });

  const totalPackages = baseGuides.reduce((sum, guide) => sum + guide.totalPackages, 0);
  const totalTripCost = baseGuides.reduce((sum, guide) => sum + guide.totalTripCost, 0);
  const ratedGuides = baseGuides.filter((guide) => guide.avgRating !== null);
  const ratedGuideCount = ratedGuides.length;
  const unratedGuideCount = baseGuides.length - ratedGuideCount;
  const averageRating = ratedGuideCount
    ? ratedGuides.reduce((sum, guide) => sum + guide.avgRating, 0) / ratedGuideCount
    : null;

  const guides = baseGuides.map((guide) => {
    const packageShare = totalPackages ? Math.round((guide.totalPackages / totalPackages) * 100) : 0;
    const tripCostShare = totalTripCost ? Math.round((guide.totalTripCost / totalTripCost) * 100) : 0;

    return {
      ...guide,
      packageShare,
      packageShareLabel: `${packageShare}% of visible packages`,
      tripCostShare,
      tripCostShareLabel: `${tripCostShare}% of visible cost`,
    };
  });

  const topPackageGuide =
    [...guides].sort((first, second) => second.totalPackages - first.totalPackages)[0] ?? null;
  const topCostGuide =
    [...guides].sort((first, second) => second.totalTripCost - first.totalTripCost)[0] ?? null;
  const topRatedGuide =
    [...guides]
      .filter((guide) => guide.avgRating !== null)
      .sort((first, second) => second.avgRating - first.avgRating)[0] ?? null;
  const costActiveGuides = guides.filter((guide) => guide.totalTripCost > 0).length;

  return {
    copy: GUIDE_EFFICIENCY_COPY,
    metrics: [
      {
        id: "visible-guides",
        label: "Visible guides",
        value: formatNumber(guides.length),
        change: `${formatNumber(ratedGuideCount)} rated guide${ratedGuideCount === 1 ? "" : "s"}`,
        changeTone: "info",
      },
      {
        id: "packages-handled",
        label: "Packages handled",
        value: formatNumber(totalPackages),
        change: topPackageGuide ? `${topPackageGuide.guideName} leads the list` : "No guide data available",
        changeTone: "success",
      },
      {
        id: "team-rating",
        label: "Average rating",
        value: averageRating === null ? "Unrated" : `${averageRating.toFixed(1)} / 5`,
        change:
          averageRating === null
            ? "Traveler ratings have not been submitted yet"
            : `${formatNumber(unratedGuideCount)} unrated guide${unratedGuideCount === 1 ? "" : "s"}`,
        changeTone: "warning",
      },
      {
        id: "trip-cost-total",
        label: "Trip cost total",
        value: formatCurrency(totalTripCost),
        change: `${formatNumber(costActiveGuides)} guide${costActiveGuides === 1 ? "" : "s"} with recorded cost`,
        changeTone: "danger",
      },
    ],
    guides,
    summary: {
      totalGuides: guides.length,
      totalGuidesLabel: formatNumber(guides.length),
      totalPackages,
      totalPackagesLabel: formatNumber(totalPackages),
      totalTripCost,
      totalTripCostLabel: formatCurrency(totalTripCost),
      averageRating,
      averageRatingLabel: averageRating === null ? "Unrated" : `${averageRating.toFixed(1)} / 5`,
      ratedGuideCount,
      ratedGuideCountLabel: formatNumber(ratedGuideCount),
      unratedGuideCount,
      unratedGuideCountLabel: formatNumber(unratedGuideCount),
      topPackageGuide,
      topCostGuide,
      topRatedGuide,
      costActiveGuidesLabel: formatNumber(costActiveGuides),
    },
    charts: {
      packageTrend: guides.slice(0, 6).map((guide) => ({
        id: guide.id,
        label: shortenLabel(guide.guideName, 12),
        packages: guide.totalPackages,
        rating: guide.avgRating ?? 0,
      })),
      packageRanking: [...guides]
        .sort((first, second) => second.totalPackages - first.totalPackages)
        .slice(0, 5)
        .map((guide) => ({
          id: guide.id,
          label: shortenLabel(guide.guideName, 20),
          value: guide.totalPackages,
        })),
      costRanking: [...guides]
        .sort((first, second) => second.totalTripCost - first.totalTripCost)
        .slice(0, 5)
        .map((guide) => ({
          id: guide.id,
          label: shortenLabel(guide.guideName, 20),
          value: guide.totalTripCost,
        })),
    },
  };
};

export const getGuideEfficiency = async ({ search = "" } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.guideEfficiency);

    if (response.data) {
      return normalizeGuideEfficiency(filterGuideRows(response.data, search));
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeGuideEfficiency(filterGuideRows(GUIDE_EFFICIENCY_FALLBACK_RESPONSE, search));
};
