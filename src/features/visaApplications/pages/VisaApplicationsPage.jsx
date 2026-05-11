import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import VisaApplicationsDesktopView from "../component/VisaApplicationsDesktopView";
import VisaApplicationsMobileView from "../component/VisaApplicationsMobileView";
import VisaApplicationsTableFooter from "../component/VisaApplicationsTableFooter";
import { VISA_APPLICATIONS_COPY } from "../constants/visaApplications.constants";
import useVisaApplications from "../hooks/useVisaApplications";

export default function VisaApplicationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useVisaApplications(page, debouncedSearchTerm);
  const copy = data?.copy ?? VISA_APPLICATIONS_COPY;
  const metrics = data?.metrics ?? [];
  const applications = data?.applications ?? [];
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

  const handleViewApplication = (application) => {
    navigate(APP_ROUTES.visaApplicationDetails.replace(":applicationId", String(application.id)), {
      state: { application },
    });
  };

  const tableFooter = (
    <VisaApplicationsTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VisaApplicationsMobileView
        applications={applications}
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onViewApplication={handleViewApplication}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <VisaApplicationsDesktopView
        applications={applications}
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onViewApplication={handleViewApplication}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
