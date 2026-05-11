import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import VisaRequirementsDesktopView from "../component/VisaRequirementsDesktopView";
import VisaRequirementsMobileView from "../component/VisaRequirementsMobileView";
import VisaRequirementsTableFooter from "../component/VisaRequirementsTableFooter";
import { VISA_REQUIREMENTS_COPY } from "../constants/visaRequirements.constants";
import useVisaRequirements from "../hooks/useVisaRequirements";

export default function VisaRequirementsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useVisaRequirements(page, debouncedSearchTerm);
  const copy = data?.copy ?? VISA_REQUIREMENTS_COPY;
  const metrics = data?.metrics ?? [];
  const requirements = data?.requirements ?? [];
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

  const handleEditRequirement = (requirement) => {
    navigate(APP_ROUTES.visaRequirementEdit.replace(":requirementId", String(requirement.id)), {
      state: { requirement },
    });
  };

  const tableFooter = (
    <VisaRequirementsTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VisaRequirementsMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        requirements={requirements}
        searchTerm={searchTerm}
        summary={summary}
      />
      <VisaRequirementsDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onEditRequirement={handleEditRequirement}
        pagination={pagination}
        requirements={requirements}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
