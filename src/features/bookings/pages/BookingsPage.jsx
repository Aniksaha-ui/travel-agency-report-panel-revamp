import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import BookingsDesktopView from "../component/BookingsDesktopView";
import BookingInvoiceModal from "../component/BookingInvoiceModal";
import BookingsMobileView from "../component/BookingsMobileView";
import BookingsTableFooter from "../component/BookingsTableFooter";
import { BOOKINGS_COPY } from "../constants/bookings.constants";
import useBookings, { useBookingInvoice } from "../hooks/useBookings";

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading } = useBookings(page, debouncedSearchTerm);
  const {
    data: invoice,
    error: invoiceError,
    isLoading: isInvoiceLoading,
  } = useBookingInvoice(selectedBookingId);
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

  const handleOpenInvoice = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const handleCloseInvoice = () => {
    setSelectedBookingId(null);
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
        onOpenInvoice={handleOpenInvoice}
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
        onOpenInvoice={handleOpenInvoice}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
      <BookingInvoiceModal
        bookingId={selectedBookingId}
        error={invoiceError}
        invoice={invoice}
        isLoading={isInvoiceLoading}
        isOpen={Boolean(selectedBookingId)}
        onClose={handleCloseInvoice}
      />
    </AdminLayout>
  );
}

