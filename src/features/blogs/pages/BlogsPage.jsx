import { startTransition, useState } from "react";
import { toast } from "react-toastify";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import BlogsDesktopView from "../component/BlogsDesktopView";
import BlogsMobileView from "../component/BlogsMobileView";
import BlogsTableFooter from "../component/BlogsTableFooter";
import { BLOGS_COPY } from "../constants/blogs.constants";
import useBlogs from "../hooks/useBlogs";
import { deleteBlog } from "../services/blogsService";

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading } = useBlogs(page, debouncedSearchTerm, refreshKey);
  const copy = data?.copy ?? BLOGS_COPY;
  const blogs = data?.blogs ?? [];
  const metrics = data?.metrics ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const boardDate = formatBoardDate();

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setPage(1);
      setSearchTerm(value);
    });
  };

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      return;
    }

    setDeletingBlogId(blog.id);

    try {
      const response = await deleteBlog(blog.id);
      toast.success(response?.message || "Blog deleted successfully.");
      setRefreshKey((current) => current + 1);
    } catch (deleteError) {
      toast.error(deleteError.message || "Unable to delete this blog.");
    } finally {
      setDeletingBlogId(null);
    }
  };

  const tableFooter = (
    <BlogsTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <BlogsMobileView
        blogs={blogs}
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        deletingBlogId={deletingBlogId}
        error={error}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onDeleteBlog={handleDeleteBlog}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <BlogsDesktopView
        blogs={blogs}
        boardDate={boardDate}
        copy={copy}
        deletingBlogId={deletingBlogId}
        error={error}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onDeleteBlog={handleDeleteBlog}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
