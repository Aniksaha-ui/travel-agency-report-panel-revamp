import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import BookingsDesktopView from "../component/BookingsDesktopView";
import BookingsMobileView from "../component/BookingsMobileView";
import BookingsTableFooter from "../component/BookingsTableFooter";
import { BOOKINGS_COPY } from "../constants/bookings.constants";
import useBookings from "../hooks/useBookings";

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading } = useBookings(page, debouncedSearchTerm);
  const copy = data?.copy ?? BOOKINGS_COPY;
  const metrics = data?.metrics ?? [];
  const bookings = data?.bookings ?? [];
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

  const tableFooter = (
    <BookingsTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <BookingsMobileView
        boardDate={boardDate}
        bookings={bookings}
        changePage={changePage}
        copy={copy}
        error={error}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <BookingsDesktopView
        boardDate={boardDate}
        copy={copy}
        error={error}
        bookings={bookings}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
