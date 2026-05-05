import AdminLayout from "../../../layouts/AdminLayout";
import BookingSummaryDesktopView from "../component/BookingSummaryDesktopView";
import BookingSummaryMobileView from "../component/BookingSummaryMobileView";
import { BOOKING_SUMMARY_COPY } from "../constants/bookingSummary.constants";
import useBookingSummary from "../hooks/useBookingSummary";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function BookingSummaryPage() {
  const { data, isLoading } = useBookingSummary();
  const copy = data?.copy ?? BOOKING_SUMMARY_COPY;
  const metrics = data?.metrics ?? [];
  const categories = data?.categories ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <BookingSummaryMobileView
        boardDate={boardDate}
        categories={categories}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        summary={summary}
      />
      <BookingSummaryDesktopView
        boardDate={boardDate}
        categories={categories}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        summary={summary}
      />
    </AdminLayout>
  );
}
