import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { Link } from "react-router-dom";
import { APP_ROUTES, getBlogEditRoute } from "../../../constants/routes";

export default function BlogsMobileView({
  blogs,
  boardDate,
  changePage,
  copy,
  deletingBlogId,
  error,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onDeleteBlog,
  page,
  pagination,
  searchTerm,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile blogs-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero blogs-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/blog-list</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Published posts</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.publishedBlogsLabel ?? "0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.latestBlog?.title ?? "No blog posts available yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.draftBlogsLabel ?? "0"} drafts</span>
                <span>{summary.withCoverBlogsLabel ?? "0"} with cover</span>
              </div>
            </div>

            <div className="trip-performance-mobile__metric-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="trip-performance-mobile__metric">
                  <div className="trip-performance-mobile__metric-label">{metric.label}</div>
                  <div className="trip-performance-mobile__metric-value">{metric.value}</div>
                  <div className="trip-performance-mobile__metric-meta">{metric.change}</div>
                </article>
              ))}
            </div>
          </section>

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">{error.message || "Unable to load blog information."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Blog ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Search blog posts and manage the current list from mobile
                </div>
              </div>
              <Link to={APP_ROUTES.blogCreate} className="btn btn-primary btn-sm">
                Add new
              </Link>
            </div>

            <div className="trip-performance-mobile__pill mb-3">
              Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
            </div>

            <div className="trip-performance-mobile__search">
              <span className="trip-performance-mobile__search-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search blogs"
                aria-label="Search blogs"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {blogs.length ? (
                blogs.map((blog) => (
                  <article key={blog.id} className="trip-performance-mobile__item blogs-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div className="blogs-mobile__cover-wrap">
                        {blog.hasCover ? (
                          <img src={blog.coverImage} alt={blog.title} className="blogs-mobile__cover" />
                        ) : (
                          <div className="blogs-mobile__cover blogs-mobile__cover--placeholder">?</div>
                        )}
                        <div>
                          <div className="trip-performance-mobile__item-title">{blog.title}</div>
                          <div className="trip-performance-mobile__item-meta">{blog.slug}</div>
                        </div>
                      </div>
                      <Badge color={blog.statusTone}>{blog.statusLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{blog.author}</div>
                        <div className="trip-performance-mobile__item-grid-label">Author</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{blog.publishDateLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Published</div>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Link to={getBlogEditRoute(blog.id)} className="btn btn-outline-primary btn-mobile-full">
                        Edit blog
                      </Link>
                      <Button
                        variant="danger"
                        fullWidthOnMobile
                        isLoading={String(deletingBlogId) === String(blog.id)}
                        onClick={() => onDeleteBlog(blog)}
                      >
                        Delete blog
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading blogs..." : "No blog rows available."}
                </div>
              )}
            </div>

            <div className="trip-performance-mobile__pager">
              <Button
                variant="outline"
                fullWidthOnMobile
                disabled={!pagination.hasPrev || isFetching}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </Button>
              <Button
                fullWidthOnMobile
                disabled={!pagination.hasNext || isFetching}
                onClick={() => changePage(page + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
