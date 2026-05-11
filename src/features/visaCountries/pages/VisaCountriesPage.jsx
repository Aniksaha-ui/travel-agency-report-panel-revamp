import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import { formatBoardDate } from "../../../utils/dateUtils";
import VisaCountriesDesktopView from "../component/VisaCountriesDesktopView";
import VisaCountriesMobileView from "../component/VisaCountriesMobileView";
import VisaCountriesTableFooter from "../component/VisaCountriesTableFooter";
import { VISA_COUNTRIES_COPY } from "../constants/visaCountries.constants";
import useVisaCountries from "../hooks/useVisaCountries";

export default function VisaCountriesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useVisaCountries(page, debouncedSearchTerm);
  const copy = data?.copy ?? VISA_COUNTRIES_COPY;
  const metrics = data?.metrics ?? [];
  const countries = data?.countries ?? [];
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

  const handleEditCountry = (country) => {
    navigate(APP_ROUTES.visaCountryEdit.replace(":countryId", String(country.id)), {
      state: { country },
    });
  };

  const tableFooter = (
    <VisaCountriesTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VisaCountriesMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        countries={countries}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <VisaCountriesDesktopView
        boardDate={boardDate}
        copy={copy}
        countries={countries}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onEditCountry={handleEditCountry}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
