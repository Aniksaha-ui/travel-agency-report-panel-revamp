import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import VisaTypesDesktopView from "../component/VisaTypesDesktopView";
import VisaTypesMobileView from "../component/VisaTypesMobileView";
import VisaTypesTableFooter from "../component/VisaTypesTableFooter";
import { VISA_TYPES_COPY } from "../constants/visaTypes.constants";
import useVisaTypes from "../hooks/useVisaTypes";

export default function VisaTypesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useVisaTypes(page, debouncedSearchTerm);
  const copy = data?.copy ?? VISA_TYPES_COPY;
  const metrics = data?.metrics ?? [];
  const visaTypes = data?.visaTypes ?? [];
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

  const handleEditVisaType = (visaType) => {
    navigate(APP_ROUTES.visaTypeEdit.replace(":visaTypeId", String(visaType.id)), {
      state: { visaType },
    });
  };

  const tableFooter = (
    <VisaTypesTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VisaTypesMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        visaTypes={visaTypes}
      />
      <VisaTypesDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onEditVisaType={handleEditVisaType}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        visaTypes={visaTypes}
      />
    </AdminLayout>
  );
}
