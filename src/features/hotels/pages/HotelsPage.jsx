import { startTransition, useState } from "react";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import HotelDetailsModal from "../component/HotelDetailsModal";
import HotelsDesktopView from "../component/HotelsDesktopView";
import HotelsMobileView from "../component/HotelsMobileView";
import HotelsTableFooter from "../component/HotelsTableFooter";
import { HOTELS_COPY } from "../constants/hotels.constants";
import useHotels from "../hooks/useHotels";
import { getHotelDetails } from "../services/hotelsService";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function HotelsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const { data, isFetching, isLoading } = useHotels(page, searchTerm);
  const {
    data: hotelDetails,
    isLoading: isHotelDetailsLoading,
  } = useApi({
    queryKey: ["reports", "hotel-details", selectedHotelId],
    queryFn: () => getHotelDetails(selectedHotelId),
    enabled: Boolean(selectedHotelId),
  });

  const copy = data?.copy ?? HOTELS_COPY;
  const metrics = data?.metrics ?? [];
  const hotels = data?.hotels ?? [];
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

  const handleOpenDetails = (hotelId) => {
    setSelectedHotelId(hotelId);
  };

  const handleCloseDetails = () => {
    setSelectedHotelId(null);
  };

  const tableFooter = (
    <HotelsTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <HotelsMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        hotels={hotels}
      />
      <HotelsDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        hotels={hotels}
      />
      <HotelDetailsModal
        hotel={hotelDetails}
        isLoading={isHotelDetailsLoading}
        isOpen={Boolean(selectedHotelId)}
        onClose={handleCloseDetails}
      />
    </AdminLayout>
  );
}
