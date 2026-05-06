import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getBlogColumns } from "./blogsView.config";

export default function BlogsDesktopView({
  blogs,
  boardDate,
  copy,
  deletingBlogId,
  error,
  handleSearchChange,
  isLoading,
  metrics,
  onDeleteBlog,
  pagination,
  searchTerm,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/blog-list</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Showing</span>
                <strong>
                  {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Published</span>
                <strong>{summary.publishedBlogsLabel ?? "0"}</strong>
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
          {error ? (
            <section className="dashboard-section">
              <Card title="Blog management unavailable" className="trip-performance-card border-0">
                <div className="text-danger">{error.message || "Unable to load blog information."}</div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <Card
              title={copy.ledgerTitle}
              subtitle={copy.ledgerSubtitle}
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex align-items-center gap-2">
                  <SearchField
                    placeholder="Search blogs"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.blogCreate} className="btn btn-primary">
                    Add new
                  </Link>
                </div>
              }
            >
              {isLoading && !blogs.length ? (
                <div className="p-4 text-center text-secondary">Loading blogs...</div>
              ) : (
                <Table
                  columns={getBlogColumns({ deletingBlogId, onDeleteBlog })}
                  data={blogs}
                  emptyTitle="No blogs found"
                  emptyDescription="No blog rows matched the current search."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
