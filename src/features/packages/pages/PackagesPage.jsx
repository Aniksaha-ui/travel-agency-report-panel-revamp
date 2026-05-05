import { startTransition, useState } from "react";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import PackageDetailsModal from "../component/PackageDetailsModal";
import PackagesDesktopView from "../component/PackagesDesktopView";
import PackagesMobileView from "../component/PackagesMobileView";
import PackagesTableFooter from "../component/PackagesTableFooter";
import { PACKAGES_COPY } from "../constants/packages.constants";
import usePackages from "../hooks/usePackages";
import { getPackageDetails } from "../services/packagesService";

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const { data, isFetching, isLoading } = usePackages(page, searchTerm);
  const {
    data: packageDetails,
    isLoading: isPackageDetailsLoading,
  } = useApi({
    queryKey: ["reports", "package-details", selectedPackageId],
    queryFn: () => getPackageDetails(selectedPackageId),
    enabled: Boolean(selectedPackageId),
  });

  const copy = data?.copy ?? PACKAGES_COPY;
  const metrics = data?.metrics ?? [];
  const packages = data?.packages ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

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

  const handleOpenDetails = (packageId) => {
    setSelectedPackageId(packageId);
  };

  const handleCloseDetails = () => {
    setSelectedPackageId(null);
  };

  const tableFooter = (
    <PackagesTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <PackagesMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        packages={packages}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
      />
      <PackagesDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        hotelsIncludedLabel={summary.hotelIncludedCountLabel ?? "0"}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        packages={packages}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
      <PackageDetailsModal
        isLoading={isPackageDetailsLoading}
        isOpen={Boolean(selectedPackageId)}
        onClose={handleCloseDetails}
        pkg={packageDetails}
      />
    </AdminLayout>
  );
}
