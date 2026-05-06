import { API_URLS } from "../../../constants/apiUrls";
import { APP_CONFIG } from "../../../services/config";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { BLOGS_COPY } from "../constants/blogs.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const buildImageUrl = (filePath) => {
  const normalizedPath = String(filePath ?? "").replace(/\\/g, "/").replace(/^\/+/, "");

  if (!normalizedPath) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const baseUrl = String(APP_CONFIG.imageBaseUrl || "").replace(/\/+$/, "");

  return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
};

const normalizeStatus = (value) => normalizeString(value, "draft").toLowerCase();

const getStatusTone = (status) => {
  if (status === "published") {
    return "success";
  }

  if (status === "draft") {
    return "warning";
  }

  return "neutral";
};

const getRowsSource = (payload) => {
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const getPaginationSource = (payload) => {
  if (payload?.data?.data && !Array.isArray(payload.data.data)) {
    return payload.data.data;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload ?? {};
};

export const normalizeBlog = (item) => {
  const statusKey = normalizeStatus(item?.status);
  const title = normalizeString(item?.title, "Untitled blog");
  const slug = normalizeString(item?.slug, "No slug");
  const author = normalizeString(item?.author, "Unknown author");
  const publishDate =
    item?.publish_date ?? item?.publishDate ?? item?.created_at ?? item?.updated_at ?? "";
  const coverImage = buildImageUrl(item?.cover_image ?? item?.coverImage ?? item?.image);

  return {
    id: item?.id,
    blogId: item?.id,
    title,
    slug,
    author,
    publishDate,
    publishDateLabel: formatDateTime(publishDate, "Not available"),
    statusKey,
    statusLabel: normalizeString(item?.status, "Draft"),
    statusTone: getStatusTone(statusKey),
    coverImage,
    hasCover: Boolean(coverImage),
  };
};

export const normalizeBlogs = (payload) => {
  const source = getPaginationSource(payload?.data ?? payload);
  const blogs = getRowsSource(payload?.data ?? payload).map(normalizeBlog);
  const publishedBlogs = blogs.filter((blog) => blog.statusKey === "published");
  const draftBlogs = blogs.filter((blog) => blog.statusKey === "draft");
  const withCoverBlogs = blogs.filter((blog) => blog.hasCover);
  const latestBlog = blogs[0] ?? null;

  return {
    copy: BLOGS_COPY,
    metrics: [
      {
        id: "blogs-total",
        label: "Total blogs",
        value: formatNumber(source.total ?? blogs.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "blogs-visible",
        label: "Visible posts",
        value: formatNumber(blogs.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "blogs-published",
        label: "Published",
        value: formatNumber(publishedBlogs.length),
        change: `${formatNumber(draftBlogs.length)} drafts on this page`,
        changeTone: "warning",
      },
      {
        id: "blogs-cover",
        label: "With cover image",
        value: formatNumber(withCoverBlogs.length),
        change: latestBlog ? `Latest: ${latestBlog.title}` : "No blog posts available",
        changeTone: "danger",
      },
    ],
    blogs,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || blogs.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      totalBlogsLabel: formatNumber(source.total ?? blogs.length),
      visibleBlogsLabel: formatNumber(blogs.length),
      publishedBlogsLabel: formatNumber(publishedBlogs.length),
      draftBlogsLabel: formatNumber(draftBlogs.length),
      withCoverBlogsLabel: formatNumber(withCoverBlogs.length),
      latestBlog,
    },
  };
};

export const getBlogs = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.request({
      method: "get",
      url: buildUrlWithQuery(API_URLS.reports.blogs, { page, search: search || undefined }),
    });

    if (response.data) {
      return normalizeBlogs(response.data);
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

  throw new Error("Unable to load blog information right now.");
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await apiClient.delete(`${API_URLS.reports.blogs}/${blogId}`);

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

  throw new Error("Unable to delete this blog right now.");
};

export const normalizeBlogDetails = (payload) => {
  const source = payload?.data ?? payload ?? {};

  return {
    id: source.id ?? "",
    title: normalizeString(source.title),
    slug: normalizeString(source.slug),
    author: normalizeString(source.author),
    publishDate: normalizeString(source.publishDate ?? source.publish_date),
    status: normalizeString(source.status, "draft") || "draft",
    metaDescription: normalizeString(source.metaDescription ?? source.meta_description),
    coverImage: normalizeString(source.coverImage ?? source.cover_image ?? source.image),
    content: normalizeString(source.content),
    componentsJson: normalizeString(source.components_json, "[]"),
  };
};

export const getBlogDetails = async (blogId) => {
  try {
    const response = await apiClient.get(`${API_URLS.reports.blogs}/${blogId}`);

    if (response.data) {
      return normalizeBlogDetails(response.data);
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

  throw new Error("Unable to load this blog right now.");
};

const buildBlogPayload = (values) => ({
  title: normalizeString(values.title),
  slug: normalizeString(values.slug),
  author: normalizeString(values.author),
  publishDate: normalizeString(values.publishDate),
  status: normalizeString(values.status, "draft") || "draft",
  metaDescription: normalizeString(values.metaDescription),
  coverImage: normalizeString(values.coverImage),
  content: normalizeString(values.content),
  components_json: normalizeString(values.componentsJson, "[]"),
});

export const createBlog = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.blogs, buildBlogPayload(values));

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

  throw new Error("Unable to create this blog right now.");
};

export const updateBlog = async (blogId, values) => {
  try {
    const response = await apiClient.post(
      `${API_URLS.reports.blogs}/update/${blogId}`,
      buildBlogPayload(values),
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

  throw new Error("Unable to update this blog right now.");
};
