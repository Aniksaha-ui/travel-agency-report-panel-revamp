import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { Link } from "react-router-dom";
import { getBlogEditRoute } from "../../../constants/routes";

export const getBlogColumns = ({ deletingBlogId, onDeleteBlog }) => [
  {
    key: "coverImage",
    header: "Cover",
    mobileLabel: "Cover",
    render: (blog) =>
      blog.hasCover ? (
        <img src={blog.coverImage} alt={blog.title} className="blogs-cover-thumb" />
      ) : (
        <div className="blogs-cover-thumb blogs-cover-thumb--placeholder">?</div>
      ),
  },
  {
    key: "title",
    header: "Title",
    render: (blog) => (
      <div>
        <div className="fw-semibold">{blog.title}</div>
        <div className="text-secondary small">{blog.slug}</div>
      </div>
    ),
  },
  {
    key: "author",
    header: "Author",
    mobileLabel: "Author",
  },
  {
    key: "publishDateLabel",
    header: "Date",
    mobileLabel: "Date",
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (blog) => <Badge color={blog.statusTone}>{blog.statusLabel}</Badge>,
  },
  {
    key: "actions",
    header: "Actions",
    mobileLabel: "Actions",
    render: (blog) => (
      <div className="d-flex flex-wrap gap-2">
        <Link to={getBlogEditRoute(blog.id)} className="btn btn-outline-primary">
          Edit
        </Link>
        <Button
          variant="danger"
          isLoading={String(deletingBlogId) === String(blog.id)}
          onClick={() => onDeleteBlog(blog)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
