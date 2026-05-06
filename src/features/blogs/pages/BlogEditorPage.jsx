import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import InputField from "../../../components/forms/InputField";
import SelectField from "../../../components/forms/SelectField";
import Card from "../../../components/ui/Card";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import { createBlog, getBlogDetails, updateBlog } from "../services/blogsService";

const COMPONENT_TYPES = [
  { id: "header", label: "Header", icon: "H1", placeholder: "Section heading" },
  { id: "subheader", label: "Subheader", icon: "H2", placeholder: "Section subheading" },
  { id: "paragraph", label: "Paragraph", icon: "P", placeholder: "Write your paragraph..." },
  { id: "image", label: "Image", icon: "IMG", placeholder: "https://example.com/image.jpg" },
  { id: "quote", label: "Quote", icon: "\"\"", placeholder: "Memorable quote..." },
  { id: "code", label: "Code", icon: "</>", placeholder: "Code snippet..." },
  { id: "highlight", label: "Highlight", icon: "★", placeholder: "Important callout..." },
  { id: "footer", label: "Footer", icon: "_", placeholder: "Closing note..." },
];

const INITIAL_FORM_STATE = {
  title: "",
  slug: "",
  author: "",
  publishDate: "",
  status: "draft",
  metaDescription: "",
  coverImage: "",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const createComponent = (type) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  content: "",
  settings: {
    alignment: "left",
    color: "#0f172a",
    backgroundColor: "",
    caption: "",
  },
});

const sanitizeSlug = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const safeParseComponents = (value) => {
  try {
    const parsedValue = JSON.parse(value || "[]");

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.map((item, index) => ({
      id: item.id ?? `${Date.now()}-${index}`,
      type: item.type ?? "paragraph",
      content: item.content ?? "",
      settings: {
        alignment: item.settings?.alignment ?? "left",
        color: item.settings?.color ?? "#0f172a",
        backgroundColor: item.settings?.backgroundColor ?? "",
        caption: item.settings?.caption ?? "",
      },
    }));
  } catch {
    return [];
  }
};

const getComponentMeta = (type) =>
  COMPONENT_TYPES.find((item) => item.id === type) ?? COMPONENT_TYPES[2];

const getContentHtml = (component) => {
  const content = String(component.content ?? "");
  const caption = String(component.settings?.caption ?? "");
  const textAlign = component.settings?.alignment ?? "left";
  const textColor = component.settings?.color || "#0f172a";
  const backgroundColor = component.settings?.backgroundColor || "transparent";
  const baseStyle = `text-align:${textAlign};color:${textColor};${
    backgroundColor && backgroundColor !== "transparent"
      ? `background:${backgroundColor};padding:12px 14px;border-radius:14px;`
      : ""
  }`;

  if (component.type === "header") {
    return `<h2 style="${baseStyle}">${content || "Header"}</h2>`;
  }

  if (component.type === "subheader") {
    return `<h3 style="${baseStyle}">${content || "Subheader"}</h3>`;
  }

  if (component.type === "paragraph") {
    return `<p style="${baseStyle};line-height:1.8;">${content.replace(/\n/g, "<br>") || "Paragraph"}</p>`;
  }

  if (component.type === "image") {
    return `<figure style="margin:0;text-align:${textAlign};">
      ${
        content
          ? `<img src="${content}" alt="Blog visual" style="max-width:100%;border-radius:18px;border:1px solid rgba(148,163,184,.2);" />`
          : `<div style="padding:24px;border:1px dashed rgba(148,163,184,.4);border-radius:18px;">Image URL preview</div>`
      }
      ${caption ? `<figcaption style="margin-top:10px;color:#64748b;">${caption}</figcaption>` : ""}
    </figure>`;
  }

  if (component.type === "quote") {
    return `<blockquote style="${baseStyle};border-left:4px solid #2563eb;padding-left:16px;font-style:italic;">${
      content || "Quote"
    }</blockquote>`;
  }

  if (component.type === "code") {
    return `<pre style="background:#0f172a;color:#e2e8f0;padding:16px;border-radius:16px;overflow:auto;"><code>${
      content.replace(/</g, "&lt;").replace(/>/g, "&gt;") || "Code block"
    }</code></pre>`;
  }

  if (component.type === "highlight") {
    return `<div style="${baseStyle};border:1px solid rgba(37,99,235,.18);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);">${
      content || "Highlight"
    }</div>`;
  }

  return `<footer style="${baseStyle};font-size:.95rem;color:#475569;">${content || "Footer note"}</footer>`;
};

const buildPreviewHtml = (components) =>
  components.map((component) => getContentHtml(component)).join("");

const validateForm = (values, components) => {
  const nextErrors = {};

  if (!String(values.title).trim()) {
    nextErrors.title = "Title is required.";
  }

  if (!String(values.slug).trim()) {
    nextErrors.slug = "Slug is required.";
  }

  if (!String(values.author).trim()) {
    nextErrors.author = "Author is required.";
  }

  if (!String(values.publishDate).trim()) {
    nextErrors.publishDate = "Publish date is required.";
  }

  if (!components.length) {
    nextErrors.components = "Add at least one content block.";
  }

  return nextErrors;
};

export default function BlogEditorPage() {
  const { blogId = "" } = useParams();
  const isEditMode = Boolean(blogId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [components, setComponents] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [previewMode, setPreviewMode] = useState("desktop");
  const {
    data: blogDetails,
    isLoading: isBlogLoading,
    error: blogError,
  } = useApi({
    queryKey: ["reports", "blog-details", blogId],
    queryFn: () => getBlogDetails(blogId),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setComponents([]);
      setFormErrors({});
      return;
    }

    if (!blogDetails) {
      return;
    }

    setFormValues({
      title: blogDetails.title ?? "",
      slug: blogDetails.slug ?? "",
      author: blogDetails.author ?? "",
      publishDate: blogDetails.publishDate ?? "",
      status: blogDetails.status ?? "draft",
      metaDescription: blogDetails.metaDescription ?? "",
      coverImage: blogDetails.coverImage ?? "",
    });
    setComponents(safeParseComponents(blogDetails.componentsJson));
    setFormErrors({});
  }, [blogDetails, isEditMode]);

  const saveMutation = useMutation({
    mutationFn: (payload) => (isEditMode ? updateBlog(blogId, payload) : createBlog(payload)),
    onSuccess: (response) => {
      toast.success(response?.message || `Blog ${isEditMode ? "updated" : "created"} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["reports", "blogs"] });

      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["reports", "blog-details", blogId] });
      }

      navigate(APP_ROUTES.blogList, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || `Unable to ${isEditMode ? "update" : "create"} this blog.`);
    },
  });

  const previewHtml = useMemo(() => buildPreviewHtml(components), [components]);
  const boardDate = formatBoardDate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: name === "slug" ? sanitizeSlug(value) : value,
    }));
    setFormErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const handleTitleBlur = () => {
    if (!formValues.slug.trim() && formValues.title.trim()) {
      setFormValues((current) => ({
        ...current,
        slug: sanitizeSlug(current.title),
      }));
    }
  };

  const addComponent = (type) => {
    setComponents((current) => [...current, createComponent(type)]);
    setFormErrors((current) => ({
      ...current,
      components: undefined,
    }));
  };

  const updateComponent = (componentId, nextValue) => {
    setComponents((current) =>
      current.map((component) =>
        component.id === componentId ? { ...component, ...nextValue } : component,
      ),
    );
  };

  const updateComponentSetting = (componentId, settingKey, value) => {
    setComponents((current) =>
      current.map((component) =>
        component.id === componentId
          ? {
              ...component,
              settings: {
                ...component.settings,
                [settingKey]: value,
              },
            }
          : component,
      ),
    );
  };

  const removeComponent = (componentId) => {
    setComponents((current) => current.filter((component) => component.id !== componentId));
  };

  const moveComponent = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= components.length || fromIndex === toIndex) {
      return;
    }

    const nextComponents = [...components];
    const [movedComponent] = nextComponents.splice(fromIndex, 1);
    nextComponents.splice(toIndex, 0, movedComponent);
    setComponents(nextComponents);
  };

  const handleDrop = (targetIndex) => {
    if (dragItem.current == null || targetIndex == null) {
      return;
    }

    moveComponent(dragItem.current, targetIndex);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSave = () => {
    const nextErrors = validateForm(formValues, components);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required blog fields before saving.");
      return;
    }

    saveMutation.mutate({
      ...formValues,
      content: previewHtml,
      componentsJson: JSON.stringify(components),
    });
  };

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode ? `/admin/blog/update/${blogId}` : APP_ROUTES.blogCreate}
              </span>
              <h2 className="page-title">{isEditMode ? "Update blog" : "Create blog"}</h2>
              <p className="text-secondary mb-0">
                Build blog content with reusable blocks, metadata, cover image, and live preview.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">{isEditMode ? "Blog ID" : "Mode"}</span>
                <strong>{isEditMode ? `#${blogId}` : "Create flow"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Blocks</span>
                <strong>{components.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {blogError ? (
            <section className="dashboard-section">
              <Card title="Blog editor unavailable" className="trip-performance-card border-0">
                <div className="text-danger">{blogError.message || "Unable to load blog data."}</div>
              </Card>
            </section>
          ) : null}

          <div className="row g-3">
            <div className="col-12 col-xl-7">
              <section className="dashboard-section mt-0">
                <Card
                  title="Post details"
                  subtitle="Set the blog metadata before composing the content body."
                  className="trip-performance-card border-0"
                >
                  <div className="row g-3">
                    <div className="col-md-6">
                      <InputField
                        label="Title"
                        name="title"
                        value={formValues.title}
                        onChange={handleInputChange}
                        onBlur={handleTitleBlur}
                        error={formErrors.title}
                        placeholder="Blog title"
                      />
                    </div>
                    <div className="col-md-6">
                      <InputField
                        label="Slug"
                        name="slug"
                        value={formValues.slug}
                        onChange={handleInputChange}
                        error={formErrors.slug}
                        placeholder="blog-slug"
                      />
                    </div>
                    <div className="col-md-6">
                      <InputField
                        label="Author"
                        name="author"
                        value={formValues.author}
                        onChange={handleInputChange}
                        error={formErrors.author}
                        placeholder="Author name"
                      />
                    </div>
                    <div className="col-md-6">
                      <InputField
                        label="Publish date"
                        name="publishDate"
                        type="date"
                        value={formValues.publishDate}
                        onChange={handleInputChange}
                        error={formErrors.publishDate}
                      />
                    </div>
                    <div className="col-md-6">
                      <SelectField
                        label="Status"
                        name="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        options={STATUS_OPTIONS}
                      />
                    </div>
                    <div className="col-md-6">
                      <InputField
                        label="Cover image"
                        name="coverImage"
                        value={formValues.coverImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="blog-meta-description">
                        Meta description
                      </label>
                      <textarea
                        id="blog-meta-description"
                        className="form-control"
                        rows={3}
                        name="metaDescription"
                        value={formValues.metaDescription}
                        onChange={handleInputChange}
                        placeholder="Short summary for SEO and previews"
                      />
                    </div>
                  </div>
                </Card>
              </section>

              <section className="dashboard-section">
                <Card
                  title="Content tools"
                  subtitle="Add blocks, then edit and reorder them to shape the article."
                  className="trip-performance-card border-0"
                >
                  <div className="blog-builder-tools">
                    {COMPONENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className="blog-builder-tool"
                        onClick={() => addComponent(type.id)}
                      >
                        <span>{type.icon}</span>
                        <strong>{type.label}</strong>
                      </button>
                    ))}
                  </div>

                  {formErrors.components ? (
                    <div className="text-danger small mt-3">{formErrors.components}</div>
                  ) : null}
                </Card>
              </section>

              <section className="dashboard-section">
                <Card
                  title="Content builder"
                  subtitle="Edit each block, adjust alignment and colors, then preview the final story."
                  className="trip-performance-card border-0"
                >
                  {isBlogLoading && isEditMode ? (
                    <div className="text-secondary">Loading blog content...</div>
                  ) : components.length ? (
                    <div className="blog-builder-stack">
                      {components.map((component, index) => {
                        const componentMeta = getComponentMeta(component.type);

                        return (
                          <article
                            key={component.id}
                            className="blog-builder-block"
                            draggable
                            onDragStart={() => {
                              dragItem.current = index;
                            }}
                            onDragEnter={() => {
                              dragOverItem.current = index;
                            }}
                            onDragOver={(event) => event.preventDefault()}
                            onDragEnd={() => handleDrop(dragOverItem.current)}
                          >
                            <div className="blog-builder-block__header">
                              <div className="blog-builder-block__title">
                                <span>{componentMeta.icon}</span>
                                <strong>{componentMeta.label}</strong>
                              </div>

                              <div className="blog-builder-block__actions">
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => moveComponent(index, index - 1)}>
                                  Up
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => moveComponent(index, index + 1)}>
                                  Down
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeComponent(component.id)}>
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="blog-builder-block__settings">
                              <label>
                                Align
                                <select
                                  className="form-select"
                                  value={component.settings.alignment}
                                  onChange={(event) =>
                                    updateComponentSetting(component.id, "alignment", event.target.value)
                                  }
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>
                              </label>
                              <label>
                                Text
                                <input
                                  type="color"
                                  className="form-control form-control-color"
                                  value={component.settings.color}
                                  onChange={(event) =>
                                    updateComponentSetting(component.id, "color", event.target.value)
                                  }
                                />
                              </label>
                              <label>
                                Background
                                <input
                                  type="color"
                                  className="form-control form-control-color"
                                  value={component.settings.backgroundColor || "#ffffff"}
                                  onChange={(event) =>
                                    updateComponentSetting(component.id, "backgroundColor", event.target.value)
                                  }
                                />
                              </label>
                            </div>

                            {component.type === "image" ? (
                              <>
                                <InputField
                                  label="Image URL"
                                  value={component.content}
                                  onChange={(event) =>
                                    updateComponent(component.id, { content: event.target.value })
                                  }
                                  placeholder={componentMeta.placeholder}
                                />
                                <InputField
                                  label="Caption"
                                  value={component.settings.caption}
                                  onChange={(event) =>
                                    updateComponentSetting(component.id, "caption", event.target.value)
                                  }
                                  placeholder="Optional caption"
                                />
                              </>
                            ) : component.type === "header" || component.type === "subheader" || component.type === "footer" ? (
                              <InputField
                                label="Content"
                                value={component.content}
                                onChange={(event) =>
                                  updateComponent(component.id, { content: event.target.value })
                                }
                                placeholder={componentMeta.placeholder}
                              />
                            ) : (
                              <div>
                                <label className="form-label">Content</label>
                                <textarea
                                  className={`form-control ${component.type === "code" ? "blog-builder-code" : ""}`}
                                  rows={component.type === "code" ? 6 : 4}
                                  value={component.content}
                                  onChange={(event) =>
                                    updateComponent(component.id, { content: event.target.value })
                                  }
                                  placeholder={componentMeta.placeholder}
                                />
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="blog-builder-empty">
                      Add your first content block to start composing this blog post.
                    </div>
                  )}
                </Card>
              </section>

              <section className="dashboard-section">
                <div className="d-flex flex-wrap gap-2">
                  <Button isLoading={saveMutation.isPending} onClick={handleSave}>
                    {isEditMode ? "Update blog" : "Create blog"}
                  </Button>
                  <Link to={APP_ROUTES.blogList} className="btn btn-outline-primary">
                    Cancel
                  </Link>
                </div>
              </section>
            </div>

            <div className="col-12 col-xl-5">
              <section className="dashboard-section mt-0">
                <Card
                  title="Live preview"
                  subtitle="Preview the blog in desktop or mobile framing while you edit."
                  className="trip-performance-card border-0 blog-preview-card"
                  actions={
                    <div className="btn-group">
                      <button
                        type="button"
                        className={`btn btn-sm ${previewMode === "desktop" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPreviewMode("desktop")}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${previewMode === "mobile" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPreviewMode("mobile")}
                      >
                        Mobile
                      </button>
                    </div>
                  }
                >
                  <div className={`blog-preview-frame ${previewMode === "mobile" ? "blog-preview-frame--mobile" : ""}`}>
                    <div className="blog-preview-header">
                      <div className="blog-preview-status">{formValues.status || "draft"}</div>
                      <h1>{formValues.title || "Your blog title"}</h1>
                      <p>By {formValues.author || "Author name"}</p>
                      {formValues.publishDate ? <span>{formValues.publishDate}</span> : null}
                    </div>
                    {formValues.coverImage ? (
                      <img src={formValues.coverImage} alt={formValues.title || "Cover"} className="blog-preview-cover" />
                    ) : null}
                    {formValues.metaDescription ? (
                      <div className="blog-preview-meta">{formValues.metaDescription}</div>
                    ) : null}
                    <div
                      className="blog-preview-body"
                      dangerouslySetInnerHTML={{ __html: previewHtml || "<p>Preview content will appear here.</p>" }}
                    />
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
