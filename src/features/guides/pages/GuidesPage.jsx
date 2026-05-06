import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import GuidesDesktopView from "../component/GuidesDesktopView";
import GuidesMobileView from "../component/GuidesMobileView";
import GuidesTableFooter from "../component/GuidesTableFooter";
import { GUIDES_COPY } from "../constants/guides.constants";
import useGuides from "../hooks/useGuides";

export default function GuidesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading } = useGuides(page, debouncedSearchTerm);
  const copy = data?.copy ?? GUIDES_COPY;
  const metrics = data?.metrics ?? [];
  const guides = data?.guides ?? [];
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

  const handleEditGuide = (guide) => {
    navigate(APP_ROUTES.guideEdit.replace(":guideId", String(guide.id)), {
      state: { guide },
    });
  };

  const tableFooter = (
    <GuidesTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <GuidesMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        error={error}
        guides={guides}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onEditGuide={handleEditGuide}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <GuidesDesktopView
        boardDate={boardDate}
        copy={copy}
        error={error}
        guides={guides}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onEditGuide={handleEditGuide}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
